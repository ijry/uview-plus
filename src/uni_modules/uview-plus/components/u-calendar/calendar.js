/*
 * @Author       : LQ
 * @Description  :
 * @version      : 1.0
 * @Date         : 2021-08-20 16:44:21
 * @LastAuthor   : LQ
 * @lastTime     : 2021-08-20 16:52:43
 * @FilePath     : /u-view2.0/uview-ui/libs/config/props/calendar.js
 */
import { t } from '../../libs/i18n'
export default {
    // calendar 组件
    calendar: {
        title: t("up.calendar.chooseDates"),
        showTitle: true,
        showSubtitle: true,
        mode: 'single',
        startText: t("up.common.start"),
        endText: t("up.common.end"),
        customList: [],
        color: '#3c9cff',
        minDate: 0,
        maxDate: 0,
        defaultDate: null,
        maxCount: Number.MAX_SAFE_INTEGER, // Infinity
        rowHeight: 56,
        formatter: null,
        showLunar: false,
        showMark: true,
        confirmText: t("up.common.confirm"),
        confirmDisabledText: t("up.common.confirm"),
        show: false,
        closeOnClickOverlay: false,
        readonly: false,
        showConfirm: true,
        maxRange: Number.MAX_SAFE_INTEGER, // Infinity
        rangePrompt: '',
        showRangePrompt: true,
        allowSameDay: false,
		round: 0,
		monthNum: 3,
        weekText: [t("up.week.one"), t("up.week.two"), t("up.week.three"), t("up.week.four"), t("up.week.five"), t("up.week.six"), t("up.week.seven")],
        forbidDays: [],
        forbidDaysToast: t("up.calendar.disabled"),
        monthFormat: '',
        pageInline: false
    }
}
