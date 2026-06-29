import { defineMixin } from '../../libs/vue'
import GuideDefaultProps from './guide'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(GuideDefaultProps)
export const props = defineMixin({
    props: {
        show: {
            type: Boolean,
            default: () => defProps.guide.show
        },
        list: {
            type: Array,
            default: () => defProps.guide.list
        },
        storageKey: {
            type: String,
            default: () => defProps.guide.storageKey
        },
        once: {
            type: Boolean,
            default: () => defProps.guide.once
        },
        showSkip: {
            type: Boolean,
            default: () => defProps.guide.showSkip
        },
        skipText: {
            type: String,
            default: () => defProps.guide.skipText
        },
        nextText: {
            type: String,
            default: () => defProps.guide.nextText
        },
        finishText: {
            type: String,
            default: () => defProps.guide.finishText
        },
        indicator: {
            type: Boolean,
            default: () => defProps.guide.indicator
        },
        bgColor: {
            type: String,
            default: () => defProps.guide.bgColor
        },
        zIndex: {
            type: [String, Number],
            default: () => defProps.guide.zIndex
        }
    }
})
