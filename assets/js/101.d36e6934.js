(window.webpackJsonp=window.webpackJsonp||[]).push([[101],{577:function(t,a,s){"use strict";s.r(a);var n=s(6),e=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"安全区适配"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安全区适配"}},[t._v("#")]),t._v(" 安全区适配")]),t._v(" "),a("h3",{attrs:{id:"底部安全区"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#底部安全区"}},[t._v("#")]),t._v(" 底部安全区")]),t._v(" "),a("p",[t._v("这个适配，主要是针对IPhone X等一些底部带指示条的机型，指示条的操作区域与页面底部存在重合，容易导致用户误操作，因此我们需要针对这些机型进行底部安全区适配。"),a("br"),t._v("\nuview-plus是uni-app态的UI框架uni-app专门针对底部安全区域的解决方案，具体如下(也可见uni官方说明"),a("a",{attrs:{href:"https://ask.dcloud.net.cn/article/35564",target:"_blank",rel:"noopener noreferrer"}},[t._v("全面屏、刘海屏适配（iphoneX适配）及安全区设置"),a("OutboundLink")],1),t._v(")：")]),t._v(" "),a("ul",[a("li",[t._v("在APP上(以下只对APP生效)，可以通过项目根目录的"),a("code",[t._v("mainfest.json")]),t._v("文件"),a("code",[t._v("app-plus")]),t._v("节点下配置"),a("code",[t._v("safearea")]),t._v("的"),a("code",[t._v("bottom")]),t._v("属性为"),a("code",[t._v("none")]),t._v("，以此来关闭IPhone X等机型的底部安全区域。\n配置后需要重新编译，并重启调试基座才会生效，具体如下：")])]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"app-plus"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"safearea"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"bottom"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"offset"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"none"')]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("如果"),a("code",[t._v("offset")]),t._v("设置为"),a("code",[t._v("auto")]),t._v("，那么在IPhone X的底部安全区，APP上就会生成一个原生的元素进行占位，此时也就无需解决安全区指示条引起的问题。")]),t._v(" "),a("ul",[a("li",[t._v("在非APP端，诸如小程序，或者微信浏览器(其他浏览器，如UC等手机浏览器，底部有浏览器工具条，不存在安全区指示条引起的问题)，底部是没有安全区占位的，\n这种情况，就要使用css去解决，一般是通过给元素添加底部内边距的形式，如下：")])]),t._v(" "),a("div",{staticClass:"language-html extra-class"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token style"}},[a("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("  \n\t"),a("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".list")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("  \n\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v("padding-bottom")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 0"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  \n\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v("padding-bottom")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("constant")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("safe-area-inset-bottom"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  \n\t\t"),a("span",{pre:!0,attrs:{class:"token property"}},[t._v("padding-bottom")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("env")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("safe-area-inset-bottom"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("  \n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("  \n")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("p",[t._v("鉴于以上问题，uview-plus提供了一个组件"),a("code",[t._v("u-safe-bottom")]),t._v("，如果有需要，您可以在任何地方引用它，它会自动判断在并且在IPhone X等机型的时候，给元素加上一个适当\n底部内边距，在APP上，即使您保留了原生安全区占位("),a("code",[t._v("offset")]),t._v("设置为"),a("code",[t._v("auto")]),t._v(")，也不会导致底部出现双倍的空白区域，也即APP上"),a("code",[t._v("offset")]),t._v("设置为"),a("code",[t._v("auto")]),t._v("时。")]),t._v(" "),a("div",{staticClass:"language-html extra-class"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t\t......\n\t\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("u-safe-bottom")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("u-safe-bottom")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("h3",{attrs:{id:"顶部安全区"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#顶部安全区"}},[t._v("#")]),t._v(" 顶部安全区")]),t._v(" "),a("p",[t._v("由于我们在做页面布局时经常会使用顶部位置，uview-plus提供了一个组件"),a("code",[t._v("u-status-bar")]),t._v("，如"),a("code",[t._v("u-popup")]),t._v("从顶部弹出时，可以考虑使用此组件。")]),t._v(" "),a("div",{staticClass:"language-html extra-class"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("u-status-bar")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("u-status-bar")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t\t......\n\t"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("h3",{attrs:{id:"关于uview-plus某些组件safe-area-inset参数的说明"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#关于uview-plus某些组件safe-area-inset参数的说明"}},[t._v("#")]),t._v(" 关于uview-plus某些组件"),a("code",[t._v("safe-area-inset")]),t._v("参数的说明")]),t._v(" "),a("p",[t._v("在uview-plus中，一些组件如"),a("code",[t._v("u-popup")]),t._v("、"),a("code",[t._v("u-keyboard")]),t._v("组件等，提供了一个"),a("code",[t._v("safeAreaInsetBottom")]),t._v("参数(布尔类型)，如果设置为"),a("code",[t._v("true")]),t._v("，就会在组件内部对安全区进行适配，\n从而避免安全区指示条引起的问题，以下为uview-plus的"),a("code",[t._v("u-keyboard")]),t._v("组件在"),a("code",[t._v("微信浏览器")]),t._v("中分别设置"),a("code",[t._v("safeAreaInsetBottom")]),t._v("参数\n为"),a("code",[t._v("false")]),t._v("和"),a("code",[t._v("true")]),t._v("的表现：")]),t._v(" "),a("div",[a("img",{staticClass:"logo",attrs:{src:"/common/keyboard.png",alt:"uview-plus"}})])])}),[],!1,null,null,null);a.default=e.exports}}]);