import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const propsCard = defineMixin({
    props: {
        // 与屏幕两侧是否留空隙
		full: {
			type: Boolean,
			default: () => defProps.card.full
		},
		// 标题
		title: {
			type: String,
			default: () => defProps.card.title
		},
		// 标题颜色
		titleColor: {
			type: String,
			default: () => defProps.card.titleColor
		},
		// 标题字体大小
		titleSize: {
			type: [Number, String],
			default: () => defProps.card.titleSize
		},
		// 副标题
		subTitle: {
			type: String,
			default: () => defProps.card.subTitle
		},
		// 副标题颜色
		subTitleColor: {
			type: String,
			default: () => defProps.card.subTitleColor
		},
		// 副标题字体大小
		subTitleSize: {
			type: [Number, String],
			default: () => defProps.card.subTitleSize
		},
		// 是否显示外部边框，只对full=false时有效(卡片与边框有空隙时)
		border: {
			type: Boolean,
			default: () => defProps.card.border
		},
		// 用于标识点击了第几个
		index: {
			type: [Number, String, Object],
			default: () => defProps.card.index
		},
		// 用于隔开上下左右的边距，带单位的写法，如："30px 30px"，"20px 20px 30px 30px"
		margin: {
			type: String,
			default: () => defProps.card.margin
		},
		// card卡片的圆角
		borderRadius: {
			type: [Number, String],
			default: () => defProps.card.borderRadius
		},
		// 头部自定义样式，对象形式
		headStyle: {
			type: Object,
			default: () => defProps.card.headStyle
		},
		// 主体自定义样式，对象形式
		bodyStyle: {
			type: Object,
			default: () => defProps.card.bodyStyle
		},
		// 底部自定义样式，对象形式
		footStyle: {
			type: Object,
			default: () => defProps.card.footStyle
		},
		// 头部是否下边框
		headBorderBottom: {
			type: Boolean,
			default: () => defProps.card.headBorderBottom
		},
		// 底部是否有上边框
		footBorderTop: {
			type: Boolean,
			default: () => defProps.card.footBorderTop
		},
		// 标题左边的缩略图
		thumb: {
			type: String,
			default: () => defProps.card.thumb
		},
		// 缩略图宽高
		thumbWidth: {
			type: [String, Number],
			default: () => defProps.card.thumbWidth
		},
		// 缩略图是否为圆形
		thumbCircle: {
			type: Boolean,
			default: () => defProps.card.thumbCircle
		},
		// 给head，body，foot的内边距
		padding: {
			type: [String, Number],
			default: () => defProps.card.padding
		},
		paddingHead: {
			type: [String, Number],
			default: () => defProps.card.paddingHead
		},
		paddingBody: {
			type: [String, Number],
			default: () => defProps.card.paddingBody
		},
		paddingFoot: {
			type: [String, Number],
			default: () => defProps.card.paddingFoot
		},
		// 是否显示头部
		showHead: {
			type: Boolean,
			default: () => defProps.card.showHead
		},
		// 是否显示尾部
		showFoot: {
			type: Boolean,
			default: () => defProps.card.showFoot
		},
		// 卡片外围阴影，字符串形式
		boxShadow: {
			type: String,
			default: () => defProps.card.boxShadow
		}
    }
})
