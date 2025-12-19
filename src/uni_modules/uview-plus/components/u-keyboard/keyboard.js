/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/keyboard.js
 */
import { t } from '../../libs/i18n'
export default {
    // 键盘组件
    keyboard: {
        mode: 'number',
        dotDisabled: false,
        tooltip: true,
        showTips: true,
        tips: '',
        showCancel: true,
        showConfirm: true,
        random: false,
        safeAreaInsetBottom: true,
        closeOnClickOverlay: true,
        show: false,
        overlay: true,
        zIndex: 10075,
        cancelText: t("up.common.cancel"),
        confirmText: t("up.common.confirm"),
        autoChange: false
    }
}
