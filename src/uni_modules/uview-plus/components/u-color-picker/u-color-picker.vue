<template>
	<view class="up-color-picker">
        <view clas="up-color-picker__trigger" @click="show = true"
            :style="{backgroundColor: value}" >
            <slot></slot>
        </view>
		<up-popup :show="show" mode="bottom" round="10" @close="close" :closeOnClickOverlay="true">
			<view class="up-color-picker__content">
				<view class="up-color-picker__header">
					<text class="up-color-picker__title">选择颜色</text>
				</view>
				
				<!-- 纯色/渐变色切换 -->
				<view class="up-color-picker__switch">
					<up-subsection
						:list="[{ name: '纯色' }, { name: '渐变' }]"
						:current="colorTypeIndex"
						@change="changeColorType"
						fontSize="14"
					></up-subsection>
				</view>
				
				<!-- 渐变色选择器 -->
				<view v-if="colorTypeIndex == 1" class="up-color-picker__gradient">
					<!-- 渐变色控制条 -->
					<view 
						class="up-color-picker__gradient-track"
                        :style="{ background: gradientStyle }"
					>
						<view 
							class="up-color-picker__gradient-pointer" 
							v-for="(item, index) in gradientColors" 
							:key="index"
							:style="{ left: getGradientPointerPosition(index) + 'px' }"
                            @click="openColorPickerForGradient(index)"
							@touchstart="onPointerTouchStart($event, index)"
							@touchmove.stop="onPointerTouchMove"
							@touchend.stop="onPointerTouchEnd"
						>
							<view class="up-color-picker__gradient-pointer-inner" :style="{ backgroundColor: item.color }"></view>
						</view>
					</view>
					
					<view class="up-color-picker__gradient-controls">
						<up-button 
							type="primary" 
							size="mini" 
							plain 
							@click="addGradientColor"
							class="up-color-picker__add-btn"
						>
							添加颜色
						</up-button>
					</view>
					
					<!-- 圆形方向选择器 -->
					<view class="up-color-picker__gradient-direction">
						<text>方向:</text>
						<view class="up-color-picker__gradient__direction-circle" 
							@touchstart="onDirectionTouchStart"
							@touchmove="onDirectionTouchMove"
							@touchend="onDirectionTouchEnd">
							<view 
								class="up-color-picker__direction-pointer"
								:style="{ 
									left: directionPointer.x + 'px', 
									top: directionPointer.y + 'px' 
								}"
							></view>
						</view>
					</view>
				</view>

                <!-- 纯色选择器 -->
				<view class="up-color-picker__solid">
					<!-- 饱和度和明度选择区域 -->
					<view 
						class="up-color-picker__saturation" 
						:style="{ backgroundColor: `hsl(${hue}, 100%, 50%)` }"
						@touchstart="onSaturationTouchStart"
						@touchmove="onSaturationTouchMove"
						@touchend="onSaturationTouchEnd"
					>
						<view 
							class="up-color-picker__saturation-pointer" 
							:style="{
								left: saturationPosition.x + 'px',
								top: saturationPosition.y + 'px'
							}"
						></view>
					</view>
					
					<!-- 色相选择 -->
					<view 
						class="up-color-picker__hue"
						@touchstart="onHueTouchStart"
						@touchmove="onHueTouchMove"
						@touchend="onHueTouchEnd"
					>
						<view 
							class="up-color-picker__hue-pointer" 
							:style="{ left: huePosition + 'px' }"
						></view>
					</view>
					
					<!-- 透明度选择 -->
					<view v-if="colorTypeIndex == 0" 
						class="up-color-picker__alpha"
						@touchstart="onAlphaTouchStart"
						@touchmove="onAlphaTouchMove"
						@touchend="onAlphaTouchEnd"
					>
						<view class="up-color-picker__alpha-bg"></view>
						<view 
							class="up-color-picker__alpha-pointer" 
							:style="{ left: alphaPosition + 'px' }"
						></view>
					</view>
				</view>
				
				<!-- 常用颜色 -->
				<view v-if="commonColors && commonColors.length" class="up-color-picker__common">
					<text class="up-color-picker__common-title">常用颜色</text>
					<view class="up-color-picker__common-list">
						<view 
							v-for="(color, index) in commonColors" 
							:key="index"
							class="up-color-picker__common-item"
							:style="{ backgroundColor: color }"
							@click="selectCommonColor(color)"
						></view>
					</view>
				</view>
				
				<!-- 颜色预览和操作按钮 -->
				<view class="up-color-picker__footer">
					<view class="up-color-picker__preview">
						<view 
							class="up-color-picker__preview-color"
							:style="{ backgroundColor: displayColor }"
						></view>
						<text class="up-color-picker__preview-text">{{ displayColor }}</text>
					</view>
					<view class="up-color-picker__actions">
						<up-button 
							type="primary" 
							size="small" 
							@click="confirm"
							class="up-color-picker__btn"
						>
							确定
						</up-button>
						<up-button 
							type="info" 
							size="small" 
							@click="close"
							class="up-color-picker__btn"
						>
							取消
						</up-button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
export default {
	name: 'up-color-picker',
	props: {
		// 初始颜色值
		modelValue: {
			type: String,
			default: '#ff0000'
		},
		// 常用颜色列表
		commonColors: {
			type: Array,
			default: () => [
            ]
		}
	},
	data() {
		return {
            show: false,
			// 颜色类型索引：0-纯色，1-渐变色
			colorTypeIndex: 0,
			// 纯色相关数据
			hue: 0,
			saturation: 100,
			lightness: 50,
			alpha: 1,
			saturationPosition: { x: 150, y: 0 },
			huePosition: 0,
			alphaPosition: 0, // 将在initColor中设置为最右侧
			// 渐变色相关数据
			gradientColors: [
				{ color: '#ff0000', percent: 0 },
				{ color: '#0000ff', percent: 1 }
			],
			gradientDirections: [
				{ label: '从左到右', value: 'to right' },
				{ label: '从上到下', value: 'to bottom' },
				{ label: '从左上到右下', value: 'to bottom right' },
				{ label: '从右上到左下', value: 'to bottom left' }
			],
			currentDirection: { label: '从左到右', value: 'to right' },
			showDirectionPicker: false,
			// 当前选中颜色
			currentColor: '#ff0000',
			// 渐变色控制相关
			draggingPointerIndex: -1,
			directionPointer: { x: 20, y: 20 }, // 默认向右(在圆的右侧)
			// 渐变节点颜色修改相关
			editingGradientIndex: -1,
			// 保存纯色和渐变色的各自状态
			solidColorState: {
				hue: 0,
				saturation: 100,
				lightness: 50,
				alpha: 1,
				saturationPosition: { x: 150, y: 0 },
				huePosition: 0,
				alphaPosition: 0, // 将在initColor中设置为最右侧
				currentColor: '#ff0000'
			},
			gradientColorState: {
				gradientColors: [
					{ color: '#ff0000', percent: 0 },
					{ color: '#0000ff', percent: 1 }
				],
				currentDirection: { label: '从左到右', value: 'to right' },
				directionPointer: { x: 100, y: 0 }
			},
			// 区分预览类型：solid-纯色预览，gradient-整体渐变预览，gradient-point-渐变点预览
			previewType: 'solid'
		}
	},
	computed: {
		// 渐变色样式
		gradientStyle() {
			const colors = this.gradientColors.map(item => `${item.color} ${Math.round(item.percent * 100)}%`).join(', ')
			return `linear-gradient(${this.currentDirection.value}, ${colors})`
		},
		// 显示的颜色预览值
		displayColor() {
			if (this.previewType === 'gradient-point' && this.editingGradientIndex >= 0) {
				return this.gradientColors[this.editingGradientIndex].color;
			}
            console.log(this.editingGradientIndex)
			return this.currentColor;
		}
	},
	watch: {
		show(newVal) {
			if (newVal) {
				this.initColor()
			}
		},
        colorTypeIndex(newVal) {
            if (newVal == 0) {
                this.editingGradientIndex = -1
            }
		},
	},
	mounted() {
		this.initColor()
	},
    emits: ['update:modelValue', 'confirm', 'close'],
	methods: {
		// 初始化颜色
		initColor() {
			if (this.modelValue) {
				this.currentColor = this.modelValue
				if (this.modelValue.includes('linear-gradient')) {
					// 解析渐变色
					this.colorTypeIndex = 1
					this.parseGradientColor(this.modelValue)
					this.previewType = 'gradient';
				} else {
					// 解析纯色
					this.colorTypeIndex = 0
					this.parseSolidColor(this.modelValue)
					this.previewType = 'solid';
				}
			}
            // 初始化方向指针位置
            this.initDirectionPointer();
            // 初始化alphaPosition为最右侧
            this.initAlphaPosition();
		},
		
        // 初始化alpha位置为最右侧
        async initAlphaPosition() {
            const query = uni.createSelectorQuery().in(this);
            query.select('.up-color-picker__alpha').boundingClientRect();
            await this.$nextTick();
            query.exec(res => {
                const rect = res[0];
                if (rect) {
                    this.alphaPosition = rect.width || 150; // 默认150像素
                } else {
                    this.alphaPosition = 150; // 默认值
                }
                
                // 同步solidColorState中的alphaPosition
                this.solidColorState.alphaPosition = this.alphaPosition;
                this.updateSolidColor();
            });
        },
        
        // 初始化方向指针位置
        initDirectionPointer() {
            const angle = this.getDirectionAngle(this.currentDirection.value);
            this.setDirectionPointerByAngle(angle);
        },
        
        // 根据方向值获取角度
        getDirectionAngle(direction) {
            switch(direction) {
                case 'to right': return 0;
                case 'to bottom': return 90;
                case 'to left': return 180;
                case 'to top': return 270;
                case 'to bottom right': return 45;
                case 'to bottom left': return 135;
                case 'to top left': return 225;
                case 'to top right': return 315;
                default: return 0;
            }
        },
        
        // 根据角度设置方向指针位置
        setDirectionPointerByAngle(angle) {
            const radian = angle * Math.PI / 180;
            const radius = 20; // 圆半径
            this.directionPointer = {
                x: radius * Math.cos(radian) + 20, // 20是圆心位置
                y: radius * Math.sin(radian) + 20
            };
        },
		
		// 打开颜色选择器以修改渐变节点颜色
		openColorPickerForGradient(index) {
			this.editingGradientIndex = index;
			// 设置当前颜色为选中节点的颜色
			const color = this.gradientColors[index].color;
			this.currentColor = color;
			// 设置预览类型为渐变点预览
			this.previewType = 'gradient-point';
			
			// 解析颜色并设置选择器位置
			if (!color.includes('linear-gradient')) {
				this.colorTypeIndex = 0;
				this.parseSolidColor(color);
				// 保存当前渐变状态
				this.gradientColorState = {
					gradientColors: [...this.gradientColors],
					currentDirection: {...this.currentDirection},
					directionPointer: {...this.directionPointer}
				};
			}
		},
		
		// 解析纯色
		parseSolidColor(color) {
			// 简化处理，实际项目中可以使用更复杂的颜色解析
			this.currentColor = color
			// 如果正在编辑渐变节点，则更新该节点颜色
			if (this.editingGradientIndex >= 0) {
				this.gradientColors[this.editingGradientIndex].color = color;
				// 切换回渐变模式并恢复渐变状态
				this.colorTypeIndex = 1;
				Object.assign(this, this.solidColorState);
				this.previewType = 'gradient-point';
			} else {
				this.previewType = 'solid';
			}
		},
		
		// 解析渐变色
		parseGradientColor(gradient) {
			// 简化处理，实际项目中可以使用更复杂的渐变解析
			this.currentColor = gradient
			// this.previewType = 'gradient';
		},
		
		// 切换颜色类型
		changeColorType(index) {
			// 保存当前状态
			if (this.colorTypeIndex === 0) {
				// 保存纯色状态
				this.solidColorState = {
					hue: this.hue,
					saturation: this.saturation,
					lightness: this.lightness,
					alpha: this.alpha,
					saturationPosition: {...this.saturationPosition},
					huePosition: this.huePosition,
					alphaPosition: this.alphaPosition,
					currentColor: this.currentColor
				};
			} else {
				// 保存渐变状态
				this.gradientColorState = {
					gradientColors: [...this.gradientColors],
					currentDirection: {...this.currentDirection},
					directionPointer: {...this.directionPointer}
				};
			}
			
			this.colorTypeIndex = index;
			
			// 恢复目标状态
			if (index === 0) {
				Object.assign(this, this.solidColorState);
				this.previewType = 'solid';
			} else {
				Object.assign(this, this.gradientColorState);
				// 确保gradientColors是响应式的
				this.gradientColors = [...this.gradientColorState.gradientColors];
				this.previewType = 'gradient';
			}
		},
		
		// 饱和度和明度触摸开始
		onSaturationTouchStart(e) {
			this.updateSaturationPosition(e)
		},
		
		// 饱和度和明度触摸移动
		onSaturationTouchMove(e) {
			this.updateSaturationPosition(e)
		},
		
		// 饱和度和明度触摸结束
		onSaturationTouchEnd(e) {
			this.updateSaturationPosition(e)
		},
		
		// 更新饱和度和明度位置
		updateSaturationPosition(e) {
			const touch = e.touches[0] || e.changedTouches[0]
			const target = e.currentTarget
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__saturation').boundingClientRect()
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					let x = touch.clientX - rect.left
					let y = touch.clientY - rect.top
					
					// 边界处理
					x = Math.max(0, Math.min(x, rect.width))
					y = Math.max(0, Math.min(y, rect.height))
					
					this.saturationPosition = { x, y }
					this.updateSolidColor()
				}
			})
		},
		
		// 色相触摸开始
		onHueTouchStart(e) {
			this.updateHuePosition(e)
		},
		
		// 色相触摸移动
		onHueTouchMove(e) {
			this.updateHuePosition(e)
		},
		
		// 色相触摸结束
		onHueTouchEnd(e) {
			this.updateHuePosition(e)
		},
		
		// 更新色相位置
		updateHuePosition(e) {
			const touch = e.touches[0] || e.changedTouches[0]
			const target = e.currentTarget
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__hue').boundingClientRect()
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					let x = touch.clientX - rect.left
					x = Math.max(0, Math.min(x, rect.width))
					this.huePosition = x
					this.hue = Math.round((x / rect.width) * 360)
					this.updateSolidColor()
				}
			})
		},
		
		// 透明度触摸开始
		onAlphaTouchStart(e) {
			this.updateAlphaPosition(e)
		},
		
		// 透明度触摸移动
		onAlphaTouchMove(e) {
			this.updateAlphaPosition(e)
		},
		
		// 透明度触摸结束
		onAlphaTouchEnd(e) {
			this.updateAlphaPosition(e)
		},
		
		// 更新透明度位置
		updateAlphaPosition(e) {
			const touch = e.touches[0] || e.changedTouches[0]
			const target = e.currentTarget
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__alpha').boundingClientRect()
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					let x = touch.clientX - rect.left
					x = Math.max(0, Math.min(x, rect.width))
					this.alphaPosition = x
					this.alpha = x / rect.width
					this.updateSolidColor()
				}
			})
		},
		
		// 更新纯色
		updateSolidColor() {
			// 使用实际元素尺寸替代硬编码的150
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__saturation').boundingClientRect();
			
			query.exec(res => {
				const rect = res[0];
				const size = rect ? Math.min(rect.width, rect.height) : 150; // 默认150作为后备值
				
				const s = (this.saturationPosition.x / size) * 100
				const l = 100 - (this.saturationPosition.y / size) * 100
				this.saturation = s
				this.lightness = l
				
				// 使用正确的HSL转RGB算法
				if (this.colorTypeIndex == 0) {
					this.currentColor = this.hslToRgb(this.hue, this.saturation, this.lightness, this.alpha)
				} else if (this.colorTypeIndex == 1) {
					this.gradientColors[this.editingGradientIndex].color
						= this.hslToRgb(this.hue, this.saturation, this.lightness, this.alpha)
				}
			});
		},
		
		// 添加渐变色
		addGradientColor() {
			if (this.gradientColors.length < 5) {
				this.gradientColors.push({
					color: '#ffffff',
					percent: 1
				})
			}
		},
		
		// 删除渐变色
		removeGradientColor(index) {
			if (this.gradientColors.length > 2) {
				this.gradientColors.splice(index, 1)
			}
		},
		
		// 获取渐变控制点位置
		getGradientPointerPosition(index) {
			const trackWidth = 280; // 需要与样式中的宽度一致
			return this.gradientColors[index].percent * trackWidth;
		},
		
		// 更新渐变色
		updateGradientColor(e) {
			const touch = e.touches[0] || e.changedTouches[0];
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__gradient-track').boundingClientRect();
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					let x = touch.clientX - rect.left;
					// 边界处理
					x = Math.max(0, Math.min(x, rect.width));
					const percent = x / rect.width;
					
					// 如果正在拖动控制点，则更新该控制点位置
					if (this.draggingPointerIndex >= 0) {
						this.gradientColors[this.draggingPointerIndex].percent = percent;
						// 保持控制点顺序
						this.gradientColors.sort((a, b) => a.percent - b.percent);
					} else {
						// 否则添加新的控制点（此处可选功能）
					}
				}
			});
		},
		
		// 控制点触摸开始
		onPointerTouchStart(e, index) {
			this.draggingPointerIndex = index;
			// 点击控制点时更新预览颜色
			this.currentColor = this.gradientColors[index].color;
			this.previewType = 'gradient-point';
			this.editingGradientIndex = index; // 添加这行以正确设置编辑索引
			// 阻止事件冒泡
			e.stopPropagation();
		},
		
		// 控制点触摸移动
		onPointerTouchMove(e) {
			if (this.draggingPointerIndex === -1) return;
			
			const touch = e.touches[0] || e.changedTouches[0];
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__gradient-track').boundingClientRect();
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					let x = touch.clientX - rect.left;
					// 边界处理
					x = Math.max(0, Math.min(x, rect.width));
					let percent = x / rect.width;
					
					// 处理边界情况，确保能精确到达两端
					if (x === 0) percent = 0;
					if (x === rect.width) percent = 1;
					
					// 更新控制点位置
					this.gradientColors[this.draggingPointerIndex].percent = percent;
					// 保持控制点顺序
					this.gradientColors.sort((a, b) => a.percent - b.percent);
					// 更新拖拽索引以匹配排序后的索引
					this.draggingPointerIndex = this.gradientColors.findIndex((item, index) => {
						// 使用更精确的比较方法，处理浮点数精度问题
						return Math.abs(item.percent - percent) < 0.0001;
					});
				}
			});
		},
		
		// 控制点触摸结束
		onPointerTouchEnd() {
			this.draggingPointerIndex = -1;
		},
		
		// 方向选择器触摸开始
		onDirectionTouchStart(e) {
			this.updateDirection(e);
		},
		
		// 方向选择器触摸移动
		onDirectionTouchMove(e) {
			this.updateDirection(e);
		},
		
		// 方向选择器触摸结束
		onDirectionTouchEnd(e) {
			this.updateDirection(e);
		},
		
		// 更新方向
		updateDirection(e) {
			const touch = e.touches[0] || e.changedTouches[0];
			const query = uni.createSelectorQuery().in(this);
			query.select('.up-color-picker__gradient__direction-circle').boundingClientRect();
			
			query.exec(res => {
				const rect = res[0];
				if (rect) {
					const centerX = rect.left + rect.width / 2;
					const centerY = rect.top + rect.height / 2;
					const x = touch.clientX - centerX;
					const y = touch.clientY - centerY;
					const distance = Math.sqrt(x * x + y * y);
					const maxDistance = rect.width / 2;
					
					// 限制在圆内
					if (distance <= maxDistance) {
						this.directionPointer = {
							x: x + rect.width / 2,
							y: y + rect.height / 2
						};
					} else {
						// 限制在圆周上
						const ratio = maxDistance / distance;
						this.directionPointer = {
							x: x * ratio + rect.width / 2,
							y: y * ratio + rect.height / 2
						};
					}
					
					// 计算角度并更新方向
					const angle = Math.atan2(y, x) * 180 / Math.PI;
                    console.log(angle)
					this.updateGradientDirection(angle);
				}
			});
		},
		
		// 根据角度更新渐变方向
		updateGradientDirection(angle) {
			// 角度转换为标准方向
			if (angle < 0) angle += 360;
			
			if (angle >= 315 || angle < 45) {
				this.currentDirection = { label: '从左到右', value: 'to right' };
			} else if (angle >= 45 && angle < 135) {
				this.currentDirection = { label: '从上到下', value: 'to bottom' };
			} else if (angle >= 135 && angle < 225) {
				this.currentDirection = { label: '从右到左', value: 'to left' };
			} else {
				this.currentDirection = { label: '从下到上', value: 'to top' };
			}
		},
		
		// 确认方向选择
		confirmDirection(e) {
			this.currentDirection = this.gradientDirections[e.index]
			this.showDirectionPicker = false
		},
		
		// 选择常用颜色
		selectCommonColor(color) {
			this.currentColor = color
			if (this.colorTypeIndex === 0) {
				this.parseSolidColor(color)
			} else {
				// 如果是渐变模式，将常用颜色作为渐变的一个节点
				this.gradientColors[this.editingGradientIndex].color = color
			}
		},
		
		// 确认选择
		confirm() {
			let color = this.currentColor
			if (this.colorTypeIndex === 1) {
				color = this.gradientStyle
			}
            this.$emit('update:modelValue', color)
            this.show = false;
			this.$emit('confirm', color)
			// 重置编辑状态
			this.editingGradientIndex = -1;
			this.previewType = this.colorTypeIndex === 0 ? 'solid' : 'gradient';
			this.close()
		},
		
		// 关闭选择器
		close() {
            this.show = false;
			this.$emit('close')
		},
		
		// HSL转RGB辅助函数
		hslToRgb(h, s, l, a = 1) {
			h = h / 360;
			s = s / 100;
			l = l / 100;
			
			let r, g, b;
			
			if (s === 0) {
				r = g = b = l; // achromatic
			} else {
				const hue2rgb = (p, q, t) => {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1/6) return p + (q - p) * 6 * t;
					if (t < 1/2) return q;
					if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				};
				
				const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				const p = 2 * l - q;
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}
			
			const round = (value) => Math.round(value * 255);
			return `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a.toFixed(2)})`;
		}
	}
}
</script>

<style lang="scss" scoped>
.up-color-picker {
	&__content {
		width: 100%;
		padding: 20px;
		background-color: #fff;
	}
	
	&__header {
		text-align: center;
		margin-bottom: 20px;
	}
	
	&__title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}
	
	&__switch {
		margin-bottom: 20px;
	}
	
	&__saturation {
		position: relative;
		width: 100%;
		height: 150px;
		border-radius: 4px;
		margin-bottom: 15px;
		overflow: hidden;
		
		&:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(to right, #fff, rgba(255,255,255,0));
		}
		
		&:before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(to top, #000, rgba(0,0,0,0));
		}
	}
	
	&__saturation-pointer {
		position: absolute;
		width: 12px;
		height: 12px;
		border: 2px solid #fff;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		box-shadow: 0 0 2px rgba(0,0,0,0.5);
		pointer-events: none;
	}
	
	&__hue,
	&__alpha {
		position: relative;
		width: 100%;
		height: 12px;
		border-radius: 6px;
		margin-bottom: 15px;
		cursor: pointer;
	}
	
	&__hue {
		background: linear-gradient(to right, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%);
	}
	
	&__alpha {
		position: relative;
		overflow: hidden;
		
		&-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
						linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
			background-size: 10px 10px;
			background-position: 0 0, 5px 5px;
		}
		
		&:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1));
		}
	}
	
	&__hue-pointer,
	&__alpha-pointer {
		position: absolute;
		width: 4px;
		height: 16px;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 2px;
		transform: translateX(-50%);
		top: -2px;
		box-shadow: 0 0 2px rgba(0,0,0,0.5);
		pointer-events: none;
	}
	
	&__gradient {
		&-bar {
			width: 100%;
			height: 40px;
			border-radius: 4px;
		}
		
		&-track {
			position: relative;
            margin-top: 20px;
			width: 100%;
			height: 32px;
			border-radius: 4px;
			margin-bottom: 15px;
			cursor: pointer;
		}
		
		&-pointer {
			position: absolute;
			top: -10px;
			transform: translateX(-50%);
			width: 0;
			height: 0;
			border-left: 8px solid transparent;
			border-right: 8px solid transparent;
			border-top: 10px solid #333;
			z-index: 10;
		}
		
		&-pointer-inner {
			position: absolute;
			top: -25px;
			left: -10px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			border: 2px solid #fff;
			box-shadow: 0 0 2px rgba(0,0,0,0.5);
		}
		
		&-controls {
			display: flex;
            flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 15px;
		}
		
		&-item {
			display: flex;
            flex-direction: row;
			align-items: center;
			margin-right: 10px;
			margin-bottom: 10px;
		}
		
		&-color-preview {
			width: 20px;
			height: 20px;
			border-radius: 50%;
			margin-right: 5px;
			border: 1px solid #eee;
		}
		
		&-percent {
			font-size: 12px;
			color: #666;
			margin-right: 5px;
		}
		
		&-direction {
			display: flex;
            flex-direction: row;
			align-items: center;
			margin: 10px 0;
		}
		
		&__direction-circle {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: conic-gradient(
				#ff0000 0deg, 
				#ffff00 60deg, 
				#00ff00 120deg, 
				#00ffff 180deg, 
				#0000ff 240deg, 
				#ff00ff 300deg, 
				#ff0000 360deg
			);
			position: relative;
			margin: 10px auto;
			cursor: pointer;
			border: 2px solid #eee;
		}
		
		&__direction-pointer {
			position: absolute;
			width: 6px;
			height: 6px;
			background: #fff;
			border: 2px solid #333;
			border-radius: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0 0 2px rgba(0,0,0,0.5);
			z-index: 10;
            pointer-events: none;
		}
	}
	
	&__add-btn {
		margin-top: 10px;
	}
	
	&__common {
		margin-top: 20px;
		
		&-title {
			display: block;
			margin-bottom: 10px;
			font-size: 14px;
			color: #666;
		}
		
		&-list {
			display: flex;
            flex-direction: row;
			flex-wrap: wrap;
		}
		
		&-item {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			margin-right: 10px;
			margin-bottom: 10px;
			border: 1px solid #eee;
			cursor: pointer;
		}
	}
	
	&__footer {
		margin-top: 20px;
	}
	
	&__preview {
		display: flex;
        flex-direction: row;
		align-items: center;
		margin-bottom: 15px;
	}
	
	&__preview-color {
		width: 40px;
		height: 40px;
		border-radius: 4px;
		border: 1px solid #eee;
		margin-right: 10px;
	}
	
	&__preview-text {
		font-size: 14px;
		color: #333;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	&__actions {
		display: flex;
        flex-direction: row;
		justify-content: flex-end;
		
		& .up-color-picker__btn {
			margin-left: 10px;
		}
	}
}
</style>
