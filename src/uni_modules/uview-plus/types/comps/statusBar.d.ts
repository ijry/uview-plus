import { AllowedComponentProps, VNodeProps } from './_common'

declare interface StatusBarProps {

    /**
     * 背景色
     */
    bgColor?: string

	/**
	 * 定义需要用到的外部样式
	 */
	customStyle?: unknown
}

declare interface _StatusBar {
	new (): {
		$props: AllowedComponentProps & VNodeProps & StatusBarProps
	}
}

export declare const StatusBar: _StatusBar
