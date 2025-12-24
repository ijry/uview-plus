/**
 * 验证电子邮箱格式
 */
export function email(value) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)
}

/**
 * 验证手机格式
 */
export function mobile(value) {
    return /^1[23456789]\d{9}$/.test(value)
}

/**
 * 验证URL格式
 */
export function url(value) {
    return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/
        .test(value)
}

/**
 * 验证日期格式
 * @param {number | string} value yyyy-mm-dd hh:mm:ss 或 时间戳
 */
export function date(value) {
    if (!value) return false;
    // number类型，判断是否是时间戳
    if (typeof value === "number") {
        // len === 10 秒级时间戳 len === 13 毫秒级时间戳
        if (value.toString().length !== 10 && value.toString().length !== 13) {
            return false;
        }
        return !isNaN(new Date(value).getTime());
    }
    if (typeof value === "string") {
        // 是否为string类型时间戳
        const numV = Number(value);
        if (!isNaN(numV)) {
            if (
                numV.toString().length === 10 ||
                numV.toString().length === 13
            ) {
                return !isNaN(new Date(numV).getTime());
            }
        }
        // 非时间戳，且长度在yyyy-mm-dd 至 yyyy-mm-dd hh:mm:ss 之间
        if (value.length < 10 || value.length > 19) {
            return false;
        }
        const dateRegex =
            /^\d{4}[-\/]\d{2}[-\/]\d{2}( \d{1,2}:\d{2}(:\d{2})?)?$/;
        if (!dateRegex.test(value)) {
            return false;
        }
        // 检查是否为有效日期
        const dateValue = new Date(value);
        return !isNaN(dateValue.getTime());
    }
    // 非number和string类型，不做校验
    return false;
}

/**
 * 验证ISO类型的日期格式
 */
export function dateISO(value) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
export function number(value) {
    return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}

/**
 * 验证字符串
 */
export function string(value) {
    return typeof value === 'string'
}

/**
 * 验证整数
 */
export function digits(value) {
    return /^\d+$/.test(value)
}

/**
 * 验证身份证号码
 */
export function idCard(value) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
        value
    )
}

/**
 * 是否车牌号
 */
export function carNo(value) {
    // 新能源车牌
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
    // 旧车牌
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
    if (value.length === 7) {
        return creg.test(value)
    } if (value.length === 8) {
        return xreg.test(value)
    }
    return false
}

/**
 * 金额,只允许2位小数
 */
export function amount(value) {
    // 金额，只允许保留两位小数
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value)
}

/**
 * 中文
 */
export function chinese(value) {
    const reg = /^[\u4e00-\u9fa5]+$/gi
    return reg.test(value)
}

/**
 * 只能输入字母
 */
export function letter(value) {
    return /^[a-zA-Z]*$/.test(value)
}

/**
 * 只能是字母或者数字
 */
export function enOrNum(value) {
    // 英文或者数字
    const reg = /^[0-9a-zA-Z]*$/g
    return reg.test(value)
}

/**
 * 验证是否包含某个值
 */
export function contains(value, param) {
    return value.indexOf(param) >= 0
}

/**
 * 验证一个值范围[min, max]
 */
export function range(value, param) {
    return value >= param[0] && value <= param[1]
}

/**
 * 验证一个长度范围[min, max]
 */
export function rangeLength(value, param) {
    return value.length >= param[0] && value.length <= param[1]
}

/**
 * 是否固定电话
 */
export function landline(value) {
    const reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/
    return reg.test(value)
}

/**
 * 判断是否为空
 */
export function empty(value) {
    switch (typeof value) {
    case 'undefined':
        return true
    case 'string':
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
        break
    case 'boolean':
        if (!value) return true
        break
    case 'number':
        if (value === 0 || isNaN(value)) return true
        break
    case 'object':
        if (value === null || value.length === 0) return true
        for (const i in value) {
            return false
        }
        return true
    }
    return false
}

/**
 * 是否json字符串
 */
export function jsonString(value) {
    if (typeof value === 'string') {
        try {
            const obj = JSON.parse(value)
            if (typeof obj === 'object' && obj) {
                return true
            }
            return false
        } catch (e) {
            return false
        }
    }
    return false
}

/**
 * 是否数组
 */
export function array(value) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
    }
    return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 是否对象
 */
export function object(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 是否是Promise对象
 */
export function objectPromise(value) {
    return Object.prototype.toString.call(value) === '[object Promise]';
}

/**
 * 是否短信验证码
 */
export function code(value, len = 6) {
    return new RegExp(`^\\d{${len}}$`).test(value)
}

/**
 * 是否函数方法
 * @param {Object} value
 */
export function func(value) {
    return typeof value === 'function'
}

/**
 * 是否promise对象
 * @param {Object} value
 */
export function promise(value) {
    return objectPromise(value) && func(value.then) && func(value.catch)
}

/** 是否图片格式
 * @param {Object} value
 */
export function image(value) {
    const newValue = value.split('?')[0]
    const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i
    return IMAGE_REGEXP.test(newValue)
}

/**
 * 是否视频格式
 * @param {Object} value
 */
export function video(value) {
    const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)/i
    return VIDEO_REGEXP.test(value)
}

/**
 * 是否为正则对象
 * @param {Object}
 * @return {Boolean}
 */
export function regExp(o) {
    return o && Object.prototype.toString.call(o) === '[object RegExp]'
}

export default {
    email,
    mobile,
    url,
    date,
    dateISO,
    number,
    digits,
    idCard,
    carNo,
    amount,
    chinese,
    letter,
    enOrNum,
    contains,
    range,
    rangeLength,
    empty,
    isEmpty: empty,
    jsonString,
    landline,
    object,
    array,
    code,
    func,
    promise,
    video,
    image,
    regExp,
    string
}
