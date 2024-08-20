/*
 * @Author       : LQ,jry
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-20 14:20:58
 * @FilePath     : /uview-plus/libs/config/props/picker.js
 */
export default {
    // picker
    picker: {
        show: false,
		popupMode: 'bottom',
        showToolbar: true,
        title: '',
        columns: [],
        loading: false,
        itemHeight: 44,
        cancelText: '取消',
        confirmText: '确定',
        cancelColor: '#909193',
        confirmColor: '#3c9cff',
        visibleItemCount: 5,
        keyName: 'text',
        closeOnClickOverlay: false,
        defaultIndex: [],
		immediateChange: true
    }
}
