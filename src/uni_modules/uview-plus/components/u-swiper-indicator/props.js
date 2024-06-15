import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 轮播的长度
        length: {
            type: [String, Number],
            default: () => defProps.swiperIndicator.length
        },
        // 当前处于活动状态的轮播的索引
        current: {
            type: [String, Number],
            default: () => defProps.swiperIndicator.current
        },
        // 指示器非激活颜色
        indicatorActiveColor: {
            type: String,
            default: () => defProps.swiperIndicator.indicatorActiveColor
        },
        // 指示器的激活颜色
        indicatorInactiveColor: {
            type: String,
            default: () => defProps.swiperIndicator.indicatorInactiveColor
        },
		// 指示器模式，line-线型，dot-点型
		indicatorMode: {
		    type: String,
		    default: () => defProps.swiperIndicator.indicatorMode
		}
    }
})
