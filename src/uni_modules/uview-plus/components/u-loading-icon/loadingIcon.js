/*
 * @Author       : LQ,jry
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-20 14:20:58
 * @FilePath     : /uview-plus/libs/config/props/loadingIcon.js
 */
import config from '../../libs/config/config'

const {
    color
} = config
export default {
    // loading-icon加载中图标组件
    loadingIcon: {
        show: true,
        color: color['up-tips-color'],
        textColor: color['up-tips-color'],
        vertical: false,
        mode: 'spinner',
        size: 24,
        textSize: 15,
        text: '',
        timingFunction: 'ease-in-out',
        duration: 1200,
        inactiveColor: ''
    }
}
