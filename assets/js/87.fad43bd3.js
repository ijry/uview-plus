(window.webpackJsonp=window.webpackJsonp||[]).push([[87],{395:function(t,a,s){},494:function(t,a,s){"use strict";s(395)},655:function(t,a,s){"use strict";s.r(a);s(494);var n=s(6),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"便捷工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#便捷工具"}},[t._v("#")]),t._v(" 便捷工具")]),t._v(" "),a("p",[t._v("此专题内容为一些方便用户快速，便捷使用的小工具，可能是uview-plus的一些方法的简易版，或者对uni的一些方法进行二次封装，方便用户\n快速使用。")]),t._v(" "),a("h3",{attrs:{id:"os"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#os"}},[t._v("#")]),t._v(" os()")]),t._v(" "),a("p",[t._v("此方法用于返回平台的名称，为小写的"),a("code",[t._v("ios")]),t._v("或"),a("code",[t._v("android")])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("uni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("os")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"sys"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sys"}},[t._v("#")]),t._v(" sys()")]),t._v(" "),a("p",[t._v("此方法用于获取设备的信息，相当于uni.getSystemInfoSync()的效果")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("uni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sys")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"platform"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#platform"}},[t._v("#")]),t._v(" platform")]),t._v(" "),a("p",[t._v("此"),a("code",[t._v("属性")]),t._v("用于获取当前运行的平台名称，相较于"),a("code",[t._v("uni-app")]),t._v("系统自带的条件编译的区别是，此方式让我们可以通过"),a("code",[t._v("js")]),t._v("的"),a("code",[t._v("if | else if")]),t._v("进行判断，\n您可以结合实际场景进行使用。")]),t._v(" "),a("ul",[a("li",[t._v("注意：此属性返回的结果，和"),a("code",[t._v("uni-app")]),t._v("的条件编译名称有差别，并且结果都为小写。")])]),t._v(" "),a("p",[t._v("使用：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回'h5'")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("platform\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 条件判断")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" platform "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" uni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("platform "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'app'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("platform "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'nvue'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h4",{attrs:{id:"各平台对应返回值如下表"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#各平台对应返回值如下表"}},[t._v("#")]),t._v(" 各平台对应返回值如下表：")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("平台")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("返回值")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("VUE3，HBuilderX 3.2.0+")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("vue3")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("VUE2")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("vue2")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("App")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("plus")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("App nvue")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("nvue")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("H5")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("h5")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("微信小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("weixin")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("支付宝小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("alipay")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("百度小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("baidu")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("字节跳动小程序、飞书小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("toutiao")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("QQ小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("qq")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("快手小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("kuaishou")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("360小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("360")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("微信小程序/支付宝小程序/百度小程序/字节跳动小程序/QQ小程序/360小程序")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("mp")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("快应用通用(包含联盟、华为)")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("webview")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("快应用联盟")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("webview-union")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("快应用华为")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("webview-huawei")])])])]),t._v(" "),a("h3",{attrs:{id:"range-min-max-value"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#range-min-max-value"}},[t._v("#")]),t._v(" range(min, max, value)")]),t._v(" "),a("p",[t._v("此方法用于限制"),a("code",[t._v("value")]),t._v("的大小，如果其在"),a("code",[t._v("min")]),t._v("和"),a("code",[t._v("max")]),t._v("之间，则不变；如果其小于"),a("code",[t._v("min")]),t._v("，则取"),a("code",[t._v("min")]),t._v("值；如果其大于"),a("code",[t._v("max")]),t._v("，则取"),a("code",[t._v("max")]),t._v("值。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 最终结果为5")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("range")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("8")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 最终结果为4")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("range")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"getpx-value-unit-false"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getpx-value-unit-false"}},[t._v("#")]),t._v(" getPx(value [, unit = false])")]),t._v(" "),a("p",[t._v("此方法用于返回带单位的值的数值结果，如果第二个参数为"),a("code",[t._v("true")]),t._v("，返回的结果将会带上"),a("code",[t._v("px")]),t._v("的单位；可接受的值如下：")]),t._v(" "),a("ul",[a("li",[t._v("带"),a("code",[t._v("upx")]),t._v("和"),a("code",[t._v("rpx")]),t._v("单位，返回使用"),a("code",[t._v("uni.upx2px")]),t._v("转换后，为"),a("code",[t._v("px")]),t._v("单位的结果")]),t._v(" "),a("li",[t._v("带"),a("code",[t._v("px")]),t._v("单位，返回去掉"),a("code",[t._v("px")]),t._v("单位的具体数值")]),t._v(" "),a("li",[t._v("具体数值，如"),a("code",[t._v("5")]),t._v("，将会返回"),a("code",[t._v("5")])])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回10")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getPx")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'10rpx'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回12")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getPx")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'12px'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回14")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getPx")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("14")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回类似10px的结果")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("getPx")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'20rpx'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"sleep-value"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sleep-value"}},[t._v("#")]),t._v(" sleep(value)")]),t._v(" "),a("p",[t._v("延时一定时间进行回调，类似于"),a("code",[t._v("promise")]),t._v("的使用方式")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("value")]),t._v("，数值，单位默认为"),a("code",[t._v("ms")])])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 300ms后触发回调")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("sleep")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("then")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tconsole"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'定时结束'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"parent-call-instance-name"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#parent-call-instance-name"}},[t._v("#")]),t._v(" $parent.call(instance [, name])")]),t._v(" "),a("p",[t._v("用于抹平各端差异，在组件中向上获取父组件或者页面的实例。")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("instance")]),t._v("，实例，传"),a("code",[t._v("this")]),t._v("即可，不可修改")]),t._v(" "),a("li",[a("code",[t._v("name")]),t._v("，可选，页面或者父组件的"),a("code",[t._v("name")]),t._v("属性值，不传则默认查找页面(最顶层)的实例")])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 页面内容")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("template"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("child"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("child"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("template"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 此处为页面级，所以name值可选")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'page'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 组件内容")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("mounted")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将会得到父页面的this实例")]),t._v("\n\t\tuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("$parent")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("call")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'page'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("script"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])])]),a("h3",{attrs:{id:"addstyle-style-target-object"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#addstyle-style-target-object"}},[t._v("#")]),t._v(" addStyle(style [, target = 'object'])")]),t._v(" "),a("p",[t._v("用于将"),a("code",[t._v("字符串")]),t._v("形式的内联样式样式转为"),a("code",[t._v("对象")]),t._v("形式，或者将"),a("code",[t._v("对象")]),t._v("形式的样式写法转为"),a("code",[t._v("字符串")]),t._v("形式。")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("style")]),t._v("，样式，可为对象或者字符串形式")]),t._v(" "),a("li",[a("code",[t._v("target")]),t._v("，可选，转换结果的类型，默认为"),a("code",[t._v("object")]),t._v("；如果为"),a("code",[t._v("object")]),t._v("则返回对象形式的结果，如果为"),a("code",[t._v("string")]),t._v("则返回字符串形式的结果")])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将会返回'padding: 10px; margin: 20px'")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" style "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("padding")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'10px'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("margin")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'20px'")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addStyle")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("style"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'string'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将会返回{ padding: '10px', margin: '20px' }")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" style "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"padding: 10px; margin: 20px"')]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addStyle")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("style"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"addunit-value-unit-px"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#addunit-value-unit-px"}},[t._v("#")]),t._v(" addUnit(value [, unit = 'px'])")]),t._v(" "),a("p",[t._v("用于给值加上单位，如果值已有单位，则直接原样返回，如果值为"),a("code",[t._v("数值")]),t._v("，则加上"),a("code",[t._v("unit")]),t._v("参数的单位。")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("value")]),t._v("，可为"),a("code",[t._v("5")]),t._v("，"),a("code",[t._v("5px")]),t._v("，"),a("code",[t._v("6rpx")]),t._v("，"),a("code",[t._v("100%")]),t._v("等格式的值")]),t._v(" "),a("li",[a("code",[t._v("unit")]),t._v("，可选，默认为"),a("code",[t._v("px")]),t._v("，如果第一个参数为"),a("code",[t._v("数值")]),t._v("，则拼接上此单位")])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回5px")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addUnit")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addUnit")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'5px'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回5rpx")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("addUnit")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'rpx'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"priceformat-value-decimals-0-decimalpoint-thousandsseparator"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#priceformat-value-decimals-0-decimalpoint-thousandsseparator"}},[t._v("#")]),t._v(" priceFormat(value [, decimals = 0 [, decimalPoint = '.' [, thousandsSeparator = ',']]])")]),t._v(" "),a("p",[t._v("此方法可用于对数值形式的金额进行格式化")]),t._v(" "),a("ul",[a("li",[t._v("value，需要格式化的金额数值，只能为数值，如"),a("code",[t._v("300.52")]),t._v("，"),a("code",[t._v("300")]),t._v("，而不能为诸如带千分位的写法"),a("code",[t._v("3,000.5")])]),t._v(" "),a("li",[t._v("decimals，可选，格式化后小数点的位数，默认为"),a("code",[t._v("0")]),t._v("，小数最后一位会进行四舍五入")]),t._v(" "),a("li",[t._v("decimalPoint，可选，小数点的符号，默认为"),a("code",[t._v(".")])]),t._v(" "),a("li",[t._v("thousandsSeparator，可选，千分位分隔符，默认为英文逗号"),a("code",[t._v(",")])])]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回3,002.37")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("priceFormat")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3002.365")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回3,002")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("priceFormat")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3002.365")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"page"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#page"}},[t._v("#")]),t._v(" page()")]),t._v(" "),a("p",[t._v("此方法用于获取当前页面的路径，返回的路径以"),a("code",[t._v("/")]),t._v("开头。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 返回类似/pages/example/components的结果")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("page")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),a("h3",{attrs:{id:"pages"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pages"}},[t._v("#")]),t._v(" pages() "),a("badge",{attrs:{text:"2.0.22"}})],1),t._v(" "),a("p",[t._v("本方法为"),a("code",[t._v("getCurrentPages()")]),t._v("的封装，用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("uni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("pages")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])}),[],!1,null,"51bcca52",null);a.default=e.exports}}]);