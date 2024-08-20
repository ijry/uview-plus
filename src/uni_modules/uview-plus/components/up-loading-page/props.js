import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const props = defineMixin({
    props: {
        // 提示内容
        loadingText: {
            type: [String, Number],
            default: () => defProps.loadingPage.loadingText
        },
        // 文字上方用于替换loading动画的图片
        image: {
            type: String,
            default: () => defProps.loadingPage.image
        },
        // 加载动画的模式，circle-圆形，spinner-花朵形，semicircle-半圆形
        loadingMode: {
            type: String,
            default: () => defProps.loadingPage.loadingMode
        },
        // 是否加载中
        loading: {
            type: Boolean,
            default: () => defProps.loadingPage.loading
        },
        // 背景色
        bgColor: {
            type: String,
            default: () => defProps.loadingPage.bgColor
        },
        // 文字颜色
        color: {
            type: String,
            default: () => defProps.loadingPage.color
        },
        // 文字大小
        fontSize: {
            type: [String, Number],
            default: () => defProps.loadingPage.fontSize
        },
		// 图标大小
		iconSize: {
		    type: [String, Number],
		    default: () => defProps.loadingPage.fontSize
		},
        // 加载中图标的颜色，只能rgb或者十六进制颜色值
        loadingColor: {
            type: String,
            default: () => defProps.loadingPage.loadingColor
        },
        // 层级
        zIndex: {
            type: [Number],
            default: () => defProps.loadingPage.zIndex
        },
    }
})
