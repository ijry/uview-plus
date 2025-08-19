/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 17:19:45
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/search.js
 */
import { t } from '../../libs/i18n'
export default {
    // search
    search: {
        shape: 'round',
        bgColor: '#f2f2f2',
        placeholder: t("up.search.placeholder"),
        clearabled: true,
        focus: false,
        showAction: true,
        actionStyle: {},
        actionText: t("up.common.search"),
        inputAlign: 'left',
        inputStyle: {},
        disabled: false,
        borderColor: 'transparent',
        searchIconColor: '#909399',
        searchIconSize: 22,
        color: '#606266',
        placeholderColor: '#909399',
        searchIcon: 'search',
        iconPosition: 'left',
        margin: '0',
        animation: false,
        value: '',
        maxlength: '-1',
        height: 32,
        label: null
    }
}
