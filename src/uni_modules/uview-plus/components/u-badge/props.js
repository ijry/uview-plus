import defProps from '../../libs/config/props';
const defprops = uni?.$u?.props || defProps;
export default {
    props: {
        // 是否显示圆点
        isDot: {
            type: Boolean,
            default: defprops.badge.isDot
        },
        // 显示的内容
        value: {
            type: [Number, String],
            default: defprops.badge.value
        },
        // 显示的内容
        modelValue: {
            type: [Number, String],
            default: defprops.badge.modelValue
        },
        // 是否显示
        show: {
            type: Boolean,
            default: defprops.badge.show
        },
        // 最大值，超过最大值会显示 '{max}+'
        max: {
            type: [Number, String],
            default: defprops.badge.max
        },
        // 主题类型，error|warning|success|primary
        type: {
            type: String,
            default: defprops.badge.type
        },
        // 当数值为 0 时，是否展示 Badge
        showZero: {
            type: Boolean,
            default: defprops.badge.showZero
        },
        // 背景颜色，优先级比type高，如设置，type参数会失效
        bgColor: {
            type: [String, null],
            default: defprops.badge.bgColor
        },
        // 字体颜色
        color: {
            type: [String, null],
            default: defprops.badge.color
        },
        // 徽标形状，circle-四角均为圆角，horn-左下角为直角
        shape: {
            type: String,
            default: defprops.badge.shape
        },
        // 设置数字的显示方式，overflow|ellipsis|limit
        // overflow会根据max字段判断，超出显示`${max}+`
        // ellipsis会根据max判断，超出显示`${max}...`
        // limit会依据1000作为判断条件，超出1000，显示`${value/1000}K`，比如2.2k、3.34w，最多保留2位小数
        numberType: {
            type: String,
            default: defprops.badge.numberType
        },
        // 设置badge的位置偏移，格式为 [x, y]，也即设置的为top和right的值，absolute为true时有效
        offset: {
            type: Array,
            default: defprops.badge.offset
        },
        // 是否反转背景和字体颜色
        inverted: {
            type: Boolean,
            default: defprops.badge.inverted
        },
        // 是否绝对定位
        absolute: {
            type: Boolean,
            default: defprops.badge.absolute
        }
    }
}
