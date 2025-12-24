/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/link.js
 */
import config from '../../libs/config/config'
import { t } from '../../libs/i18n'

const {
    color
} = config
export default {
    // link超链接组件props参数
    link: {
        color: color['u-primary'],
        fontSize: 15,
        underLine: false,
        href: '',
        mpTips: t("up.link.copyed"),
        lineColor: '',
        text: ''
    }
}
