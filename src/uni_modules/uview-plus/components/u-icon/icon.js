/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/icon.js
 */
import config from '../../libs/config/config'

const {
    color
} = config
export default {
    // icon组件
    icon: {
        name: '',
        color: color['u-content-color'],
        size: '16px',
        bold: false,
        index: '',
        hoverClass: '',
        customPrefix: 'uicon',
        label: '',
        labelPos: 'right',
        labelSize: '15px',
        labelColor: color['u-content-color'],
        space: '3px',
        imgMode: '',
        width: '',
        height: '',
        top: 0,
        stop: false
    }
}
