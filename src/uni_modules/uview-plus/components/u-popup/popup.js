/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 17:06:33
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/popup.js
 */
export default {
    // popup组件
    popup: {
        show: false,
        overlay: true,
        mode: 'bottom',
        duration: 300,
        closeable: false,
        overlayStyle: {},
        closeOnClickOverlay: true,
        zIndex: 10075,
        safeAreaInsetBottom: true,
        safeAreaInsetTop: false,
        closeIconPos: 'top-right',
        round: '20px',
        zoom: true,
        bgColor: '',
        overlayOpacity: 0.5,
        pageInline: false,
        touchable: false,
        minHeight: '200px',
        maxHeight: '600px'
    }
}
