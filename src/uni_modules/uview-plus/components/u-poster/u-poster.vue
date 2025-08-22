<template>
	<view class="up-poster">
		<!-- canvas用于绘制海报 -->
		<canvas 
			v-if="showCanvas" 
			class="up-poster__hidden-canvas" 
			:canvas-id="canvasId" 
			:id="canvasId"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }">
		</canvas>
		<!-- 隐藏的二维码组件，用于生成二维码图片 -->
		<up-qrcode 
			ref="qrCode" 
			:val="qrCodeValue" 
			:size="qrCodeSize" 
			:margin="0" 
            :loadMake="false"
			background="#ffffff"
			foreground="#000000"
			:class="['up-poster__hidden-qrcode', qrCodeShow ? '' : 'up-poster__hidden-qrcode--hidden']"
		/>
	</view>
</template>

<script>
/**
 * Poster 海报组件
 * @description 用于生成海报的组件，支持文本、图片、二维码等元素
 * @tutorial https://ijry.github.io/uview-plus/components/poster.html
 * 
 * @property {Object} json 海报配置JSON数据
 * @property {Object} json.css 海报容器样式
 * @property {Array}  json.views 海报元素列表
 * @property {String} json.views.type 元素类型(text/image/qrcode/view)
 * @property {String} json.views.text 文本内容(仅text类型)
 * @property {String} json.views.src 图片地址(仅image/qrcode类型)
 * @property {Object} json.views.css 元素样式
 * 
 * @example <up-poster :json="posterJson"></up-poster>
 */
export default {
	name: 'up-poster',
	props: {
		json: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			canvasId: 'u-poster-canvas-' + Date.now(),
			showCanvas: false,
			canvasWidth: 0,
			canvasHeight: 0,
			// 二维码相关数据
			qrCodeValue: '',
			qrCodeSize: 200,
			qrCodeShow: false,
			// 存储多个二维码的数据
			qrCodeMap: new Map()
		}
	},
	computed: {
		// 根据传入的css生成文本样式
		getTextStyle() {
			return (css) => {
				const style = {};
				if (css.color) style.color = css.color;
				if (css.fontSize) style.fontSize = css.fontSize;
				if (css.fontWeight) style.fontWeight = css.fontWeight;
				if (css.lineHeight) style.lineHeight = css.lineHeight;
				if (css.textAlign) style.textAlign = css.textAlign;
				return style;
			}
		}
	},
	methods: {
		/**
		 * 导出海报图片
		 * @description 根据json配置生成海报并导出为临时图片路径
		 * @returns {Promise<Object>} 返回包含图片信息的对象
		 * @author jry ijry@qq.com
		 */
		async exportImage() {
			return new Promise(async(resolve, reject) => {
                try {
                    // 获取海报尺寸信息
                    const posterSize = this.json.css;
                    // 将rpx转换为px
                    const width = this.convertRpxToPx(posterSize.width || '750rpx');
                    const height = this.convertRpxToPx(posterSize.height || '1114rpx');
                    
                    // 设置canvas尺寸
                    this.canvasWidth = width;
                    this.canvasHeight = height;
                    this.showCanvas = true;
                    
                    // 等待DOM更新
                    await this.$nextTick();
                    
                    // 创建canvas上下文
                    const ctx = uni.createCanvasContext(this.canvasId, this);
                    
                    // 绘制背景
                    if (posterSize.background) {
                        // 支持渐变背景色
						if (posterSize.background.includes('linear-gradient') || posterSize.background.includes('radial-gradient')) {
							this.drawGradientBackground(ctx, posterSize, 0, 0, width, height);
						} else {
							ctx.setFillStyle(posterSize.background);
                            ctx.fillRect(0, 0, width, height);
						}
                    }
                    
                    // 绘制所有元素
                    for (const item of this.json.views) {
                        await this.drawItem(ctx, item, width, height);
                    }
                    
                    // 绘制到canvas
                    ctx.draw(false, () => {
                        // 等待绘制完成
                        setTimeout(() => {
                            // 导出图片
                            uni.canvasToTempFilePath({
                                canvasId: this.canvasId,
                                success: (res) => {
                                    // 隐藏canvas
                                    this.showCanvas = false;
                                    // 返回图片路径
                                    resolve({
                                        width: width,
                                        height: height,
                                        path: res.tempFilePath,
                                        // H5下添加blob格式
                                        blob: this.dataURLToBlob(res.tempFilePath)
                                    });
                                },
                                fail: (err) => {
                                    // 隐藏canvas
                                    this.showCanvas = false;
                                    reject(new Error('导出图片失败: ' + JSON.stringify(err)));
                                }
                            }, this);
                        }, 300);
                    });
                    
                    // 超时处理
                    setTimeout(() => {
                        this.showCanvas = false;
                        reject(new Error('导出图片超时'));
                    }, 10000);
                } catch (error) {
                    this.showCanvas = false;
                    reject(error);
                }
			});
		},
		
		/**
		 * 绘制单个元素
		 * @description 根据元素类型绘制文本、图片、矩形或二维码到canvas
		 * @param {Object} ctx canvas上下文
		 * @param {Object} item 元素配置信息
		 * @param {Number} canvasWidth canvas宽度
		 * @param {Number} canvasHeight canvas高度
		 * @returns {Promise} 绘制完成的Promise
		 * @author jry ijry@qq.com
		 */
		async drawItem(ctx, item, canvasWidth, canvasHeight) {
			const css = item.css || {};
			const left = this.convertRpxToPx(css.left || '0rpx');
			const top = this.convertRpxToPx(css.top || '0rpx');
			const width = this.convertRpxToPx(css.width || '0rpx');
			const height = this.convertRpxToPx(css.height || '0rpx');
			
			switch (item.type) {
				case 'view':
					// 绘制矩形背景
					if (css.background) {
						// 支持渐变背景色
						if (css.background.includes('linear-gradient') || css.background.includes('radial-gradient')) {
							this.drawGradientBackground(ctx, css, left, top, width, height);
						} else {
							ctx.setFillStyle(css.background);
							// 处理圆角
							if (css.radius) {
								const radius = this.convertRpxToPx(css.radius);
								this.drawRoundRect(ctx, left, top, width, height, radius, css.background);
							} else {
								ctx.fillRect(left, top, width, height);
							}
						}
					}
					break;
					
				case 'text':
					// 设置文本样式
					if (css.color) ctx.setFillStyle(css.color);
					if (css.fontSize) {
						const fontSize = this.convertRpxToPx(css.fontSize);
						ctx.setFontSize(fontSize);
					}
					if (css.fontWeight) {
						ctx.setLineWidth(css.fontWeight === 'bold' ? 2 : 1);
					}
					
					// 处理文本换行
					if (css.lineClamp) {
						this.drawTextWithLineClamp(ctx, item.text, left, top, width, css);
					} else {
						// 修复：文本垂直居中对齐问题
						const textBaseLine = css.fontSize ? this.convertRpxToPx(css.fontSize) / 2 : 10;
						ctx.fillText(item.text, left, top + textBaseLine);
					}
					break;
					
				case 'image':
					// 绘制图片
					return new Promise((resolve) => {
						uni.getImageInfo({
							src: item.src,
							success: (res) => {
								// 处理圆角
								if (css.radius) {
									const radius = this.convertRpxToPx(css.radius);
									this.clipRoundRect(ctx, left, top, width, height, radius);
								}
								ctx.drawImage(item.src, left, top, width, height);
								// 恢复剪切区域
								ctx.restore();
								resolve();
							},
							fail: () => {
								// 图片加载失败时绘制占位符
								ctx.setFillStyle('#f5f5f5');
								ctx.fillRect(left, top, width, height);
								resolve();
							}
						});
					});
					
				case 'qrcode':
					// 绘制二维码
					if (item.text) {
						// 使用u-qrcode生成二维码图片
						const qrCodeImageUrl = await this.generateQRCode(item.text, width, height);
						return new Promise((resolve) => {
							uni.getImageInfo({
								src: qrCodeImageUrl,
								success: (res) => {
									ctx.drawImage(res.path, left, top, width, height);
									resolve();
								},
								fail: () => {
									// 二维码加载失败时绘制占位符
									ctx.setFillStyle('#f5f5f5');
									ctx.fillRect(left, top, width, height);
									ctx.setFillStyle('#999');
									ctx.setFontSize(12);
									ctx.setTextAlign('center');
									ctx.fillText('QR', left + width/2, top + height/2);
									ctx.setTextAlign('left');
									resolve();
								}
							});
						});
					} else {
						// 绘制二维码占位符
						ctx.setFillStyle('#f5f5f5');
						ctx.fillRect(left, top, width, height);
						ctx.setFillStyle('#999');
						ctx.setFontSize(12);
						ctx.setTextAlign('center');
						ctx.fillText('QR', left + width/2, top + height/2);
						ctx.setTextAlign('left');
					}
					break;
			}
		},
		
		/**
		 * 绘制圆角矩形
		 * @description 绘制指定位置和尺寸的圆角矩形
		 * @param {Object} ctx canvas上下文
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @param {Number} width 宽度
		 * @param {Number} height 高度
		 * @param {Number} radius 圆角半径
		 * @param {String} fillColor 填充颜色
		 * @author jry ijry@qq.com
		 */
		drawRoundRect(ctx, x, y, width, height, radius, fillColor) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
			ctx.lineTo(x + width, y + height - radius);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			ctx.lineTo(x + radius, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
			ctx.lineTo(x, y + radius);
			ctx.quadraticCurveTo(x, y, x + radius, y);
			ctx.closePath();
			if (fillColor) {
				ctx.setFillStyle(fillColor);
				ctx.fill();
			}
			ctx.restore();
		},
		
		/**
		 * 裁剪圆角矩形区域
		 * @description 在canvas上创建圆角矩形裁剪区域
		 * @param {Object} ctx canvas上下文
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @param {Number} width 宽度
		 * @param {Number} height 高度
		 * @param {Number} radius 圆角半径
		 * @author jry ijry@qq.com
		 */
		clipRoundRect(ctx, x, y, width, height, radius) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
			ctx.lineTo(x + width - radius, y);
			ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
			ctx.lineTo(x + width, y + height - radius);
			ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
			ctx.lineTo(x + radius, y + height);
			ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
			ctx.closePath();
			ctx.clip();
		},
		
		/**
		 * 绘制带行数限制的文本
		 * @description 绘制可控制最大行数的文本，超出部分显示省略号
		 * @param {Object} ctx canvas上下文
		 * @param {String} text 文本内容
		 * @param {Number} x x坐标
		 * @param {Number} y y坐标
		 * @param {Number} maxWidth 最大宽度
		 * @param {Object} css 样式配置
		 * @author jry ijry@qq.com
		 */
		drawTextWithLineClamp(ctx, text, x, y, maxWidth, css) {
            const lineClamp = parseInt(css.lineClamp) || 1;
            const lineHeight = css.lineHeight ? this.convertRpxToPx(css.lineHeight) : 20;
            const lines = [];
            let currentLine = '';
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const testLine = currentLine + char;
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && currentLine !== '') {
                    lines.push(currentLine);
                    currentLine = char;
                    
                    // 如果已达最大行数，添加省略号并结束
                    if (lines.length === lineClamp) {
                        if (metrics.width > maxWidth) {
                            // 添加省略号
                            let fitLine = currentLine.substring(0, currentLine.length - 1);
                            while (ctx.measureText(fitLine + '...').width > maxWidth && fitLine.length > 0) {
                                fitLine = fitLine.substring(0, fitLine.length - 1);
                            }
                            lines[lines.length - 1] = fitLine + '...';
                        }
                        break;
                    }
                } else {
                    currentLine = testLine;
                }
                
                // 处理最后一行
                if (i === text.length - 1 && lines.length < lineClamp) {
                    lines.push(currentLine);
                }
            }
            
            // 绘制每一行
            for (let i = 0; i < lines.length; i++) {
                // 修复：正确计算文本垂直位置
                const textBaseLine = css.fontSize ? this.convertRpxToPx(css.fontSize) / 2 : 10;
                ctx.fillText(lines[i], x, y + (i * lineHeight) + textBaseLine);
            }
        },
		
		/**
		 * 生成二维码图片
		 * @description 根据文本内容生成二维码图片URL
		 * @param {String} text 二维码内容
		 * @param {Number} width 二维码宽度
		 * @param {Number} height 二维码高度
		 * @returns {Promise<String>} 二维码图片URL
		 * @author jry ijry@qq.com
		 */
		generateQRCode(text, width, height) {
			return new Promise((resolve) => {
				// 为每个二维码生成唯一标识
				const qrCodeKey = `${text}_${width}_${height}`;
				
				// 检查是否已经生成过该二维码
				if (this.qrCodeMap.has(qrCodeKey)) {
					resolve(this.qrCodeMap.get(qrCodeKey));
					return;
				}
				
				// 使用 u-qrcode 组件生成二维码
				try {
					// 设置二维码参数
					this.qrCodeValue = text;
					this.qrCodeSize = Math.max(width, height);
					this.qrCodeShow = true;
					
					// 等待DOM更新
					this.$nextTick(() => {
						// 获取二维码组件实例并导出图片
						if (this.$refs.qrCode) {
							// 延迟一点时间确保二维码渲染完成
							setTimeout(() => {
								// 调用 u-qrcode 的 toTempFilePath 方法导出图片
								this.$refs.qrCode.toTempFilePath({
									success: (res) => {
										// 缓存二维码图片路径
										this.qrCodeMap.set(qrCodeKey, res.tempFilePath);
										this.qrCodeShow = false;
										resolve(res.tempFilePath);
									},
									fail: (err) => {
										console.error('二维码生成失败:', err);
										this.qrCodeShow = false;
									}
								});
							}, 300);
						} else {
							// 如果没有 u-qrcode 组件，返回占位符
							this.qrCodeShow = false;
						}
					});
				} catch (error) {
					console.error('生成二维码出错:', error);
					this.qrCodeShow = false;
				}
			});
		},
		
		/**
		 * 将rpx单位转换为px
		 * @description 根据屏幕密度将rpx单位转换为px单位
		 * @param {String|Number} rpxValue rpx值
		 * @returns {Number} 转换后的px值
		 * @author jry ijry@qq.com
		 */
		convertRpxToPx(rpxValue) {
			if (typeof rpxValue === 'number') return rpxValue;
			
			// 使用uni-app自带的uni.rpx2px方法
			if (typeof rpxValue === 'string' && rpxValue.endsWith('rpx')) {
				const value = parseFloat(rpxValue);
				return uni.rpx2px(value);
			}
			
			return parseFloat(rpxValue) || 0;
		},
		
		/**
		 * 绘制渐变背景
		 * @description 绘制线性渐变或径向渐变背景
		 * @param {Object} ctx canvas上下文
		 * @param {Object} css 样式配置
		 * @param {Number} left 左边距
		 * @param {Number} top 上边距
		 * @param {Number} width 宽度
		 * @param {Number} height 高度
		 * @author jry ijry@qq.com
		 */
		drawGradientBackground(ctx, css, left, top, width, height) {
			const background = css.background;
			let gradient = null;
			
			// 处理线性渐变
			if (background.includes('linear-gradient')) {
				// 解析线性渐变角度和颜色
				const angleMatch = background.match(/linear-gradient\((\d+)deg/);
				const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
				
				// 根据角度计算渐变起点和终点
				let startX = left, startY = top, endX = left + width, endY = top + height;
				
				// 简化的角度处理（支持常见角度）
				if (angle === 0) {
					startX = left;
					startY = top + height;
					endX = left;
					endY = top;
				} else if (angle === 90) {
					startX = left;
					startY = top;
					endX = left + width;
					endY = top;
				} else if (angle === 180) {
					startX = left;
					startY = top;
					endX = left;
					endY = top + height;
				} else if (angle === 270) {
					startX = left + width;
					startY = top;
					endX = left;
					endY = top;
				}
				
				gradient = ctx.createLinearGradient(startX, startY, endX, endY);
				
				// 解析颜色值
				const colorMatches = background.match(/#[0-9a-fA-F]+|rgba?\([^)]+\)/g);
				if (colorMatches && colorMatches.length >= 2) {
					// 添加渐变色点
					colorMatches.forEach((color, index) => {
						const stop = index / (colorMatches.length - 1);
						gradient.addColorStop(stop, color);
					});
				}
			} 
			// 处理径向渐变
			else if (background.includes('radial-gradient')) {
				// 径向渐变从中心开始
				const centerX = left + width / 2;
				const centerY = top + height / 2;
				const radius = Math.min(width, height) / 2;
				
				gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
				
				// 解析颜色值
				const colorMatches = background.match(/#[0-9a-fA-F]+|rgba?\([^)]+\)/g);
				if (colorMatches && colorMatches.length >= 2) {
					// 添加渐变色点
					colorMatches.forEach((color, index) => {
						const stop = index / (colorMatches.length - 1);
						gradient.addColorStop(stop, color);
					});
				}
			}
			
			if (gradient) {
				ctx.setFillStyle(gradient);
				// 处理圆角
				if (css.radius) {
					const radius = this.convertRpxToPx(css.radius);
					this.drawRoundRect(ctx, left, top, width, height, radius, gradient);
				} else {
					ctx.fillRect(left, top, width, height);
				}
			}
		},
		
		/**
		 * 将dataURL转换为Blob
		 * @description H5环境下将base64格式的dataURL转换为Blob对象
		 * @param {String} dataURL base64格式的图片数据
		 * @returns {Blob} Blob对象
		 * @author jry ijry@qq.com
		 */
		dataURLToBlob(dataURL) {
			// 检查是否为H5环境且是base64数据
			// #ifdef H5
			if (dataURL && dataURL.startsWith('data:image')) {
				const parts = dataURL.split(';base64,');
				const contentType = parts[0].split(':')[1];
				const raw = window.atob(parts[1]);
				const rawLength = raw.length;
				const uInt8Array = new Uint8Array(rawLength);
				
				for (let i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}
				
				return new Blob([uInt8Array], { type: contentType });
			}
			// #endif
			
			return null;
		},
	}
}
</script>

<style lang="scss" scoped>
.up-poster {
	position: relative;
	
	&__canvas {
		position: relative;
		overflow: hidden;
	}
	
	&__hidden-canvas {
		position: fixed;
		top: -10000px;
		left: -10000px;
		z-index: -1;
	}
	
	&__hidden-qrcode {
		position: fixed;
		top: -10000px;
		left: -10000px;
		z-index: -1;
		
		&--hidden {
			display: none;
		}
	}
}
</style>