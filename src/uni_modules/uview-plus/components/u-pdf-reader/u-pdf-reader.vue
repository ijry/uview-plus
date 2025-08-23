<template>
	<view class="up-pdf-reader" :style="{ height: height }">
		<web-view :fullscreen="false"
			:src="viewerUrl" :style="{ width: '750rpx', height: height }"
            :webview-styles="{ width: '750rpx', height: height }"
			frameborder="0"
		></web-view>
	</view>
</template>

<script>
	import props from './props.js';

	/**
	 * pdfReader PDF阅读器
	 * @description 基于pdf.js的PDF阅读器组件
	 * @tutorial https://uview-plus.jiangruyi.com/components/pdfReader.html
	 * @property {String}			src				PDF文件地址
	 * @property {String}	        height			组件高度，默认为'700px'
	 * @property {String}			pdfjsDomain		pdfjs资源域名，默认为'https://uview-plus.jiangruyi.com/h5'
	 * @example <up-pdf-reader src="https://example.com/file.pdf"></up-pdf-reader>
	 */
	export default {
		name: 'up-pdf-reader',
		mixins: [props],
        data() {
            return {
                baseUrlInner: 'https://uview-plus.jiangruyi.com/h5',
                viewerUrl: ''
            }
        },
        watch: {
            baseUrl: function (val) {
                this.baseUrl = val;
            },
            src: function (val) {
                this.viewerUrl = `${this.baseUrlInner}/static/pdfjs/web/viewer.html?file=` + encodeURIComponent(val);
            }
        },
        mounted() {
            if (this.baseUrl) {
                this.baseUrlInner = this.baseUrl;
            }
            this.viewerUrl = `${this.baseUrlInner}/static/pdfjs/web/viewer.html?file=` + encodeURIComponent(this.src);
		}
	}
</script>

<style lang="scss" scoped>	
	.up-pdf-reader {
	}
</style>