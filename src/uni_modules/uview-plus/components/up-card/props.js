import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'

export const propsCard = defineMixin({
    props: {
        // 与屏幕两侧是否留空隙
		full: {
			type: Boolean,
			default: false
		},
		// 标题
		title: {
			type: String,
			default: ''
		},
		// 标题颜色
		titleColor: {
			type: String,
			default: '#303133'
		},
		// 标题字体大小
		titleSize: {
			type: [Number, String],
			default: '15px'
		},
		// 副标题
		subTitle: {
			type: String,
			default: ''
		},
		// 副标题颜色
		subTitleColor: {
			type: String,
			default: '#909399'
		},
		// 副标题字体大小
		subTitleSize: {
			type: [Number, String],
			default: '13'
		},
		// 是否显示外部边框，只对full=false时有效(卡片与边框有空隙时)
		border: {
			type: Boolean,
			default: true
		},
		// 用于标识点击了第几个
		index: {
			type: [Number, String, Object],
			default: ''
		},
		// 用于隔开上下左右的边距，带单位的写法，如："30px 30px"，"20px 20px 30px 30px"
		margin: {
			type: String,
			default: '15px'
		},
		// card卡片的圆角
		borderRadius: {
			type: [Number, String],
			default: '8px'
		},
		// 头部自定义样式，对象形式
		headStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 主体自定义样式，对象形式
		bodyStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 底部自定义样式，对象形式
		footStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 头部是否下边框
		headBorderBottom: {
			type: Boolean,
			default: true
		},
		// 底部是否有上边框
		footBorderTop: {
			type: Boolean,
			default: true
		},
		// 标题左边的缩略图
		thumb: {
			type: String,
			default: ''
		},
		// 缩略图宽高
		thumbWidth: {
			type: [String, Number],
			default: '30px'
		},
		// 缩略图是否为圆形
		thumbCircle: {
			type: Boolean,
			default: false
		},
		// 给head，body，foot的内边距
		padding: {
			type: [String, Number],
			default: '15px'
		},
		paddingHead: {
			type: [String, Number],
			default: ''
		},
		paddingBody: {
			type: [String, Number],
			default: ''
		},
		paddingFoot: {
			type: [String, Number],
			default: ''
		},
		// 是否显示头部
		showHead: {
			type: Boolean,
			default: true
		},
		// 是否显示尾部
		showFoot: {
			type: Boolean,
			default: true
		},
		// 卡片外围阴影，字符串形式
		boxShadow: {
			type: String,
			default: 'none'
		}
    }
})
