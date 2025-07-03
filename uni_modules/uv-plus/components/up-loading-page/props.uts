import { defineMixin } from '../../libs/vue'
import defProps from './loadingPage'
let crtProp = defProps['loadingPage'] as UTSJSONObject

export const propsLoadingPage = defineMixin({
    props: {
        // 提示内容
        loadingText: {
            type: [String, Number],
            default: crtProp['loadingText']
        },
        // 文字上方用于替换loading动画的图片
        image: {
            type: String,
            default: crtProp['image']
        },
        // 加载动画的模式，circle-圆形，spinner-花朵形，semicircle-半圆形
        loadingMode: {
            type: String,
            default: crtProp['loadingMode']
        },
        // 是否加载中
        loading: {
            type: Boolean,
            default: crtProp['loading']
        },
        // 背景色
        bgColor: {
            type: String,
            default: crtProp['bgColor']
        },
        // 文字颜色
        color: {
            type: String,
            default: crtProp['color']
        },
        // 文字大小
        fontSize: {
            type: [String, Number],
            default: crtProp['fontSize']
        },
		// 图标大小
		iconSize: {
		    type: [String, Number],
		    default: crtProp['fontSize']
		},
        // 加载中图标的颜色，只能rgb或者十六进制颜色值
        loadingColor: {
            type: String,
            default: crtProp['loadingColor']
        },
        // 层级
        zIndex: {
            type: [Number],
            default: crtProp['zIndex']
        },
    }
})
