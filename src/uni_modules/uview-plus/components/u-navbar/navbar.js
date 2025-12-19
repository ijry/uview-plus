/*
 * @Author       : LQ
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2025-12-19 08:55:21
 * @FilePath     : /uview-plus/libs/config/props/navbar.js
 */
import color from '../../libs/config/color'
export default {
    // navbar 组件
    navbar: {
        safeAreaInsetTop: true,
        placeholder: false,
        fixed: true,
        border: false,
        leftIcon: 'arrow-left',
        leftText: '',
        rightText: '',
        rightIcon: '',
        title: '',
        titleColor: '',
        bgColor: '#ffffff',
        titleWidth: '400rpx',
        height: '44px',
		leftIconSize: 20,
		leftIconColor: color.mainColor,
		autoBack: false,
		titleStyle: ''
    }

}
