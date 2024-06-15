import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
		containerStyle: {
          type: String,
          default: null
		},
        content: String,
        copyLink: {
		  type: Boolean,
		  default: () => defProps.parse.copyLink
        },
        domain: String,
        errorImg: {
		  type: String,
		  default: () => defProps.parse.errorImg
        },
        lazyLoad: {
		  type: Boolean,
		  default: () => defProps.parse.lazyLoad
        },
        loadingImg: {
		  type: String,
		  default: () => defProps.parse.loadingImg
        },
        pauseVideo: {
		  type: Boolean,
		  default: () => defProps.parse.pauseVideo
        },
        previewImg: {
		  type: Boolean,
		  default: () => defProps.parse.previewImg
        },
        scrollTable: Boolean,
        selectable: Boolean,
        setTitle: {
		  type: Boolean,
		  default: () => defProps.parse.setTitle
        },
        showImgMenu: {
		  type: Boolean,
		  default: () => defProps.parse.showImgMenu
        },
        tagStyle: Object,
        useAnchor: null
	  }
}
