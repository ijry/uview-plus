/*
 * @Author       : LQ,jry
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-20 14:20:58
 * @FilePath     : /uview-plus/libs/config/props/link.js
 */
import config from '../../libs/config/config.js'

const {
    color
} = config
export default {
    // link超链接组件props参数
    link: {
        color: color['up-primary'],
        fontSize: 15,
        underLine: false,
        href: '',
        mpTips: '链接已复制，请在浏览器打开',
        lineColor: '',
        text: ''
    }
}
