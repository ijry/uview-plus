import defProps from '../../libs/config/props.js';
export default {
    props: {
        // 控制是否出现滚动条，仅nvue有效
        showScrollbar: {
            type: Boolean,
            default: () => defProps.list.showScrollbar
        },
        // 距底部多少时触发scrolltolower事件
        lowerThreshold: {
            type: [String, Number],
            default: () => defProps.list.lowerThreshold
        },
        // 距顶部多少时触发scrolltoupper事件，非nvue有效
        upperThreshold: {
            type: [String, Number],
            default: () => defProps.list.upperThreshold
        },
        // 设置竖向滚动条位置
        scrollTop: {
            type: [String, Number],
            default: () => defProps.list.scrollTop
        },
        // 控制 onscroll 事件触发的频率，仅nvue有效
        offsetAccuracy: {
            type: [String, Number],
            default: () => defProps.list.offsetAccuracy
        },
        // 启用 flexbox 布局。开启后，当前节点声明了display: flex就会成为flex container，并作用于其孩子节点，仅微信小程序有效
        enableFlex: {
            type: Boolean,
            default: () => defProps.list.enableFlex
        },
        // 是否按分页模式显示List，默认值false
        pagingEnabled: {
            type: Boolean,
            default: () => defProps.list.pagingEnabled
        },
        // 是否允许List滚动
        scrollable: {
            type: Boolean,
            default: () => defProps.list.scrollable
        },
        // 值应为某子元素id（id不能以数字开头）
        scrollIntoView: {
            type: String,
            default: () => defProps.list.scrollIntoView
        },
        // 在设置滚动条位置时使用动画过渡
        scrollWithAnimation: {
            type: Boolean,
            default: () => defProps.list.scrollWithAnimation
        },
        // iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只对微信小程序有效
        enableBackToTop: {
            type: Boolean,
            default: () => defProps.list.enableBackToTop
        },
        // 列表的高度
        height: {
            type: [String, Number],
            default: () => defProps.list.height
        },
        // 列表宽度
        width: {
            type: [String, Number],
            default: () => defProps.list.width
        },
        // 列表前后预渲染的屏数，1代表一个屏幕的高度，1.5代表1个半屏幕高度
        preLoadScreen: {
            type: [String, Number],
            default: () => defProps.list.preLoadScreen
        }
        // vue下，是否开启虚拟列表

    }
}
