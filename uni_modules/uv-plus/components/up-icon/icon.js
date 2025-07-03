/*
 * @Author       : LQ,jry
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-20 14:20:58
 * @FilePath     : /uview-plus/libs/config/props/icon.js
 */
import config from '../../libs/config/config.js'

const {
    color
} = config
export default {
    // icon组件
    icon: {
        name: '',
        color: color['up-content-color'],
        size: '16px',
        bold: false,
        index: '',
        hoverClass: '',
        customPrefix: 'upicon',
        label: '',
        labelPos: 'right',
        labelSize: '15px',
        labelColor: color['up-content-color'],
        space: '3px',
        imgMode: '',
        width: '',
        height: '',
        top: '0',
        stop: false
    }
}
