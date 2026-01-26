<template>
	<view class="u-cropper">
		<!-- <image :src="imgSrc.imgSrc" @click="select" :style="[ imgStyle ]" class="my-avatar"></image> -->
		<canvas :canvas-id="'avatar-canvas-' + instanceId" :id="'avatar-canvas-' + instanceId" class="my-canvas"
			:style="{top: styleTop, height: cvsStyleHeight}" disable-scroll="false"></canvas>
		<canvas :canvas-id="'oper-canvas-' + instanceId" :id="'oper-canvas-' + instanceId" class="oper-canvas"
			:style="{top: styleTop, height: cvsStyleHeight}"
			disable-scroll="false" @touchstart="start" @touchmove="move" @touchend="end"></canvas>
		<canvas :canvas-id="'prv-canvas-' + instanceId" :id="'prv-canvas-' + instanceId" class="prv-canvas"
			disable-scroll="false" @touchstart="hideImg" :style="{ height: cvsStyleHeight, top: prvTop }"></canvas>
		<view class="oper-wrapper" :style="{display: styleDisplay}">
			<view class="oper">
				<view class="btn-wrapper" v-if="showOper">
					<view @click="select"  hover-class="hover" :style="{width: btnWidth}">
						<text>{{ t("up.common.re-select") }}</text>
					</view>
					<view @click="close"  hover-class="hover" :style="{width: btnWidth}">
						<text>{{ t("up.common.close") }}</text>
					</view>
					<view @click="rotate"  hover-class="hover" :style="{width: btnWidth, display: btnDsp}">
						<text>{{ t("up.common.rotate") }}</text>
					</view>
					<view @click="preview" hover-class="hover" :style="{width: btnWidth}">
						<text>{{ t("up.common.preview") }}</text>
					</view>
					<view @click="confirm"  hover-class="hover" :style="{width: btnWidth}">
						<text>{{ t("up.common.confirm") }}</text>
					</view>
				</view>
				<view class="clr-wrapper" v-else>
					<slider class="my-slider" @change="colorChange"
					block-size="25" value="0" min="-100" max="100" activeColor="red"
					backgroundColor="green" block-color="grey" show-value></slider>
					<view @click="prvUpload"  hover-class="hover" :style="{width: btnWidth}">
						<text>{{ t("up.common.confirm") }}</text>
					</view>
				</view>
			</view>
		</view>
		<view @click="chooseImage(0, {})" v-if="styleDisplay == 'none'">
			<slot>
				
			</slot>
		</view>
	</view>
</template>

<script>
	import { t } from '../../libs/i18n'
	const tabHeight = 50;
	export default {
		name: "u-cropper",
		data() {
			return {
				// 添加实例ID用于区分不同实例
				instanceId: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
				cvsStyleHeight: '0px',
				styleDisplay: 'none',
				styleTop: '-10000px',
				prvTop: '-10000px',
				imgStyle: {},
				selStyle: {},
				showOper: true,
				imgSrc: {
					imgSrc: ''
				},
				btnWidth: '19%',
				btnDsp: 'flex',
				// 裁剪区域宽度，用于设置选择区域的宽度
				arWidth: '',
				// 裁剪区域高度，用于设置选择区域的高度
				arHeight: '',
				// 导出图片宽度，用于设置最终导出图片的宽度
				expWidth: '',
				// 导出图片高度，用于设置最终导出图片的高度
				expHeight: '',
				// 是否允许调整裁剪框大小
				letChangeSize: false,
				// 底部安全区大小
				safeAreaInsetsBottom: 0,
			};
		},
		watch: {
			avatarSrc() {
				this.imgSrc.imgSrc = this.avatarSrc;
			}
		},
		emits: ['avtinit', 'confirm'],
		props:{
			minScale: '',
			maxScale: '',
			canScale: true,
			canRotate: true,
			lockWidth: '',
			lockHeight: '',
			stretch: '',
			lock: '',
			noTab: true,
			inner: false,
			quality: '',
			index: '',
			canChangeSize: false,
			areaWidth: '300rpx',
			// 裁剪区域高度，用于设置选择区域的高度
			areaHeight: '300rpx',
			// 导出图片宽度，用于设置最终导出图片的宽度
			exportWidth: '260rpx',
			// 导出图片高度，用于设置最终导出图片的高度
			exportHeight: '260rpx',
		},
		created() {
			this.ctxCanvas = uni.createCanvasContext('avatar-canvas-' + this.instanceId, this);
			this.ctxCanvasOper = uni.createCanvasContext('oper-canvas-' + this.instanceId, this);
			this.ctxCanvasPrv = uni.createCanvasContext('prv-canvas-' + this.instanceId, this);
			this.qlty = parseInt(this.quality) || 0.9;
			this.imgSrc.imgSrc = this.imageSrc;
			this.letRotate = (this.canRotate === false || this.inner === true) ? 0 : 1;
			this.letScale = this.canScale === false ? 0 : 1;
			// 是否允许调整裁剪框大小，false表示不允许，其他值表示允许
			this.letChangeSize = this.canChangeSize;
			this.isin = this.inner === true ? 1 : 0;
			this.indx = this.index || undefined;
			this.mnScale = this.minScale || 0.3;
			this.mxScale = this.maxScale || 4;
			this.noBar = this.noTab === true ? 1 : 0;
			this.stc = this.stretch;
			this.lck = this.lock;
			if(this.isin) {
				this.btnWidth = '24%';
				this.btnDsp = 'none';
			} else {
				this.btnWidth = '19%';
				this.btnDsp = 'flex';
			}

			if(this.noBar) {
				this.moreHeight = 0;
				this.windowResize();
			} else {
				uni.showTabBar({
					complete:(res) => {
						this.moreHeight = (res.errMsg === 'showTabBar:ok') ? 50 : 0;
						this.windowResize();
					}
				});
			}
		},
		methods: {
			t,
			windowResize() {
				let sysInfo = uni.getSystemInfoSync();
				this.platform = sysInfo.platform;
				this.pixelRatio = sysInfo.pixelRatio;
				this.windowWidth = sysInfo.windowWidth;
				this.safeAreaInsetsBottom = sysInfo.safeAreaInsets.bottom;
				// #ifdef H5
				this.drawTop = sysInfo.windowTop;
				this.windowHeight = sysInfo.windowHeight + sysInfo.windowBottom;
				this.cvsStyleHeight = this.windowHeight - tabHeight + 'px';
				// #endif
				// #ifdef APP-PLUS
				if(this.platform === 'android') {
					this.windowHeight = sysInfo.screenHeight + sysInfo.statusBarHeight;
					this.cvsStyleHeight = this.windowHeight - tabHeight + 'px';
				} else {
					this.windowHeight = sysInfo.windowHeight + this.moreHeight;
					this.cvsStyleHeight = this.windowHeight - tabHeight - this.safeAreaInsetsBottom + 6 + 'px';
				}
				// #endif
				// #ifdef MP
				this.windowHeight = sysInfo.windowHeight + this.moreHeight;
				this.cvsStyleHeight = this.windowHeight - tabHeight - this.safeAreaInsetsBottom - 2 + 'px';
				// #endif
				this.pxRatio = this.windowWidth/750;

				let style = this.avatarStyle;
				if(style && style !== true && (style=style.trim()) ) {
					style = style.split(';');
					let obj = {};
					for( let v of style ) {
						if(!v) continue;
						v = v.trim().split(':');
						if(v[1].indexOf('rpx') >= 0) {
							let arr = v[1].trim().split(' ');
							for( let k in arr ) {
								if(!arr[k]) continue;
								if(arr[k].indexOf('rpx') >= 0) {
									arr[k] = parseFloat(arr[k]) * this.pxRatio + 'px';
								}
							}
							v[1] = arr.join(' ');
						}
						obj[v[0].trim()] = v[1].trim();
					}
					this.imgStyle = obj;
				}

				this.expWidth && (this.expWidth = this.expWidth.indexOf('rpx') >= 0 ? parseInt(this.expWidth)*this.pxRatio : parseInt(this.expWidth));
				this.expHeight && (this.expHeight = this.expHeight.indexOf('rpx') >= 0 ? parseInt(this.expHeight)*this.pxRatio : parseInt(this.expHeight));

				if(this.styleDisplay === 'flex') {
					this.drawInit(true);
				}
				this.hideImg();
			},
			select() {
				if(this.fSelecting) return;
				this.fSelecting = true;
				setTimeout(()=>{ this.fSelecting = false; }, 500);

				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (r)=>{
						uni.showLoading({ mask: true });
						let path = this.imgPath = r.tempFilePaths[0];
						uni.getImageInfo({
							src: path,
							success: r => {
								this.imgWidth = r.width;
								this.imgHeight = r.height;
								this.path = path;
								if( !this.hasSel ) {
									let style = this.selStyle || {};
									if( this.arWidth && this.arHeight ) {
										let areaWidth  = this.arWidth.indexOf('rpx')  >= 0 ? parseInt(this.arWidth)  * this.pxRatio: parseInt(this.arWidth),
											areaHeight = this.arHeight.indexOf('rpx') >= 0 ? parseInt(this.arHeight) * this.pxRatio: parseInt(this.arHeight);
										style.width = areaWidth + 'px';
										style.height = areaHeight + 'px';
										style.top = (this.windowHeight - areaHeight - tabHeight)/2 + 'px';
										style.left = (this.windowWidth - areaWidth)/2 + 'px';
									} else {
										uni.showModal({
											title: t("up.cropper.emptyWidhtOrHeight"),
											showCancel: false
										})
										return;
									}
									this.selStyle = style;
								}

								if(	this.noBar ) {
									this.drawInit(true);
								} else {
									uni.hideTabBar({
										complete: () => {
											this.drawInit(true);
										}
									});
								}
							},
							fail: ()=>{
								uni.showToast({
									title: "error3",
									duration: 2000,
								})
							},
							complete() {
								uni.hideLoading();
							}
						});
					}
				})
			},
			confirm() {
				if(this.fUploading)	return;
				this.fUploading = true;
				setTimeout(()=>{ this.fUploading = false; }, 1000)

				let style = this.selStyle,
					x = parseInt(style.left),
					y = parseInt(style.top),
					width = parseInt(style.width),
					height = parseInt(style.height),
					expWidth = this.expWidth || width,
					expHeight = this.expHeight || height;

				// #ifdef H5
				// x *= this.pixelRatio;
				// y *= this.pixelRatio;
				expWidth = width;
				expHeight = height;
				// #endif

				uni.showLoading({ mask: true });
				this.styleDisplay = 'none';
				this.styleTop = '-10000px';
				this.hasSel = false;
				this.hideImg();
				uni.canvasToTempFilePath({
					x: x,
					y: y,
					width: width,
					height: height,
					destWidth: expWidth,
					destHeight: expHeight,
					canvasId: 'avatar-canvas-' + this.instanceId,
					fileType: 'png',
					quality: this.qlty,
					success: (r)=>{
						r = r.tempFilePath;
						// #ifdef H5
						this.btop(r).then((r)=> {
							if(this.expWidth && this.expHeight) {
								let ctxCanvas = this.ctxCanvas;
								expWidth = this.expWidth,
								expHeight = this.expHeight;

								ctxCanvas.drawImage(r, 0, 0, expWidth, expHeight);
								ctxCanvas.draw(false,()=>{
									uni.canvasToTempFilePath({
										x: 0,
										y: 0,
										width: expWidth,
										height: expHeight,
										destWidth: expWidth,
										destHeight: expHeight,
										canvasId: 'avatar-canvas-' + this.instanceId,
										fileType: 'png',
										quality: this.qlty,
										success: (r)=>{
											r = r.tempFilePath;
											this.btop(r).then((r)=> {
												this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
											});
										},
										fail: ()=>{
											uni.showToast({
												title: "error0",
												duration: 2000,
											})
										}
									});
								});
							} else {
								this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
							}
						})
						// #endif
						// #ifndef H5
						this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
						// #endif
					},
					fail: (res)=>{
						uni.showToast({
							title: "error1",
							duration: 2000,
						})
					},
					complete: () => {
						uni.hideLoading();
						this.noBar || uni.showTabBar();
					}
				}, this);
			},
			// 用户点击"预览"模式下的"确认"按钮时被调用，用于将预览的裁剪结果上传
			prvUpload() {
				if(this.fPrvUploading)	return;
				this.fPrvUploading = true;
				setTimeout(()=>{ this.fPrvUploading = false; }, 1000)

				let style = this.selStyle,
					destWidth = parseInt(style.width),
					destHeight = parseInt(style.height),
					prvX = this.prvX,
					prvY = this.prvY,
					prvWidth = this.prvWidth,
					prvHeight = this.prvHeight,
					expWidth = this.expWidth || prvWidth,
					expHeight = this.expHeight || prvHeight;

				// #ifdef H5
				// prvX *= this.pixelRatio;
				// prvY *= this.pixelRatio;
				expWidth = prvWidth;
				expHeight = prvHeight;
				// #endif

				uni.showLoading({ mask: true });

				this.styleDisplay = 'none';
				this.styleTop = '-10000px';
				this.hasSel = false;
				this.hideImg();
				uni.canvasToTempFilePath({
					x: prvX,
					y: prvY,
					width: prvWidth,
					height: prvHeight,
					destWidth: expWidth,
					destHeight: expHeight,
					canvasId: 'prv-canvas-' + this.instanceId,
					fileType: 'png',
					quality: this.qlty,
					success: (r)=>{
						r = r.tempFilePath;
						// #ifdef H5
						this.btop(r).then((r)=> {
							if(this.expWidth && this.expHeight) {
								let ctxCanvas = this.ctxCanvas;
								expWidth = this.expWidth,
								expHeight = this.expHeight;

								ctxCanvas.drawImage(r, 0, 0, expWidth, expHeight);
								ctxCanvas.draw(false, ()=>{
									uni.canvasToTempFilePath({
										x: 0,
										y: 0,
										width: expWidth,
										height: expHeight,
										destWidth: expWidth,
										destHeight: expHeight,
										canvasId: 'avatar-canvas-' + this.instanceId,
										fileType: 'png',
										quality: this.qlty,
										success: (r)=>{
											r = r.tempFilePath;
											this.btop(r).then((r)=> {
												this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
											});
										},
										fail: ()=>{
											uni.showToast({
												title: "error0",
												duration: 2000,
											})
										}
									});
								});
							} else {
								this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
							}
						})
						// #endif
						// #ifndef H5
						this.$emit("confirm", {avatar: this.imgSrc, path: r, index: this.indx, data: this.rtn});
						// #endif
					},
					fail: ()=>{
						uni.showToast({
							title: "error_prv",
							duration: 2000,
						})
					},
					complete: () => {
						uni.hideLoading();
						this.noBar || uni.showTabBar();
					}
				}, this);
			},
			drawInit(ini=false) {
				let allWidth = this.windowWidth,
					allHeight = this.windowHeight,
					imgWidth = this.imgWidth,
					imgHeight = this.imgHeight,
					imgRadio = imgWidth/imgHeight,
					useWidth = allWidth - 40,
					useHeight = allHeight - tabHeight - 80,
					pixelRatio = this.pixelRatio,
					selWidth = parseInt(this.selStyle.width),
					selHeight = parseInt(this.selStyle.height);

				this.fixWidth = 0;
				this.fixHeight = 0;
				this.lckWidth = 0;
				this.lckHeight = 0;
				switch(this.stc) {
					case 'x': this.fixWidth = 1; break;
					case 'y': this.fixHeight = 1; break;
					case 'long': if(imgRadio > 1) this.fixWidth = 1; else this.fixHeight = 1; break;
					case 'short': if(imgRadio > 1) this.fixHeight = 1; else this.fixWidth = 1; break;
					case 'longSel': if(selWidth > selHeight) this.fixWidth = 1; else this.fixHeight = 1; break;
					case 'shortSel': if(selWidth > selHeight) this.fixHeight = 1; else this.fixWidth = 1; break;
				}
				// lck 用于控制裁剪框的宽度和高度锁定行为
				// 'x': 锁定宽度，不允许水平方向调整
				// 'y': 锁定高度，不允许垂直方向调整
				// 'long': 根据图片长边锁定，如果图片横向较长则锁定宽度，否则锁定高度
				// 'short': 根据图片短边锁定，如果图片横向较长则锁定高度，否则锁定宽度
				// 'longSel': 根据选择框的长边锁定，如果选择框宽度大于高度则锁定宽度，否则锁定高度
				// 'shortSel': 根据选择框的短边锁定，如果选择框宽度大于高度则锁定高度，否则锁定宽度
				switch(this.lck) {
					case 'x': this.lckWidth = 1; break;
					case 'y': this.lckHeight = 1; break;
					case 'long': if(imgRadio > 1) this.lckWidth = 1; else this.lckHeight = 1; break;
					case 'short': if(imgRadio > 1) this.lckHeight = 1; else this.lckWidth = 1; break;
					case 'longSel': if(selWidth > selHeight) this.lckWidth = 1; else this.lckHeight = 1; break;
					case 'shortSel': if(selWidth > selHeight) this.lckHeight = 1; else this.lckWidth = 1; break;
				}
				if( this.fixWidth ) {
					useWidth = selWidth;
					useHeight = useWidth/imgRadio;
				} else if( this.fixHeight ) {
					useHeight = selHeight;
					useWidth = useHeight*imgRadio;
				} else if( imgRadio < 1 ) {
					if( imgHeight < useHeight ) {
						useWidth = imgWidth;
						useHeight = imgHeight;
					} else {
						useHeight = useHeight;
						useWidth = useHeight*imgRadio;
					}
				} else {
					if( imgWidth < useWidth ) {
						useWidth = imgWidth;
						useHeight = imgHeight;
					} else {
						useWidth = useWidth;
						useHeight = useWidth/imgRadio;
					}
				}
				if( this.isin ) {
					this.scaleWidth = 0;
					this.scaleHeight = 0;
					if(useWidth < selWidth) {
						useWidth = selWidth;
						useHeight = useWidth/imgRadio;
						this.lckHeight = 0;
					}
					if(useHeight < selHeight) {
						useHeight = selHeight;
						useWidth = useHeight*imgRadio;
						this.lckWidth = 0;
					}
				}

				this.scaleSize = 1;
				this.rotateDeg = 0;
				this.posWidth = (allWidth-useWidth)/2;
				this.posHeight = (allHeight-useHeight-tabHeight)/2;
				this.useWidth = useWidth;
				this.useHeight = useHeight;

				let style = this.selStyle,
					left = parseInt(style.left),
					top = parseInt(style.top),
					width = parseInt(style.width),
					height = parseInt(style.height),
					canvas = this.canvas,
					canvasOper = this.canvasOper,
					ctxCanvas = this.ctxCanvas,
					ctxCanvasOper = this.ctxCanvasOper;

				ctxCanvasOper.setLineWidth(3);
				ctxCanvasOper.setStrokeStyle('grey');
				ctxCanvasOper.setGlobalAlpha(0.4);
				ctxCanvasOper.setFillStyle('black');
				ctxCanvasOper.strokeRect( left, top, width, height );
				ctxCanvasOper.fillRect(0, 0, this.windowWidth, top);
				ctxCanvasOper.fillRect(0, top, left, height);
				ctxCanvasOper.fillRect(0, top+height, this.windowWidth, this.windowHeight-height-top-tabHeight);
				ctxCanvasOper.fillRect(left+width, top,this.windowWidth-width-left, height);
				ctxCanvasOper.setStrokeStyle('red');
				ctxCanvasOper.moveTo(left+20, top);ctxCanvasOper.lineTo(left, top);ctxCanvasOper.lineTo(left, top+20);
				ctxCanvasOper.moveTo(left+width-20, top);ctxCanvasOper.lineTo(left+width, top);ctxCanvasOper.lineTo(left+width, top+20);
				ctxCanvasOper.moveTo(left+20, top+height);ctxCanvasOper.lineTo(left, top+height);ctxCanvasOper.lineTo(left, top+height-20);
				ctxCanvasOper.moveTo(left+width-20, top+height);ctxCanvasOper.lineTo(left+width, top+height);ctxCanvasOper.lineTo(left+width, top+height-20);
				
				// 绘制控制点（四个角）
				const controlPointSize = 10;
				ctxCanvasOper.setFillStyle('white');
				ctxCanvasOper.setStrokeStyle('grey');
				ctxCanvasOper.setLineWidth(1);
				// 左上角
				ctxCanvasOper.fillRect(left - controlPointSize/2, top - controlPointSize/2, controlPointSize, controlPointSize);
				ctxCanvasOper.strokeRect(left - controlPointSize/2, top - controlPointSize/2, controlPointSize, controlPointSize);
				// 右上角
				ctxCanvasOper.fillRect(left + width - controlPointSize/2, top - controlPointSize/2, controlPointSize, controlPointSize);
				ctxCanvasOper.strokeRect(left + width - controlPointSize/2, top - controlPointSize/2, controlPointSize, controlPointSize);
				// 左下角
				ctxCanvasOper.fillRect(left - controlPointSize/2, top + height - controlPointSize/2, controlPointSize, controlPointSize);
				ctxCanvasOper.strokeRect(left - controlPointSize/2, top + height - controlPointSize/2, controlPointSize, controlPointSize);
				// 右下角
				ctxCanvasOper.fillRect(left + width - controlPointSize/2, top + height - controlPointSize/2, controlPointSize, controlPointSize);
				ctxCanvasOper.strokeRect(left + width - controlPointSize/2, top + height - controlPointSize/2, controlPointSize, controlPointSize);
				
				ctxCanvasOper.stroke();

				ctxCanvasOper.draw(false, ()=>{
					if( ini ) {
						this.styleDisplay = 'flex';
						// #ifdef H5
						this.styleTop = this.drawTop + 'px';
						// #endif
						// #ifndef H5
						this.styleTop = '0';
						// #endif
						ctxCanvas.setFillStyle('black');
						this.drawImage();
					}
				});

				this.$emit("avtinit");
			},
			drawImage() {
				let tm_now = Date.now();
				if(tm_now - this.drawTm < 20) return;
				this.drawTm = tm_now;
				let ctxCanvas = this.ctxCanvas;
				ctxCanvas.fillRect(0, 0, this.windowWidth, this.windowHeight-tabHeight);
				ctxCanvas.translate(this.posWidth+this.useWidth/2, this.posHeight+this.useHeight/2);
				ctxCanvas.scale(this.scaleSize, this.scaleSize);
				ctxCanvas.rotate(this.rotateDeg * Math.PI/180);
				ctxCanvas.drawImage(this.imgPath, -this.useWidth/2, -this.useHeight/2, this.useWidth, this.useHeight);
				ctxCanvas.draw(false);
			},
			hideImg() {
				this.prvImg = '';
				this.prvTop = '-10000px';
				this.showOper = true;
				this.prvImgData = null;
				this.target = null;
			},
			close() {
				this.styleDisplay = 'none';
				this.styleTop = '-10000px';
				this.hasSel = false;
				this.hideImg();
				this.noBar || uni.showTabBar();
			},
			preview() {
				if(this.fPreviewing) return;
				this.fPreviewing = true;
				setTimeout(()=>{ this.fPreviewing = false; }, 1000);
				let style = this.selStyle,
					x = parseInt(style.left),
					y = parseInt(style.top),
					width = parseInt(style.width),
					height = parseInt(style.height);

				uni.showLoading({ mask: true });
				// console.log('size', x, y, width, height)
				uni.canvasToTempFilePath({
					x: x,
					y: y,
					width: width,
					height: height,
					canvasId: 'avatar-canvas-' + this.instanceId,
					fileType: 'png',
					quality: this.qlty,
					success: (r)=>{
						// console.log(r)
						this.prvImgTmp = r = r.tempFilePath;

						let ctxCanvasPrv = this.ctxCanvasPrv,
							prvX = this.windowWidth,
							prvY = parseInt(this.cvsStyleHeight),
							prvWidth = parseInt(this.selStyle.width),
							prvHeight = parseInt(this.selStyle.height),
							useWidth = prvX - 40,
							useHeight = prvY - 80,
							radio = useWidth/prvWidth,
							rHeight = prvHeight*radio;
							if(rHeight < useHeight) {
								prvWidth = useWidth;
								prvHeight = rHeight;
							} else {
								radio = useHeight/prvHeight;
								prvWidth *= radio;
								prvHeight = useHeight;
							}
						ctxCanvasPrv.setFillStyle('black');
						ctxCanvasPrv.fillRect(0, 0, prvX, prvY);
						ctxCanvasPrv.fillRect(x, y, width, height);
						this.prvX = prvX = (prvX-prvWidth)/2;
						this.prvY = prvY = (prvY-prvHeight)/2;
						this.prvWidth = prvWidth;
						this.prvHeight = prvHeight;
						ctxCanvasPrv.drawImage(r, prvX, prvY, prvWidth, prvHeight);
						ctxCanvasPrv.draw(false, () => {
							// #ifdef H5
							this.btop(this.prvImgTmp).then((r)=> {
								this.showOper = false;
								this.prvTop = this.drawTop + 'px';
							})
							// #endif
							// #ifndef H5
							if( this.platform != 'android' ) {
								this.showOper = false;
							}
							this.prvTop = '0';
							// #endif
						});
					},
					fail: ()=>{
						uni.showToast({
							title: "error2",
							duration: 2000,
						})
					},
					complete: () => {
						uni.hideLoading();
					}
				}, this);
			},
			chooseImage(index=undefined, params=undefined, data=undefined) {
				if(params) {
					console.log(params)
					let areaWidth = params.areaWidth || this.areaWidth,
						areaHeight = params.areaHeight || this.areaHeight,
						expWidth = params.exportWidth || this.exportWidth,
						expHeight = params.exportHeight || this.exportHeight,
						quality = params.quality,
						canRotate = params.canRotate,
						canScale = params.canScale,
						canChangeSize = params.canChangeSize,
						minScale = params.minScale,
						maxScale = params.maxScale,
						stretch = params.stretch,
						inner = params.inner,
						lock = params.lock;
						console.log('areaWidth', this.areaWidth)

					expWidth && (this.expWidth = expWidth.indexOf('rpx') >= 0 ? parseInt(expWidth)*this.pxRatio : parseInt(expWidth));
					expHeight && (this.expHeight = expHeight.indexOf('rpx') >= 0 ? parseInt(expHeight)*this.pxRatio : parseInt(expHeight));
					this.letRotate = canRotate === false ? 0 : 1;
					this.letScale = canScale === false ? 0 : 1;
					// 设置是否允许调整裁剪框大小
					this.letChangeSize = canChangeSize || false;
					this.qlty = parseInt(quality) || 0.9;
					this.mnScale = minScale || 0.3;
					this.mxScale = maxScale || 4;
					this.stc = stretch;
					this.isin = inner === true ? 1 : 0;
					this.lck = lock;
					if(this.isin) {
						this.btnWidth = '24%';
						this.btnDsp = 'none';
					} else {
						this.btnWidth = '19%';
						this.btnDsp = 'flex';
					}

					if( areaWidth && areaHeight) {
						areaWidth  = areaWidth.indexOf('rpx')  >= 0 ? parseInt(areaWidth)  * this.pxRatio: parseInt(areaWidth);
						areaHeight = areaHeight.indexOf('rpx') >= 0 ? parseInt(areaHeight) * this.pxRatio: parseInt(areaHeight);
						this.selStyle.width = areaWidth + 'px';
						this.selStyle.height = areaHeight + 'px';
						this.selStyle.top = (this.windowHeight - areaHeight - tabHeight)/2 + 'px';
						this.selStyle.left = (this.windowWidth - areaWidth)/2 + 'px';
						// console.log(this.selStyle);
						this.hasSel = true;
					}
				}
				this.rtn = data;
				this.indx = index;
				this.select();
			},
			rotate() {
				// #ifdef APP-PLUS
				if(this.platform === 'android') {
					if(this.fRotateing) return;
					this.fRotateing = true;
					setTimeout(()=>{ this.fRotateing = false; }, 500);
				}
				// #endif

				// if(this.letRotate) {
					this.rotateDeg += 90 - this.rotateDeg%90;
					this.drawImage();
				// }
			},
			start(e) {
				let touches = e.touches,
				touch0 = touches[0],
				touch1 = touches[1];

				this.touch0 = touch0;
				this.touch1 = touch1;

				if( touch1 ) {
					let x = touch1.x - touch0.x,
						y = touch1.y - touch0.y;
					this.fgDistance = Math.sqrt(x * x + y * y);
				} else {
					// 只有在允许调整大小时才检查控制点
					if (this.letChangeSize) {
						// 检查是否点击在控制点上
						const controlPointSize = 20;
						const x = touch0.x;
						const y = touch0.y;
						const style = this.selStyle;
						const left = parseInt(style.left);
						const top = parseInt(style.top);
						const width = parseInt(style.width);
						const height = parseInt(style.height);
						
						// 检查四个控制点
						if (Math.abs(x - left) < controlPointSize && Math.abs(y - top) < controlPointSize) {
							this.resizeHandle = 'top-left';
						} else if (Math.abs(x - (left + width)) < controlPointSize && Math.abs(y - top) < controlPointSize) {
							this.resizeHandle = 'top-right';
						} else if (Math.abs(x - left) < controlPointSize && Math.abs(y - (top + height)) < controlPointSize) {
							this.resizeHandle = 'bottom-left';
						} else if (Math.abs(x - (left + width)) < controlPointSize && Math.abs(y - (top + height)) < controlPointSize) {
							this.resizeHandle = 'bottom-right';
						} else {
							this.resizeHandle = null;
						}
					} else {
						this.resizeHandle = null;
					}
				}
			},
			move(e) {
				let touches = e.touches,
					touch0 = touches[0],
					touch1 = touches[1];

				if( touch1 ) {
					let x = touch1.x - touch0.x,
						y = touch1.y - touch0.y,
						fgDistance = Math.sqrt(x * x + y * y),
						scaleSize = 0.005 * (fgDistance - this.fgDistance),
						beScaleSize = this.scaleSize + scaleSize;

					do	{
						if( !this.letScale ) break;
						if( beScaleSize < this.mnScale) break;
						if( beScaleSize > this.mxScale) break;
						if(this.isin) {
							let	imgWidth = this.useWidth*beScaleSize,
								imgHeight = this.useHeight*beScaleSize,
								rx0 = this.posWidth+this.useWidth/2,
								ry0 = this.posHeight+this.useHeight/2,
								l = rx0-imgWidth/2, t = ry0-imgHeight/2,
								r = l+imgWidth,	    b = t+imgHeight,
								left = parseInt(this.selStyle.left),
								top = parseInt(this.selStyle.top),
								width = parseInt(this.selStyle.width),
								height = parseInt(this.selStyle.height);
								if(left < l || left+width > r || top < t || top+height > b) break;
								this.scaleWidth = (this.useWidth-imgWidth)/2;
								this.scaleHeight = (this.useHeight-imgHeight)/2;
						}

						this.scaleSize = beScaleSize;
					} while(0);
					this.fgDistance = fgDistance;

					if(touch1.x !== touch0.x && this.letRotate) {
						x = (this.touch1.y - this.touch0.y)/(this.touch1.x - this.touch0.x);
						y = (touch1.y - touch0.y)/(touch1.x - touch0.x);
						this.rotateDeg += Math.atan((y-x)/(1+x*y)) * 180/Math.PI;
						this.touch0 = touch0;
						this.touch1 = touch1;
					}

					this.drawImage();
				} else if( this.touch0 ) {
					// 只有在允许调整大小时才处理裁剪框大小调整
					if (this.resizeHandle && this.letChangeSize) {
						const style = {...this.selStyle};
						const left = parseInt(style.left);
						const top = parseInt(style.top);
						const width = parseInt(style.width);
						const height = parseInt(style.height);
						const minWidth = 50;
						const minHeight = 50;
						
						switch (this.resizeHandle) {
							case 'top-left':
								style.left = touch0.x + 'px';
								style.top = touch0.y + 'px';
								style.width = (left + width - touch0.x) + 'px';
								style.height = (top + height - touch0.y) + 'px';
								break;
							case 'top-right':
								style.top = touch0.y + 'px';
								style.width = (touch0.x - left) + 'px';
								style.height = (top + height - touch0.y) + 'px';
								break;
							case 'bottom-left':
								style.left = touch0.x + 'px';
								style.width = (left + width - touch0.x) + 'px';
								style.height = (touch0.y - top) + 'px';
								break;
							case 'bottom-right':
								style.width = (touch0.x - left) + 'px';
								style.height = (touch0.y - top) + 'px';
								break;
						}
						
						// 确保最小尺寸
						if (parseInt(style.width) >= minWidth && parseInt(style.height) >= minHeight) {
							// 确保裁剪框不超出屏幕边界
							if (parseInt(style.left) >= 0 && 
								parseInt(style.top) >= 0 &&
								(parseInt(style.left) + parseInt(style.width)) <= this.windowWidth &&
								(parseInt(style.top) + parseInt(style.height)) <= (this.windowHeight - tabHeight)) {
								this.selStyle = style;
								// 重新绘制操作层
								this.drawInit();
							}
						}
					} else {
						// 原有的移动图片逻辑
						let x = touch0.x - this.touch0.x,
							y = touch0.y - this.touch0.y,
							beX = this.posWidth + x,
							beY = this.posHeight + y;
						if(this.isin) {
							let	imgWidth = this.useWidth*this.scaleSize,
								imgHeight = this.useHeight*this.scaleSize,
								rx0 = beX+this.useWidth/2,
								ry0 = beY+this.useHeight/2,
								l = rx0-imgWidth/2, t = ry0-imgHeight/2,
								r = l+imgWidth,	    b = t+imgHeight,
								left = parseInt(this.selStyle.left),
								top = parseInt(this.selStyle.top),
								width = parseInt(this.selStyle.width),
								height = parseInt(this.selStyle.height);
								if(!this.lckWidth && Math.abs(x) < 100) {
									if(left >= l && left+width <= r) {
										this.posWidth  = beX;
									} else if(left < l){
										this.posWidth = left - this.scaleWidth;
									} else if(left+width > r) {
										this.posWidth = left-(imgWidth-width) - this.scaleWidth;
									}
								}
								if(!this.lckHeight && Math.abs(y) < 100) {
									if(top >= t && top+height <= b) {
										this.posHeight  = beY;
									} else if(top < t) {
										this.posHeight = top - this.scaleHeight;
									} else if(top+height > b) {
										this.posHeight = top-(imgHeight-height) - this.scaleHeight;
									}
								}
						} else {
							if( Math.abs(x) < 100 && !this.lckWidth) this.posWidth  = beX;
							if( Math.abs(y) < 100 && !this.lckHeight) this.posHeight = beY;
						}

						this.touch0 = touch0;
						this.drawImage();
					}
				}
			},
			end(e) {
				let touches = e.touches,
					touch0 = touches && touches[0],
					touch1 = touches && touches[1];
				if(touch0) {
					this.touch0 = touch0;
				} else {
					this.touch0 = null;
					this.touch1 = null;
					this.resizeHandle = null; // 重置调整手柄
				}
			},
			getImgData() {
				return new Promise((resolve, reject)=>{
					let prvX = this.prvX,
						prvY = this.prvY,
						prvWidth = this.prvWidth,
						prvHeight = this.prvHeight;
					// #ifdef APP-PLUS||H5
					prvX *= this.pixelRatio;
					prvY *= this.pixelRatio;
					prvWidth *= this.pixelRatio;
					prvHeight *= this.pixelRatio;
					// #endif
					uni.canvasGetImageData({
						canvasId: 'prv-canvas-' + this.instanceId,
						x: prvX,
						y: prvY,
						width: prvWidth,
						height: prvHeight,
						success(res) {
							resolve(res.data);
						},
						fail(err) {
							reject(err);
						}
					}, this);
				});
			},
			async colorChange(e) {
				let tm_now = Date.now();
				if(tm_now - this.prvTm < 100) return;
				this.prvTm = tm_now;

				uni.showLoading({ mask: true });

				if( !this.prvImgData ) {
					if( !(this.prvImgData = await this.getImgData().catch((res)=>{
						uni.showToast({
							title: "error_read",
							duration: 2000,
						})
					}))) return;
					this.target = new Uint8ClampedArray(this.prvImgData.length);
				}

				let data = this.prvImgData,
					target = this.target,
					i = e.detail.value,
					r,g,b,a,h,s,l,d,p,q,t,min,max,hK,tR,tG,tB;

				if( i === 0 ) {
					target = data;
				} else {
					i = (i+100)/200;
					if( i < 0.005 ) i = 0;
					if( i > 0.995 ) i = 1;
					for( let n = data.length-1; n >= 0; n-=4 ) {
						r = data[n-3] / 255;
						g = data[n-2] / 255;
						b = data[n-1] / 255;
						max = Math.max(r,g,b);
						min = Math.min(r,g,b);
						d = max-min;
						if ( max === min ){
							h = 0 ;
						}else if( max === r && g>=b ){
							h = 60*( (g-b)/d ) ;
						}else if( max === r && g<b ){
							h = 60*( (g-b)/d ) + 360 ;
						}else if( max === g ){
							h = 60*( (b-r)/d ) + 120 ;
						}else if( max === b ){
							h = 60*( (r-g)/d ) + 240 ;
						}
						l = (max+min)/2 ;
						if ( l===0 || max===min ){
							s = 0 ;
						}else if( 0<l && l<=0.5 ){
							s = d/(2*l) ;
						}else if( l>0.5 ){
							s = d/(2-2*l) ;
						}
						data[n] && (a = data[n]);

						if ( i < 0.5 ){
							s = s*i/0.5 ;
						}else if ( i > 0.5 ){
							s = 2*s + 2*i - (s*i/0.5) - 1 ;
						}

						if ( s === 0 ){
							r = g = b = Math.round( l*255 ) ;
						}else{
							if ( l<0.5 ){
								q = l * ( 1 + s ) ;
							}else if( l>=0.5 ){
								q = l + s - ( l * s ) ;
							}
							p = 2*l-q ;
							hK = h/360 ;
							tR = hK + 1/3 ;
							tG = hK ;
							tB = hK - 1/3 ;
							let correctRGB = (t)=>{
								if( t<0 ){
									return t + 1.0 ;
								}
								if( t>1 ){
									return t - 1.0 ;
								}
								return t ;
							} ;
							let createRGB = (t)=>{
								if ( t<(1/6) ){
									return p+((q-p)*6*t) ;
								}else if( t>=(1/6) && t<(1/2) ){
									return q ;
								}else if( t>=(1/2) && t<(2/3) ){
									return p+((q-p)*6*((2/3)-t)) ;
								}
								return p ;
							} ;
							r = tR = Math.round( createRGB( correctRGB( tR ) )*255 ) ;
							g = tG = Math.round( createRGB( correctRGB( tG ) )*255 ) ;
							b = tB = Math.round( createRGB( correctRGB( tB ) )*255 ) ;
						}
						a && ( target[n] = a ) ;
						target[n-3] = r;
						target[n-2] = g;
						target[n-1] = b;
					}
				}
				let prvX = this.prvX,
					prvY = this.prvY,
					prvWidth = this.prvWidth,
					prvHeight = this.prvHeight;

				this.ctxCanvasPrv.setFillStyle('black');
				this.ctxCanvasPrv.fillRect(prvX, prvY, prvWidth, prvHeight);
				this.ctxCanvasPrv.draw(true);

				// #ifdef APP-PLUS||H5
				prvX *= this.pixelRatio;
				prvY *= this.pixelRatio;
				prvWidth *= this.pixelRatio;
				prvHeight *= this.pixelRatio;
				// #endif
				uni.canvasPutImageData({
					canvasId: 'prv-canvas-' + this.instanceId,
					x: prvX,
					y: prvY,
					width: prvWidth,
					height: prvHeight,
					data: target,
					fail() {
						uni.showToast({
							title: 'error_put',
							duration: 2000
						})
					},
					complete() {
						uni.hideLoading();
					}
				}, this);
			},
			btop(base64) {
				return new Promise(function(resolve, reject) {
					var arr = base64.split(','),
						mime = arr[0].match(/:(.*?);/)[1],
						bstr = atob(arr[1]),
						n = bstr.length,
						u8arr = new Uint8Array(n);
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([u8arr], { type: mime })));
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.u-cropper {
	.my-canvas{
		display: flex;
		position: fixed !important;
		background: #000000;
		left: 0;
		z-index: 100000;
		width: 100%;
	}
	.my-avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 100%;
	}
	.oper-canvas {
		display: flex;
		position: fixed !important;
		left: 0;
		z-index: 100001;
		width: 100%;
	}
	.prv-canvas {
		display: flex;
		position: fixed !important;
		background: #000000;
		left: 0;
		z-index: 200000;
		width: 100%;
	}
	.oper-wrapper {
		height: 50px;
		position: fixed !important;
		box-sizing: border-box;
		border: 1px solid #F1F1F1;
		background: #ffffff;
		width: 100%;
		left: 0;
		bottom: 0;
		z-index: 100009;
		flex-direction: row;
	}
	.oper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10rpx 20rpx;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		align-self: center;
	}
	.btn-wrapper {
		display: flex;
		flex-direction: row;
		/* #ifndef H5 */
		flex-grow: 1;
		/* #endif */
		/* #ifdef H5 */
		height: 50px;
		/* #endif */
		justify-content: space-between;
	}
	.btn-wrapper view {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #333;
		border: 1px solid #f1f1f1;
		border-radius: 6%;
	}
	.hover {
		background: #f1f1f1;
		border-radius: 6%;
	}
	.clr-wrapper {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
	}
	.clr-wrapper view {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		color: #333;
		border: 1px solid #f1f1f1;
		border-radius: 6%;
	}
	.my-slider {
		flex-grow: 1;
	}
}
</style>

