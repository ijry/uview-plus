import test from '../../libs/function/test'
function pickExclude(obj, keys) {
	// 某些情况下，type可能会为
    if (!['[object Object]', '[object File]'].includes(Object.prototype.toString.call(obj))) {
        return {}
    }
    return Object.keys(obj).reduce((prev, key) => {
        if (!keys.includes(key)) {
            prev[key] = obj[key]
        }
        return prev
    }, {})
}

function formatImage(res) {
    return res.tempFiles.map((item) => ({
        ...pickExclude(item, ['path']),
        type: 'image',
        url: item.path,
        thumb: item.path,
		size: item.size,
		// #ifdef H5
		name: item.name,
		file: item
		// #endif
		// #ifndef H5
		name: item.path.split('/').pop() + '.png',
		// #endif
    }))
}

function formatVideo(res) {
	// console.log(res)
    return [
        {
            ...pickExclude(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg']),
            type: 'video',
            url: res.tempFilePath,
            thumb: res.thumbTempFilePath,
			size: res.size,
			width: res.width || 0, // APP 2.1.0+、H5、微信小程序、京东小程序
			height: res.height || 0, // APP 2.1.0+、H5、微信小程序、京东小程序
			// #ifdef H5
			name: res.name,
			file: res
			// #endif
			// #ifndef H5
			name: res.tempFilePath.split('/').pop() + '.mp4',
			// #endif
        }
    ]
}

function formatMedia(res) {
    return res.tempFiles.map((item) => ({
        ...pickExclude(item, ['fileType', 'thumbTempFilePath', 'tempFilePath']),
        type: res.type,
        url: item.tempFilePath,
        thumb: res.type === 'video' ? item.thumbTempFilePath : item.tempFilePath,
		size: item.size,
		// #ifdef H5
		file: item
		// #endif
		// #ifndef H5
		name: item.tempFilePath.split('/').pop() + (res.type === 'video' ? '.mp4': '.png'),
		// #endif
    }))
}

function formatFile(res) {
    return res.tempFiles.map((item) => ({ 
		...pickExclude(item, ['path']), 
		url: item.path, 
		size:item.size,
		// #ifdef H5
		name: item.name,
		type: item.type,
		file: item
		// #endif 
	}))
}
export function chooseFile({
    accept,
    multiple,
    capture,
    compressed,
    maxDuration,
    sizeType,
    camera,
    maxCount,
    extension
}) {
    try {
        capture = test.array(capture) ? capture : capture.split(',');
    } catch(e) {
        capture = [];
    }
    return new Promise((resolve, reject) => {
        switch (accept) {
        case 'image':
            uni.chooseImage({
                count: multiple ? Math.min(maxCount, 9) : 1,
                sourceType: capture,
                sizeType,
                success: (res) => resolve(formatImage(res)),
                fail: reject
            })
            break
            // #ifdef MP-WEIXIN
            // 只有微信小程序才支持chooseMedia接口
        case 'media':
            wx.chooseMedia({
                count: multiple ? Math.min(maxCount, 9) : 1,
                sourceType: capture,
                maxDuration,
                sizeType,
                camera,
                success: (res) => resolve(formatMedia(res)),
                fail: reject
            })
            break
            // #endif
        case 'video':
            uni.chooseVideo({
                sourceType: capture,
                compressed,
                maxDuration,
                camera,
                success: (res) => resolve(formatVideo(res)),
                fail: reject
            })
            break
        // #ifdef MP-WEIXIN || H5
        // 只有微信小程序才支持chooseMessageFile接口
        case 'file':
            let params = {
                count: multiple ? maxCount : 1,
                type: accept,
                success: (res) => resolve(formatFile(res)),
                fail: reject
            }
            // Array<string>根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。
            if (extension.length && extension.length > 0) {
                params.extension = extension
            }
            // #ifdef MP-WEIXIN
            wx.chooseMessageFile(params)
            // #endif
            // #ifdef H5
            // 需要hx2.9.9以上才支持uni.chooseFile
            uni.chooseFile(params)
            // #endif
            break
		// #endif
		default: 
			// 此为保底选项，在accept不为上面任意一项的时候选取全部文件
			// #ifdef MP-WEIXIN
			wx.chooseMessageFile({
			    count: multiple ? maxCount : 1,
			    type: 'all',
			    success: (res) => resolve(formatFile(res)),
			    fail: reject
			})
			// #endif
			// #ifdef H5
			// 需要hx2.9.9以上才支持uni.chooseFile
            let paramsFile = {
                count: multiple ? maxCount : 1,
				type: 'all',
				success: (res) => resolve(formatFile(res)),
				fail: reject
            }
            if (extension.length && extension.length > 0) {
                paramsFile.extension = extension
            }
			uni.chooseFile(paramsFile)
			// #endif
        }
    })
}
