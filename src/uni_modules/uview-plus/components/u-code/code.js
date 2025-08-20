/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 16:55:27
 * @FilePath     : /uview-plus/libs/config/props/code.js
 */
import { t } from '../../libs/i18n'
export default {
    // code 组件
    code: {
        seconds: 60,
        startText: t("up.code.send"),
        changeText: t("up.code.resendAfter"),
        endText: t("up.code.resend"),
        keepRunning: false,
        uniqueKey: ''
    }
}
