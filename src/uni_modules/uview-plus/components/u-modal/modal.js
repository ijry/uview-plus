/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 17:15:59
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/modal.js
 */
import { t } from '../../libs/i18n'
export default {
    // modal 组件
    modal: {
        show: false,
        title: '',
        content: '',
        confirmText: t("up.common.confirm"),
        cancelText: t("up.common.cancel"),
        showConfirmButton: true,
        showCancelButton: false,
        confirmColor: '#2979ff',
        cancelColor: '#606266',
        buttonReverse: false,
        zoom: true,
        asyncClose: false,
        closeOnClickOverlay: false,
        negativeTop: 0,
        width: '650rpx',
        confirmButtonShape: '',
        duration: 400,
        contentTextAlign: 'left',
        asyncCloseTip: t("up.common.inOperatio") + '...',
        asyncCancelClose: false,
        contentStyle: {}
    }
}
