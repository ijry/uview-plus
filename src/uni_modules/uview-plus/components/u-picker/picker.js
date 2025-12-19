/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/picker.js
 */
import { t } from '../../libs/i18n'
export default {
    // picker
    picker: {
        show: false,
		popupMode: 'bottom',
        showToolbar: true,
        title: '',
        columns: [],
        loading: false,
        itemHeight: 44,
        cancelText: t("up.common.cancel"),
        confirmText: t("up.common.confirm"),
        cancelColor: '#909193',
        confirmColor: '',
        visibleItemCount: 5,
        keyName: 'text',
		valueName: 'value',
        closeOnClickOverlay: false,
        defaultIndex: [],
		immediateChange: true,
		zIndex: 10076,
        disabled: false,
        disabledColor: '',
        placeholder: t("up.common.pleaseChoose"),
        inputProps: {},
        bgColor: '',
        round: 0,
        duration: 300,
        overlayOpacity: 0.5,
        pageInline: false
    }
}
