import {AllowedComponentProps, VNodeProps} from './_common'

declare interface QrcodeProps {
    /**
     * 实例ID字符串(必须)
     */
    cid: string

    /**
     * 二维码大小
     * @default 200
     */
    size?: number

    /**
     * 二维码内容
     */
    val: string

    /**
     * 背景色
     * @default "#ffffff"
     */
    background?: string

    /**
     * 前景色
     * @default "#000000"
     */
    foreground?: string

    /**
     * 二维码中间图标
     * @default "#000000"
     */
    icon?: string

    /**
     * 显示加载状态
     * @default true
     */
    showLoading?: boolean

    /**
     * 加载中提示语
     * @default "二维码生成中"
     */
    loadingText?: string

    /**
     * 使用根节点的宽高 设置为true会导致size失效
     * @default false
     */
    useRootHeightAndWidth: boolean

    /**
     * 二维码生成成功回调事件
     */
    result?: () => any

    /**
     * 长按触发事件
     * @param url 二维码本地生成url
     */
    longpressCallback?: (url: string) => any

}

declare interface _Qrcode {
    new(): {
        $props: AllowedComponentProps &
            VNodeProps &
            QrcodeProps
    }
}

export declare const Qrcode: _Qrcode
