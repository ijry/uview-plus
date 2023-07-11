import defprops from '../../libs/config/props';
export default {
    props: {
        // 当前form的需要验证字段的集合
        model: {
            type: Object,
            default: defprops.form.model
        },
        // 验证规则
        rules: {
            type: [Object, Function, Array],
            default: defprops.form.rules
        },
        // 有错误时的提示方式，message-提示信息，toast-进行toast提示
        // border-bottom-下边框呈现红色，none-无提示
        errorType: {
            type: String,
            default: defprops.form.errorType
        },
        // 是否显示表单域的下划线边框
        borderBottom: {
            type: Boolean,
            default: defprops.form.borderBottom
        },
        // label的位置，left-左边，top-上边
        labelPosition: {
            type: String,
            default: defprops.form.labelPosition
        },
        // label的宽度，单位px
        labelWidth: {
            type: [String, Number],
            default: defprops.form.labelWidth
        },
        // lable字体的对齐方式
        labelAlign: {
            type: String,
            default: defprops.form.labelAlign
        },
        // lable的样式，对象形式
        labelStyle: {
            type: Object,
            default: defprops.form.labelStyle
        }
    }
}
