<template>
	<view class="u-upload" :style="[addStyle(customStyle)]">
		<view class="u-upload__wrap" >
			<template v-if="previewImage">
				<view
				    class="u-upload__wrap__preview"
				    v-for="(item, index) in lists"
				    :key="index"
				>
					<image
					    v-if="item.isImage || (item.type && item.type === 'image')"
					    :src="item.thumb || item.url"
					    :mode="imageMode"
					    class="u-upload__wrap__preview__image"
					    @tap="onClickPreview(item, index)"
						:style="[{
							width: addUnit(width),
							height: addUnit(height)
						}]"
					/>
					<view class="u-upload__wrap__preview__video"
						:style="{
							width: addUnit(width),
							height: addUnit(height)
						}"
						v-else-if="(item.isVideo || (item.type && item.type === 'video')) && getVideoThumb">
						<image
							v-if="item.thumb"
						    :src="item.thumb"
						    :mode="imageMode"
						    class="u-upload__wrap__preview__image"
						    @tap="onClickPreview(item, index)"
							:style="[{
								width: addUnit(width),
								height: addUnit(height)
							}]"
						/>
						<up-icon
							v-else
						    color="#80CBF9"
						    size="26"
						    :name="item.isVideo || (item.type && item.type === 'video') ? 'movie' : 'file-text'"
						></up-icon>
						<view v-if="item.status === 'success'"
							class="u-upload__wrap__play"
							@tap="onClickPreview(item, index)">
							<slot name="playIcon"></slot>
							<up-icon v-if="!$slots['playIcon']"
								class="u-upload__wrap__play__icon"
								name="play-right" size="22px"></up-icon>
						</view>
					</view>
					<view
					    v-else
					    class="u-upload__wrap__preview__other"
						@tap="onClickPreview(item, index)"
						:style="[{
							width: addUnit(width),
							height: addUnit(height)
						}]"
					>
						<up-icon
						    color="#80CBF9"
						    size="26"
						    :name="item.isVideo || (item.type && item.type === 'video') ? 'movie' : 'folder'"
						></up-icon>
						<text class="u-upload__wrap__preview__other__text">
							{{item.isVideo || (item.type && item.type === 'video') ? item.name || t("up.common.video") : item.name || t("up.common.file")}}
						</text>
					</view>
					<view
					    class="u-upload__status"
					    v-if="item.status === 'uploading' || item.status === 'failed'"
					>
						<view class="u-upload__status__icon">
							<up-icon
							    v-if="item.status === 'failed'"
							    name="close-circle"
							    color="#ffffff"
							    size="25"
							/>
							<u-loading-icon
							    size="22"
							    mode="circle"
							    v-else
							/>
						</view>
						<text
						    v-if="item.message"
						    class="u-upload__status__message"
						>{{ item.message }}</text>
						<up-gap class="u-upload__progress" height="3px"
							:style="{width: item.progress + '%'}"></up-gap>
					</view>
					<view
					    class="u-upload__deletable"
					    v-if="item.status !== 'uploading' && (deletable || item.deletable)"
					    @tap.stop="deleteItem(index)"
					>
						<view class="u-upload__deletable__icon">
							<up-icon
							    name="close"
							    color="#ffffff"
							    size="10"
							></up-icon>
						</view>
					</view>
					<slot name="success">
						<view
							class="u-upload__success"
							v-if="item.status === 'success'"
						>
							<!-- #ifdef APP-NVUE -->
							<image
								:src="successIcon"
								class="u-upload__success__icon"
							></image>
							<!-- #endif -->
							<!-- #ifndef APP-NVUE -->
							<view class="u-upload__success__icon">
								<up-icon
									name="checkmark"
									color="#ffffff"
									size="12"
								></up-icon>
							</view>
							<!-- #endif -->
						</view>
					</slot>
				</view>
			</template>
			<canvas id="myCanvas" type="2d"
				style="width: 100px; height: 150px;display: none;"></canvas>
			<template v-if="isInCount">
				<view
				    v-if="$slots.trigger"
				    @tap="chooseFile"
				>
					<slot name="trigger" />
				</view>
				<view
				    v-else-if="!$slots.trigger && ($slots.default || $slots.$default)"
				    @tap="chooseFile"
				>
					<slot />
				</view>
				<view
				    v-else
				    class="u-upload__button"
				    :hover-class="!disabled ? 'u-upload__button--hover' : ''"
				    hover-stay-time="150"
				    @tap="chooseFile"
				    :class="[disabled && 'u-upload__button--disabled']"
					:style="[{
						width: addUnit(width),
						height: addUnit(height)
					}]"
				>
					<up-icon
					    :name="uploadIcon"
					    size="26"
					    :color="uploadIconColor"
					></up-icon>
					<text
					    v-if="uploadText"
					    class="u-upload__button__text"
					>{{ uploadText }}</text>
				</view>
			</template>
		</view>
		<up-popup
			mode="center"
			v-model:show="popupShow">
			<video id="myVideo" v-if="popupShow"
				:src="currentItemIndex >= 0 ? lists[currentItemIndex].url : ''"
				@error="videoErrorCallback" show-center-play-btn
				:object-fit='videoPreviewObjectFit' show-fullscreen-btn='true'
				enable-play-gesture controls
				:autoplay="true" auto-pause-if-open-native
				@loadedmetadata="loadedVideoMetadata"
				:initial-time='0.1'>
			</video>
		</up-popup>
	</view>
</template>

<script>
	import {
		chooseFile
	} from './utils';
	import { mixinUpload } from './mixin';
	import { props } from './props';
	import { mpMixin } from '../../libs/mixin/mpMixin';
	import { mixin } from '../../libs/mixin/mixin';
	import { addStyle, addUnit, toast } from '../../libs/function/index';
	import test from '../../libs/function/test';
	import { t } from '../../libs/i18n'
	/**
	 * upload 上传
	 * @description 该组件用于上传图片场景
	 * @tutorial https://uview-plus.jiangruyi.com/components/upload.html
	 * @property {String}			accept				接受的文件类型, 可选值为all media image file video （默认 'image' ）
	 * @property {String | Array}	capture				图片或视频拾取模式，当accept为image类型时设置capture可选额外camera可以直接调起摄像头（默认 ['album', 'camera'] ）
	 * @property {Array}			extension			选择文件的后缀名，暂只支持.zip、.png等，不支持application/msword等值
	 * @property {Boolean}			compressed			当accept为video时生效，是否压缩视频，默认为true（默认 true ）
	 * @property {String}			camera				当accept为video时生效，可选值为back或front（默认 'back' ）
	 * @property {Number}			maxDuration			当accept为video时生效，拍摄视频最长拍摄时间，单位秒（默认 60 ）
	 * @property {String}			uploadIcon			上传区域的图标，只能内置图标（默认 'camera-fill' ）
	 * @property {String}			uploadIconColor		上传区域的图标的字体颜色，只能内置图标（默认 #D3D4D6 ）
	 * @property {Boolean}			useBeforeRead		是否开启文件读取前事件（默认 false ）
	 * @property {Boolean}			previewFullImage	是否显示组件自带的图片预览功能（默认 true ）
	 * @property {String | Number}	maxCount			最大上传数量（默认 52 ）
	 * @property {Boolean}			disabled			是否启用（默认 false ）
	 * @property {String}			imageMode			预览上传的图片时的裁剪模式，和image组件mode属性一致（默认 'aspectFill' ）
	 * @property {String}			name				标识符，可以在回调函数的第二项参数中获取
	 * @property {Array}			sizeType			所选的图片的尺寸, 可选值为original compressed（默认 ['original', 'compressed'] ）
	 * @property {Boolean}			multiple			是否开启图片多选，部分安卓机型不支持 （默认 false ）
	 * @property {Boolean}			deletable			是否展示删除按钮（默认 true ）
	 * @property {String | Number}	maxSize				文件大小限制，单位为byte （默认 Number.MAX_VALUE ）
	 * @property {Array}			fileList			显示已上传的文件列表
	 * @property {String}			uploadText			上传区域的提示文字
	 * @property {String | Number}	width				内部预览图片区域和选择图片按钮的区域宽度（默认 80 ）
	 * @property {String | Number}	height				内部预览图片区域和选择图片按钮的区域高度（默认 80 ）
	 * @property {Object}			customStyle			组件的样式，对象形式
	 * @event {Function} afterRead		读取后的处理函数
	 * @event {Function} beforeRead		读取前的处理函数
	 * @event {Function} oversize		文件超出大小限制
	 * @event {Function} clickPreview	点击预览图片
	 * @event {Function} delete 		删除图片
	 * @example <u-upload :action="action" :fileList="fileList" ></u-upload>
	 */
	export default {
		name: "u-upload",
		mixins: [mpMixin, mixin, mixinUpload, props],
		data() {
			return {
				// #ifdef APP-NVUE
				successIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAACP0lEQVRYCc3YXygsURwH8K/dpcWyG3LF5u/6/+dKVylSypuUl6uUPMifKMWL8oKEB1EUT1KeUPdR3uTNUsSLxb2udG/cbvInNuvf2rVnazZ/ZndmZ87snjM1Z+Z3zpzfp9+Z5mEAhlvjRtZgCKs+gnPAOcAkkMOR4jEHfItjDvgRxxSQD8cM0BuOCaAvXNCBQrigAsXgggYUiwsK0B9cwIH+4gIKlIILGFAqLiBAOTjFgXJxigJp4BQD0sIpAqSJow6kjSNAFTnRaHJwLenD6Mud52VQAcrBfTd2oyq+HtGaGGWAcnAVcXWoM3bCZrdi+ncPfaAcXE5UKVpdW/vitGPqqAtn98d0gXJwX7Qp6MmegUYVhvmTIezdmHlxJCjpHRTCFerLkRRu4k0aqdajN3sWOo0BK//msHa+xDuPC/oNFMKRhTtM4xjIX0SCNpXL4+7VIaHuyiWEp2L7ahWLf8fejfPdqPmC3mJicORZUp1CQzm+GiphvljGk+PBvWRbxii+xVTj5M6CiZ/tsDufvaXyxEUDxeLIyvu3m0iOyEFWVAkydcVYdyFrE9tQk9iMq6f/GNlvwt3LjQfh60LUrw9/cFyyMJUW/XkLSNMV4Mi6C5ML+ui4x5ClAX9sB9w0wV6wglJwJCv5fOxcr6EstgbGiEw4XcfUry4cWrcEUW8n+ARKxXEJHhw2WG43UKSvwI/TSZgvl7kh0b3XLZaLEy0QmMgLZAVH7J+ALOE+AVnDvQOyiPMAWcW5gSzjCPAV+78S5WE0GrQAAAAASUVORK5CYII=',
				// #endif
				lists: [],
				isInCount: true,
				popupShow: false,
				currentItemIndex: -1
			}
		},
		watch: {
			// 监听文件列表的变化，重新整理内部数据
			fileList: {
				handler() {
					this.formatFileList()
				},
				immediate: true,
				deep: true,
			},
			deletable(newVal) {
				this.formatFileList()
			},
			maxCount(newVal) {
				this.formatFileList()
			},
			accept(newVal) {
				this.formatFileList()
			},
			popupShow(newVal) {
				if (!newVal) {
					this.currentItemIndex = -1;
				}
			}
		},
		// #ifdef VUE3
		emits: ['error', 'beforeRead', 'oversize', 'afterRead', 'delete', 'clickPreview', 'update:fileList', 'afterAutoUpload'],
		// #endif
		methods: {
			t,
			addUnit,
			addStyle,
			videoErrorCallback() {},
			loadedVideoMetadata(e) {
				if (this.currentItemIndex < 0) {
					return;
				}
				if (this.autoUploadDriver != 'local') {
					return;
				}
				if (!this.getVideoThumb) {
					return;
				}
				// 截取第一帧作为封面，oss等云存储场景直接使用拼接参数。
				let w = this.lists[this.currentItemIndex].width;
				let h = this.lists[this.currentItemIndex].height;
				const dpr = uni.getSystemInfoSync().pixelRatio;
				uni.createSelectorQuery().select('#myVideo').context(res => {
					console.log('select video', res)
					const myVideo = res.context
					uni.createSelectorQuery()
					  .select('#myCanvas')
					  .fields({ node: true, size: true })
					  .exec(([res]) => {
						console.log('select canvas', res)
						const ctx1 = res[0].node.getContext('2d')
						res[0].node.width = w * dpr
						res[0].node.height = h * dpr
						// Draw the first frame and export it as an image
						// myVideo.onPlay(() => {
							setTimeout(() => {
								captureFirstFrame()
							}, 500)
						// })
						const captureFirstFrame = () => {
							ctx1.drawImage(myVideo, 0, 0, w * dpr, h * dpr)
							wx.canvasToTempFilePath({
								canvas: res[0].node,
								success: (result) => {
									console.log('First frame image path:', result
										.tempFilePath)
									// Now you can use the image path (result.tempFilePath)
									this.fileList['currentItemIndex'].thumb = result.tempFilePath
								},
								fail: (err) => {
									console.error('Failed to export image:', err)
								}
							})
						}

						// Capture the first frame
						setInterval(() => {
							ctx1.drawImage(myVideo, 0, 0, w * dpr, h * dpr);
						}, 1000 / 24)
					}).exec()
				}).exec()
			},
			formatFileList() {
				const {
					fileList = [], maxCount
				} = this;
				const lists = fileList.map((item) => {
					const name = item.name || item.url || item.thumb
					return Object.assign(Object.assign({}, item), {
						// 如果item.url为本地选择的blob文件的话，无法判断其为video还是image，此处优先通过accept做判断处理
						isImage: item.name ? test.image(item.name) : (this.accept === 'image' || test.image(name)),
						isVideo: item.name ? test.video(item.name) : (this.accept === 'video' || test.video(name)),
						deletable: typeof item.deletable === 'boolean' ? item.deletable : this.deletable,
					})
				});
				this.lists = lists
				this.isInCount = lists.length < maxCount
			},
			chooseFile(params) {
				const {
					maxCount,
					multiple,
					lists,
					disabled
				} = this;
				if (disabled) return Promise.reject();
				const chooseParams = Object.assign({
					accept: this.accept,
					extension: this.extension,
					multiple: this.multiple,
					capture: this.capture,
					compressed: this.compressed,
					maxDuration: this.maxDuration,
					sizeType: this.sizeType,
					camera: this.camera,
				}, {
					maxCount: maxCount - lists.length,
					...params
				})
				return chooseFile(chooseParams)
					.then((res) => {
						const result = chooseParams.multiple ? res : res[0]
						this.onBeforeRead(result);
						return result
					})
					.catch((error) => {
						this.$emit('error', error);
					});
			},
			// 文件读取之前
			onBeforeRead(file) {
				const {
					beforeRead,
					useBeforeRead,
				} = this;
				let res = file
				// beforeRead是否为一个方法
				if (test.func(beforeRead)) {
					// 如果用户定义了此方法，则去执行此方法，并传入读取的文件回调
					res = beforeRead(file, this.getDetail());
				}
				if (useBeforeRead) {
					res = new Promise((resolve, reject) => {
						this.$emit(
							'beforeRead',
							Object.assign(Object.assign({
								file
							}, this.getDetail()), {
								callback: (ok) => {
									ok ? resolve() : reject();
								},
							})
						);
					});
				}
				if (test.promise(res)) {
					res.then((data) => this.onAfterRead(data || file));
				} else {
					this.onAfterRead(res || file);
				}
			},
			getDetail(index) {
				return {
					name: this.name,
					index: index == null ? this.fileList.length : index,
				};
			},
			async onAfterRead(file) {
				const {
					maxSize,
					afterRead
				} = this;
				const oversize = Array.isArray(file) ?
					file.some((item) => item.size > maxSize) :
					file.size > maxSize;
				if (oversize) {
					uni.showToast({
						title: t("up.upload.sizeExceed")
					})
					this.$emit('oversize', Object.assign({
						file
					}, this.getDetail()));
					return;
				}
				let len = this.fileList.length;
				if (this.autoUpload) {
					// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
					let lists = [].concat(file);
					let fileListLen = this.fileList.length;
					lists.map((item) => {
						this.fileList.push({
							...item,
							status: 'uploading',
							message: t("up.upload.uploading"),
							progress: 0
						});
					});
					let that = this;
					this.$emit('update:fileList', this.fileList);
					for (let i = 0; i < lists.length; i++) {
						let j = i;
						let result = '';
						switch(this.autoUploadDriver) {
							case 'cos': // 腾讯云
								break;
							case 'kodo': // 七牛云
								break;
							case 'oss':
							case 'upload_oss':
								// 阿里云前端直传
								// 获取签名
								console.log()
								let formData = {};
								let ret = await uni.request({
									url: this.autoUploadAuthUrl,
									method: 'get',
									header: this.autoUploadHeader,
									data: {
										filename: lists[j].name
									}
								});
								// console.log(ret);
								let res0 = ret.data;
								if (res0.code == 200) {
									// 路径 + 文件名 + 扩展名
									// 不传递filename就要拼接key
									// res0.data.params.key = res0.data.params.dir + res0.data.params.uniqidName + fileExt;
									formData = res0.data.params;
								} else {
									uni.showToast({
										title: res0.msg,
										duration: 1500
									});
									return;
								}
								var uploadTask = uni.uploadFile({
									url: res0.data.params.host,
									filePath: lists[j].url,
									name: 'file',
									// fileType: 'video', // 仅支付宝小程序，且必填。
									// header: header,
									formData: formData,
									success: (uploadFileRes) => {
										let thumb = '';
										let afterPromise = '';
										if (that.customAfterAutoUpload) {
											afterPromise = new Promise((resolve, reject) => {
												that.$emit(
													'afterAutoUpload',
													Object.assign(res0, {
														callback: (r) => {
															r.url ? resolve(r) : reject();
														},
													})
												);
											});
										}
										if (test.promise(afterPromise)) {
											afterPromise.then((data) => that.succcessUpload(len + j, data.url, data.thumb));
										} else {
											result = res0.data.params.host + '/' + res0.data.params.key;
											if (that.accept === 'video' || test.video(result)) {
												thumb = result + '?x-oss-process=video/snapshot,t_10000,m_fast';
											}
											that.succcessUpload(len + j, result, thumb);
										}
									}
								});
								uploadTask.onProgressUpdate((res) => {
									that.updateUpload(len + j, {
										progress: res.progress
									});
									// console.log('上传进度' + res.progress);
									// console.log('已经上传的数据长度' + res.totalBytesSent);
									// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
								});
								break;
							case 'local':
							default:
								// 服务器本机上传
								var uploadTask = uni.uploadFile({
									url: this.autoUploadApi,
									filePath: lists[j].url,
									name: 'file',
									// fileType: 'video', // 仅支付宝小程序，且必填。
									header: this.autoUploadHeader,
									success: (uploadFileRes) => {
										let res0 = uploadFileRes.data;
										let afterPromise = '';
										if (that.customAfterAutoUpload) {
											afterPromise = new Promise((resolve, reject) => {
												that.$emit(
													'afterAutoUpload',
													Object.assign(res0, {
														callback: (r) => {
															r.url ? resolve(r) : reject();
														}
													})
												);
											});
										}
										if (test.promise(afterPromise)) {
											afterPromise.then((data) => that.succcessUpload(len + j, data.url));
										} else {
											if (res0.code != 200) {
												uni.showToast({
													title: res0.msg
												});
											} else {
												result = res0.data.url;
												that.succcessUpload(len + j, result);
											}
										}
									}
								});
								uploadTask.onProgressUpdate((res) => {
									that.updateUpload(len + j, {
										progress: res.progress
									});
									// console.log('上传进度' + res.progress);
									// console.log('已经上传的数据长度' + res.totalBytesSent);
									// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
								});
								break;
						}
					}
				} else {
					if (typeof afterRead === 'function') {
						afterRead(file, this.getDetail());
					}
					this.$emit('afterRead', Object.assign({
						file
					}, this.getDetail()));
				}
			},
			updateUpload(index, param) {
				let item = this.fileList[index];
				this.fileList.splice(index, 1, {
					...item,
					// 注意这里不判断会出现succcessUpload先执行又被覆盖的问题
					status: param.progress == 100 ? 'success' : 'uploading',
					message: '',
					progress: param.progress
				});
				this.$emit('update:fileList', this.fileList);
			},
			succcessUpload(index, url, thumb = '') {
				let item = this.fileList[index];
				this.fileList.splice(index, 1, {
					...item,
					status: 'success',
					message: '',
					url: url,
					progress: 100,
					thumb: thumb
				});
				this.$emit('update:fileList', this.fileList);
			},
			deleteItem(index) {
				if (this.autoDelete) {
					this.fileList.splice(index, 1);
					this.$emit('update:fileList', this.fileList);
				} else {
					this.$emit(
						'delete',
						Object.assign(Object.assign({}, this.getDetail(index)), {
							file: this.fileList[index],
						})
					);
				}
			},
			// 预览图片
			onPreviewImage(previewItem, index) {
				if (!previewItem.isImage || !this.previewFullImage) return
                let current = 0;
                const urls = [];
                let imageIndex = 0;
                for (var i = 0; i < this.lists.length; i++) {
                    const item = this.lists[i];
                    if (item.isImage || (item.type && item.type === 'image')) {
                        urls.push(item.url || item.thumb);
                        if (i === index) {
                            current = imageIndex;
                        }
                        imageIndex += 1;
                    }
                }
                if (urls.length < 1) {
                    return;
                }
				uni.previewImage({
                    urls: urls,
                    current: current,
					fail() {
						toast(t("up.upload.previewImageFail"))
					},
				});
			},
			onPreviewVideo(previewItem, index) {
				if (!this.previewFullImage) return;
                let current = 0;
                const sources = [];
                let videoIndex = 0;
                for (var i = 0; i < this.lists.length; i++) {
                    const item = this.lists[i];
                    if (item.isVideo || (item.type && item.type === 'video')) {
                        sources.push(Object.assign(Object.assign({}, item), {
                            type: 'video'
                        }));
                        if (i === index) {
                            current = videoIndex;
                        }
                        videoIndex += 1;
                    }
                }
                if (sources.length < 1) {
                    return;
                }
				// #ifndef MP-WEIXIN
				this.popupShow = true;
				this.currentItemIndex = index;
				console.log(this.lists[this.currentItemIndex])
				// #endif
				// #ifdef MP-WEIXIN
				wx.previewMedia({
					sources: sources,
					current: current,
					fail() {
						toast(t("up.upload.previewVideoFail"))
					},
				});
				// #endif
			},
			onClickPreview(item, index) {
				if (this.previewFullImage) {
					switch (item.type) {
						case 'image':
							this.onPreviewImage(item, index);
							break;
						case 'video':
							this.onPreviewVideo(item, index);
							break;
						default:
							break;
					}
				}
				this.$emit(
					'clickPreview',
					Object.assign(Object.assign({}, item), this.getDetail(index))
				);
			}
		}
	}
</script>

<style lang="scss" scoped>
	$u-upload-preview-border-radius: 2px !default;
	$u-upload-preview-margin: 0 8px 8px 0 !default;
	$u-upload-image-width:80px !default;
	$u-upload-image-height:$u-upload-image-width;
	$u-upload-other-bgColor: rgb(242, 242, 242) !default;
	$u-upload-other-flex:1 !default;
	$u-upload-text-font-size:11px !default;
	$u-upload-text-color:$u-tips-color !default;
	$u-upload-text-margin-top:2px !default;
	$u-upload-deletable-right:0 !default;
	$u-upload-deletable-top:0 !default;
	$u-upload-deletable-bgColor:rgb(55, 55, 55) !default;
	$u-upload-deletable-height:14px !default;
	$u-upload-deletable-width:$u-upload-deletable-height;
	$u-upload-deletable-boder-bottom-left-radius:100px !default;
	$u-upload-deletable-zIndex:3 !default;
	$u-upload-success-bottom:0 !default;
	$u-upload-success-right:0 !default;
	$u-upload-success-border-style:solid !default;
	$u-upload-success-border-top-color:transparent !default;
	$u-upload-success-border-left-color:transparent !default;
	$u-upload-success-border-bottom-color: $u-success !default;
	$u-upload-success-border-right-color:$u-upload-success-border-bottom-color;
	$u-upload-success-border-width:9px !default;
	$u-upload-icon-top:0px !default;
	$u-upload-icon-right:0px !default;
	$u-upload-icon-h5-top:1px !default;
	$u-upload-icon-h5-right:0 !default;
	$u-upload-icon-width:16px !default;
	$u-upload-icon-height:$u-upload-icon-width;
	$u-upload-success-icon-bottom:-10px !default;
	$u-upload-success-icon-right:-10px !default;
	$u-upload-status-right:0 !default;
	$u-upload-status-left:0 !default;
	$u-upload-status-bottom:0 !default;
	$u-upload-status-top:0 !default;
	$u-upload-status-bgColor:rgba(0, 0, 0, 0.5) !default;
	$u-upload-status-icon-Zindex:1 !default;
	$u-upload-message-font-size:12px !default;
	$u-upload-message-color:#FFFFFF !default;
	$u-upload-message-margin-top:5px !default;
	$u-upload-button-width:80px !default;
	$u-upload-button-height:$u-upload-button-width;
	$u-upload-button-bgColor:rgb(244, 245, 247) !default;
	$u-upload-button-border-radius:2px !default;
	$u-upload-botton-margin: 0 8px 8px 0 !default;
	$u-upload-text-font-size:11px !default;
	$u-upload-text-color:$u-tips-color !default;
	$u-upload-text-margin-top: 2px !default;
	$u-upload-hover-bgColor:rgb(230, 231, 233) !default;
	$u-upload-disabled-opacity:.5 !default;

	.u-upload {
		@include flex(column);
		flex: 1;

		&__wrap {
			@include flex;
			flex-wrap: wrap;
			flex: 1;

			&__preview {
				border-radius: $u-upload-preview-border-radius;
				margin: $u-upload-preview-margin;
				position: relative;
				overflow: hidden;
				@include flex;

				&__image {
					width: $u-upload-image-width;
					height: $u-upload-image-height;
				}

				&__video,
				&__other {
					width: $u-upload-image-width;
					height: $u-upload-image-height;
					background-color: $u-upload-other-bgColor;
					flex: $u-upload-other-flex;
					@include flex(column);
					justify-content: center;
					align-items: center;

					&__text {
						font-size: $u-upload-text-font-size;
						color: $u-upload-text-color;
						margin-top: $u-upload-text-margin-top;
					}
				}
			}
		}
		&__wrap__play {
			position: absolute;
			top: 0px;
			left: 0px;
			bottom: 0px;
			right: 0px;
			display: flex;
			justify-content: center;
			align-items: center;
			&__icon {
				background: #fff;
				border-radius: 100px;
				opacity: 0.8;
			};
		}

		&__deletable {
			position: absolute;
			top: $u-upload-deletable-top;
			right: $u-upload-deletable-right;
			background-color: $u-upload-deletable-bgColor;
			height: $u-upload-deletable-height;
			width: $u-upload-deletable-width;
			@include flex;
			border-bottom-left-radius: $u-upload-deletable-boder-bottom-left-radius;
			align-items: center;
			justify-content: center;
			z-index: $u-upload-deletable-zIndex;

			&__icon {
				position: absolute;
				transform: scale(0.7);
				top: $u-upload-icon-top;
				right: $u-upload-icon-right;
				/* #ifdef H5 */
				top: $u-upload-icon-h5-top;
				right: $u-upload-icon-h5-right;
				/* #endif */
			}
		}

		&__success {
			position: absolute;
			bottom: $u-upload-success-bottom;
			right: $u-upload-success-right;
			@include flex;
			// 由于weex(nvue)为阿里巴巴的KPI(部门业绩考核)的laji产物，不支持css绘制三角形
			// 所以在nvue下使用图片，非nvue下使用css实现
			/* #ifndef APP-NVUE */
			border-style: $u-upload-success-border-style;
			border-top-color: $u-upload-success-border-top-color;
			border-left-color: $u-upload-success-border-left-color;
			border-bottom-color: $u-upload-success-border-bottom-color;
			border-right-color: $u-upload-success-border-right-color;
			border-width: $u-upload-success-border-width;
			align-items: center;
			justify-content: center;
			/* #endif */

			&__icon {
				/* #ifndef APP-NVUE */
				position: absolute;
				transform: scale(0.7);
				bottom: $u-upload-success-icon-bottom;
				right: $u-upload-success-icon-right;
				/* #endif */
				/* #ifdef APP-NVUE */
				width: $u-upload-icon-width;
				height: $u-upload-icon-height;
				/* #endif */
			}
		}
		&__progress {
			background-color: $u-primary !important;
			position: absolute;
			bottom: 0;
			left: 0;
		}

		&__status {
			position: absolute;
			top: $u-upload-status-top;
			bottom: $u-upload-status-bottom;
			left: $u-upload-status-left;
			right: $u-upload-status-right;
			background-color: $u-upload-status-bgColor;
			@include flex(column);
			align-items: center;
			justify-content: center;

			&__icon {
				position: relative;
				z-index: $u-upload-status-icon-Zindex;
			}

			&__message {
				font-size: $u-upload-message-font-size;
				color: $u-upload-message-color;
				margin-top: $u-upload-message-margin-top;
			}
		}

		&__button {
			@include flex(column);
			align-items: center;
			justify-content: center;
			width: $u-upload-button-width;
			height: $u-upload-button-height;
			background-color: $u-upload-button-bgColor;
			border-radius: $u-upload-button-border-radius;
			margin: $u-upload-botton-margin;
			/* #ifndef APP-NVUE */
			box-sizing: border-box;
			/* #endif */

			&__text {
				font-size: $u-upload-text-font-size;
				color: $u-upload-text-color;
				margin-top: $u-upload-text-margin-top;
			}

			&--hover {
				background-color: $u-upload-hover-bgColor;
			}

			&--disabled {
				opacity: $u-upload-disabled-opacity;
			}
		}
	}
</style>
