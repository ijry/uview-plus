import { defineMixin } from '../../libs/vue'
import defProps from './text'
let crtProp = defProps['text'] as UTSJSONObject

export const propsText = defineMixin({
    props: {
        // 主题颜色
        type: {
            type: String,
            default: crtProp['type']
        },
        // 是否显示
        show: {
            type: Boolean,
            default: crtProp['show']
        },
        // 显示的值
        text: {
            type: [String, Number],
            default: crtProp['text']
        },
        // 前置图标
        prefixIcon: {
            type: String,
            default: crtProp['prefixIcon']
        },
        // 后置图标
        suffixIcon: {
            type: String,
            default: crtProp['suffixIcon']
        },
        // 文本处理的匹配模式
        // text-普通文本，price-价格，phone-手机号，name-姓名，date-日期，link-超链接
        mode: {
            type: String,
            default: crtProp['mode']
        },
        // mode=link下，配置的链接
        href: {
            type: String,
            default: crtProp['href']
        },
        // 格式化规则
        format: {
            type: [String, Function],
            default: crtProp['format']
        },
        // mode=phone时，点击文本是否拨打电话
        call: {
            type: Boolean,
            default: crtProp['call']
        },
        // 小程序的打开方式
        openType: {
            type: String,
            default: crtProp['openType']
        },
        // 是否粗体，默认normal
        bold: {
            type: Boolean,
            default: crtProp['bold']
        },
        // 是否块状
        block: {
            type: Boolean,
            default: crtProp['block']
        },
        // 文本显示的行数，如果设置，超出此行数，将会显示省略号
        lines: {
            type: [String, Number],
            default: crtProp['lines']
        },
        // 文本颜色
        color: {
            type: String,
            default: crtProp['color']
        },
        // 字体大小
        size: {
            type: [String, Number],
            default: crtProp['size']
        },
        // 图标的样式
        iconStyle: {
            type: [Object, String],
            default: crtProp['iconStyle']
        },
        // 文字装饰，下划线，中划线等，可选值 none|underline|line-through
        decoration: {
            tepe: String,
            default: crtProp['decoration']
        },
        // 外边距，对象、字符串，数值形式均可
        margin: {
            type: [Object, String, Number],
            default: crtProp['margin']
        },
        // 文本行高
        lineHeight: {
            type: [String, Number],
            default: crtProp['lineHeight']
        },
        // 文本对齐方式，可选值left|center|right
        align: {
            type: String,
            default: crtProp['align']
        },
        // 文字换行，可选值break-word|normal|anywhere
        wordWrap: {
            type: String,
            default: crtProp['wordWrap']
        },
        // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
        lang: {
            type: String,
            default: crtProp['lang']
        },
        // 会话来源，open-type="contact"时有效。只微信小程序有效
        sessionFrom: {
            type: String,
            default: crtProp['sessionFrom']
        },
        // 会话内消息卡片标题，open-type="contact"时有效
        // 默认当前标题，只微信小程序有效
        sendMessageTitle: {
            type: String,
            default: crtProp['sendMessageTitle']
        },
        // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
        // 默认当前分享路径，只微信小程序有效
        sendMessagePath: {
            type: String,
            default: crtProp['sendMessagePath']
        },
        // 会话内消息卡片图片，open-type="contact"时有效
        // 默认当前页面截图，只微信小程序有效
        sendMessageImg: {
            type: String,
            default: crtProp['sendMessageImg']
        },
        // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
        // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
        showMessageCard: {
            type: Boolean,
            default: crtProp['showMessageCard']
        },
        // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
        // 只微信小程序、QQ小程序有效
        appParameter: {
            type: String,
            default: crtProp['appParameter']
        },
    }
})
