import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 接受的文件类型, 可选值为all media image file video
        accept: {
            type: String,
            default: () => defProps.upload.accept
        },
        extension: {
            type: Array,
            default: () => defProps.upload.extension
        },
        // 	图片或视频拾取模式，当accept为image类型时设置capture可选额外camera可以直接调起摄像头
        capture: {
            type: [String, Array],
            default: () => defProps.upload.capture
        },
        // 当accept为video时生效，是否压缩视频，默认为true
        compressed: {
            type: Boolean,
            default: () => defProps.upload.compressed
        },
        // 当accept为video时生效，可选值为back或front
        camera: {
            type: String,
            default: () => defProps.upload.camera
        },
        // 当accept为video时生效，拍摄视频最长拍摄时间，单位秒
        maxDuration: {
            type: Number,
            default: () => defProps.upload.maxDuration
        },
        // 上传区域的图标，只能内置图标
        uploadIcon: {
            type: String,
            default: () => defProps.upload.uploadIcon
        },
        // 上传区域的图标的颜色，默认
        uploadIconColor: {
            type: String,
            default: () => defProps.upload.uploadIconColor
        },
        // 是否开启文件读取前事件
        useBeforeRead: {
            type: Boolean,
            default: () => defProps.upload.useBeforeRead
        },
        // 读取后的处理函数
        afterRead: {
            type: Function,
            default: null
        },
        // 读取前的处理函数
        beforeRead: {
            type: Function,
            default: null
        },
        // 是否显示组件自带的图片&视频预览功能
        previewFullImage: {
            type: Boolean,
            default: () => defProps.upload.previewFullImage
        },
        // 最大上传数量
        maxCount: {
            type: [String, Number],
            default: () => defProps.upload.maxCount
        },
        // 是否启用
        disabled: {
            type: Boolean,
            default: () => defProps.upload.disabled
        },
        // 预览上传的图片时的裁剪模式，和image组件mode属性一致
        imageMode: {
            type: String,
            default: () => defProps.upload.imageMode
        },
        // 标识符，可以在回调函数的第二项参数中获取
        name: {
            type: String,
            default: () => defProps.upload.name
        },
        // 所选的图片的尺寸, 可选值为original compressed
        sizeType: {
            type: Array,
            default: () => defProps.upload.sizeType
        },
        // 是否开启图片多选，部分安卓机型不支持
        multiple: {
            type: Boolean,
            default: () => defProps.upload.multiple
        },
        // 是否展示删除按钮
        deletable: {
            type: Boolean,
            default: () => defProps.upload.deletable
        },
        // 文件大小限制，单位为byte
        maxSize: {
            type: [String, Number],
            default: () => defProps.upload.maxSize
        },
        // 显示已上传的文件列表
        fileList: {
            type: Array,
            default: () => defProps.upload.fileList
        },
        // 上传区域的提示文字
        uploadText: {
            type: String,
            default: () => defProps.upload.uploadText
        },
        // 内部预览图片区域和选择图片按钮的区域宽度
        width: {
            type: [String, Number],
            default: () => defProps.upload.width
        },
        // 内部预览图片区域和选择图片按钮的区域高度
        height: {
            type: [String, Number],
            default: () => defProps.upload.height
        },
        // 是否在上传完成后展示预览图
        previewImage: {
            type: Boolean,
            default: () => defProps.upload.previewImage
        },
		// 是否自动删除
		autoDelete: {
		    type: Boolean,
		    default: () => defProps.upload.autoDelete
		},
		// 是否自动上传需要传递action指定地址
		autoUpload: {
		    type: Boolean,
		    default: () => defProps.upload.autoUpload
		},
		// 自动上传接口地址
		autoUploadApi: {
		    type: String,
		    default: () => defProps.upload.autoUploadApi
		},
		// 自动上传驱动，local/oss/cos/kodo
		autoUploadDriver: {
		    type: String,
		    default: () => defProps.upload.autoUploadDriver
		},
		// 自动上传授权接口，比如oss的签名接口。
		autoUploadAuthUrl: {
		    type: String,
		    default: () => defProps.upload.autoUploadAuthUrl
		},
		// 自动上传携带的header
		autoUploadHeader: {
		    type: Object,
		    default: () => {
				return defProps.upload.autoUploadHeader
			}
		},
		// 本地计算视频封面
		getVideoThumb: {
		    type: Boolean,
		    default: () => defProps.upload.getVideoThumb
		},
        // 自定义自动上传后处理
        customAfterAutoUpload: {
		    type: Boolean,
		    default: () => defProps.upload.customAfterAutoUpload
		},
        videoPreviewObjectFit: {
		    type: String,
		    default: () => defProps.upload.videoPreviewObjectFit
		},
    }
})
