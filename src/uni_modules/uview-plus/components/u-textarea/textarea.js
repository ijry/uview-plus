/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/textarea.js
 */
export default {
	// textarea 组件
	textarea: {
		value: '',
		placeholder: '',
		placeholderClass: 'textarea-placeholder',
		placeholderStyle: '',
		height: 70,
		// 与 uni-app textarea 原生默认值保持一致：return 表示回车换行；
		// 取 done/go/next/search/send 时回车会触发 confirm 且不换行
		confirmType: 'return',
		confirmHold: false,
		disabled: false,
		count: false,
		focus: false,
		autoHeight: false,
		fixed: false,
		cursorSpacing: 0,
		cursor: '',
		showConfirmBar: true,
		selectionStart: -1,
		selectionEnd: -1,
		adjustPosition: true,
		disableDefaultPadding: false,
		holdKeyboard: false,
		maxlength: 140,
		border: 'surround',
		formatter: null
	}
}
