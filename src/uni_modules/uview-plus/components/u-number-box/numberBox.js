/*
 * @Author       : LQ,jry
 * @Description  :
 * @version      : 3.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : jry
 * @lastTime     : 2024-08-20 14:20:58
 * @FilePath     : /uview-plus/libs/config/props/numberBox.js
 */
export default {
    // 步进器组件
    numberBox: {
        name: '',
        value: 0,
        min: 1,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        integer: false,
        disabled: false,
        disabledInput: false,
        asyncChange: false,
        inputWidth: 35,
        showMinus: true,
        showPlus: true,
        decimalLength: null,
        longPress: true,
        color: '#323233',
        buttonSize: 30,
        bgColor: '#EBECEE',
        cursorSpacing: 100,
        disableMinus: false,
        disablePlus: false,
        iconStyle: ''
    }
}
