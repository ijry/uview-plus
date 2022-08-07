import defprops from '../../libs/config/props';
export default {
    props: {
        // 头像图片组
        urls: {
            type: Array,
            default: defprops.avatarGroup.urls
        },
        // 最多展示的头像数量
        maxCount: {
            type: [String, Number],
            default: defprops.avatarGroup.maxCount
        },
        // 头像形状
        shape: {
            type: String,
            default: defprops.avatarGroup.shape
        },
        // 图片裁剪模式
        mode: {
            type: String,
            default: defprops.avatarGroup.mode
        },
        // 超出maxCount时是否显示查看更多的提示
        showMore: {
            type: Boolean,
            default: defprops.avatarGroup.showMore
        },
        // 头像大小
        size: {
            type: [String, Number],
            default: defprops.avatarGroup.size
        },
        // 指定从数组的对象元素中读取哪个属性作为图片地址
        keyName: {
            type: String,
            default: defprops.avatarGroup.keyName
        },
		// 头像之间的遮挡比例
        gap: {
            type: [String, Number],
            validator(value) {
                return value >= 0 && value <= 1
            },
            default: defprops.avatarGroup.gap
        },
		// 需额外显示的值
		extraValue: {
			type: [Number, String],
			default: defprops.avatarGroup.extraValue
		}
    }
}
