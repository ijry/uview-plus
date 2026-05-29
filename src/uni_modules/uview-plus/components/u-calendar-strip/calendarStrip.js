/*
 * @Author       : uview-plus
 * @Description  : calendarStrip default props
 * @version      : 3.0
 * @Date         : 2026-05-29 14:40:00
 */
import { t } from '../../libs/i18n'

export default {
    calendarStrip: {
        modelValue: null,
        minDate: 0,
        maxDate: 0,
        color: '#3c9cff',
        weekText: [
            t('up.week.one'),
            t('up.week.two'),
            t('up.week.three'),
            t('up.week.four'),
            t('up.week.five'),
            t('up.week.six'),
            t('up.week.seven')
        ],
        fullCalendar: true,
        fullCalendarProps: {},
        fullMonthNum: 24,
        pullDownThreshold: 40,
        collapseAfterSelect: true,
        readonly: false,
        showToday: true,
        monthFormat: '',
        expandHint: '下拉展开月历',
        collapseHint: '上拉收起月历'
    }
}

