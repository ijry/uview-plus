import { defineMixin } from '../../libs/vue'
import SwipeActionDefaultProps from './swipeAction'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(SwipeActionDefaultProps)
export const props = defineMixin({
    props: {
        // 是否自动关闭其他swipe按钮组
        autoClose: {
            type: Boolean,
            default: () => defProps.swipeAction.autoClose
        },
        // 是否存在打开的按钮组
        opendItem: {
            type: Boolean,
            default: false
        }
    }
})
