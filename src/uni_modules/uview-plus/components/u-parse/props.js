import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
		containerStyle: {
          type: String,
          default: null
		},
        content: String,
        copyLink: {
		  type: Boolean,
		  default: defprops.parse.copyLink
        },
        domain: String,
        errorImg: {
		  type: String,
		  default: defprops.parse.errorImg
        },
        lazyLoad: {
		  type: Boolean,
		  default: defprops.parse.lazyLoad
        },
        loadingImg: {
		  type: String,
		  default: defprops.parse.loadingImg
        },
        pauseVideo: {
		  type: Boolean,
		  default: defprops.parse.pauseVideo
        },
        previewImg: {
		  type: Boolean,
		  default: defprops.parse.previewImg
        },
        scrollTable: Boolean,
        selectable: Boolean,
        setTitle: {
		  type: Boolean,
		  default: defprops.parse.setTitle
        },
        showImgMenu: {
		  type: Boolean,
		  default: defprops.parse.showImgMenu
        },
        tagStyle: Object,
        useAnchor: null
	  }
}
