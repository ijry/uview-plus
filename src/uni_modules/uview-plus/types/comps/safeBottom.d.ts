import { AllowedComponentProps, VNodeProps } from './_common'

declare interface SafeBottomProps {
	/**
	 * 定义需要用到的外部样式
	 */
	customStyle?: unknown
}

declare interface _SafeBottom {
	new (): {
		$props: AllowedComponentProps & VNodeProps & SafeBottomProps
	}
}

export declare const SafeBottom: _SafeBottom
