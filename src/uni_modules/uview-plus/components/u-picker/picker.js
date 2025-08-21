/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 17:18:20
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/picker.js
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
