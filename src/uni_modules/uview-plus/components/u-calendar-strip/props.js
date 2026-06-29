import { defineMixin } from '../../libs/vue'
import CalendarStripDefaultProps from './calendarStrip'
import { registerComponentProps } from '../../libs/config/props.js'

const defProps = registerComponentProps(CalendarStripDefaultProps)
export const props = defineMixin({
    props: {
        modelValue: {
            type: [String, Number, Date, null],
            default: () => defProps.calendarStrip.modelValue
        },
        minDate: {
            type: [String, Number],
            default: () => defProps.calendarStrip.minDate
        },
        maxDate: {
            type: [String, Number],
            default: () => defProps.calendarStrip.maxDate
        },
        color: {
            type: String,
            default: () => defProps.calendarStrip.color
        },
        weekText: {
            type: Array,
            default: () => defProps.calendarStrip.weekText
        },
        fullCalendar: {
            type: Boolean,
            default: () => defProps.calendarStrip.fullCalendar
        },
        fullCalendarProps: {
            type: Object,
            default: () => defProps.calendarStrip.fullCalendarProps
        },
        fullMonthNum: {
            type: [String, Number],
            default: () => defProps.calendarStrip.fullMonthNum
        },
        pullDownThreshold: {
            type: [String, Number],
            default: () => defProps.calendarStrip.pullDownThreshold
        },
        collapseAfterSelect: {
            type: Boolean,
            default: () => defProps.calendarStrip.collapseAfterSelect
        },
        readonly: {
            type: Boolean,
            default: () => defProps.calendarStrip.readonly
        },
        showToday: {
            type: Boolean,
            default: () => defProps.calendarStrip.showToday
        },
        monthFormat: {
            type: String,
            default: () => defProps.calendarStrip.monthFormat
        },
        expandHint: {
            type: String,
            default: () => defProps.calendarStrip.expandHint
        },
        collapseHint: {
            type: String,
            default: () => defProps.calendarStrip.collapseHint
        }
    }
})

