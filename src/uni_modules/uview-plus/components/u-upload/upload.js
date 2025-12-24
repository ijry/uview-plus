/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/upload.js
 */
export default {
	// upload组件
	upload: {
		accept: 'image',
		extension: [],
		capture: ['album', 'camera'],
		compressed: true,
		camera: 'back',
		maxDuration: 60,
		uploadIcon: 'camera-fill',
		uploadIconColor: '#D3D4D6',
		useBeforeRead: false,
		previewFullImage: true,
		maxCount: 52,
		disabled: false,
		imageMode: 'aspectFill',
		name: '',
		sizeType: ['original', 'compressed'],
		multiple: false,
		deletable: true,
		maxSize: Number.MAX_VALUE,
		fileList: [],
		uploadText: '',
		width: 80,
		height: 80,
		previewImage: true,
		autoDelete: false,
		autoUpload: false,
		autoUploadApi: '',
		autoUploadAuthUrl: '',
		autoUploadDriver: '',
		autoUploadHeader: {},
		getVideoThumb: false,
		customAfterAutoUpload: false,
		videoPreviewObjectFit: 'cover'
	}
}
