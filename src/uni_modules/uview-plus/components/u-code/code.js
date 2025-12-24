/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
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
