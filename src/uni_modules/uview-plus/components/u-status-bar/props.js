import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        bgColor: {
            type: String,
            default: () => defProps.statusBar.bgColor
        },
		// 状态栏获取得高度
		height: {
			type: Number,
			default: () => defProps.statusBar.height
		}
    }
})
