/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 17:15:26
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/loadmore.js
 */
import { t } from '../../libs/i18n'
export default {
    // loadmore 组件
    loadmore: {
        status: 'loadmore',
        bgColor: 'transparent',
        icon: true,
        fontSize: 14,
		iconSize: 17,
        color: '#606266',
        loadingIcon: 'spinner',
        loadmoreText: t("up.loadmoe.loadmore"),
        loadingText: t("up.common.loading2") + '...',
        nomoreText: t("up.loadmoe.nomore"),
        isDot: false,
        iconColor: '#b7b7b7',
        marginTop: 10,
        marginBottom: 10,
        height: 'auto',
        line: false,
		lineColor: '#E6E8EB',
		dashed: false,
    }
}
