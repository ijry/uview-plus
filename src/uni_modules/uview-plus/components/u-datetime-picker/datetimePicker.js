/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 16:57:48
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/datetimePicker.js
 */
import { t } from '../../libs/i18n'
export default {
    // datetimePicker 组件
    datetimePicker: {
        show: false,
		popupMode: 'bottom',
        showToolbar: true,
        value: '',
        title: '',
        mode: 'datetime',
        maxDate: new Date(new Date().getFullYear() + 10, 0, 1).getTime(),
        minDate: new Date(new Date().getFullYear() - 10, 0, 1).getTime(),
        minHour: 0,
        maxHour: 23,
        minMinute: 0,
        maxMinute: 59,
        filter: null,
        formatter: null,
        loading: false,
        itemHeight: 44,
        cancelText: t("up.common.cancel"),
        confirmText: t("up.common.confirm"),
        cancelColor: '#909193',
        confirmColor: '#3c9cff',
        visibleItemCount: 5,
        closeOnClickOverlay: false,
        defaultIndex: [],
        inputBorder: 'surround',
        disabled: false,
        disabledColor: '',
        placeholder: t("up.common.pleaseChoose"),
        inputProps: {},
        pageInline: false
    }
}
