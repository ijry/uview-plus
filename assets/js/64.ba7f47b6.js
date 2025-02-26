(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{366:function(t,s,a){},471:function(t,s,a){"use strict";a(366)},587:function(t,s,a){"use strict";a.r(s);a(471);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"注意事项"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#注意事项"}},[t._v("#")]),t._v(" 注意事项")]),t._v(" "),s("p",[t._v("由于uni-app支持多端开发，而各端，特别是各小程序平台，没有统一的标准，加重了开发者和企业的成本，幸好uni-app使用Vue标准，对各端进行了写法的统一，\n推动了生态的发展，但是由于某些小程序平台自身的原因，仍然会出现某些兼容性问题，我们会将制作uview-plus过程中遇到，和平时收集的兼容性问题呈现在本专题，希望能\n帮助到uni-app开发者。")]),t._v(" "),s("h3",{attrs:{id:"可选链支持"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#可选链支持"}},[t._v("#")]),t._v(" 可选链支持")]),t._v(" "),s("p",[t._v('出现报错{message: "Unexpected token ."}是因为HBuilderX内置的浏览器版本太低导致，不要使用内置浏览器即可。')]),t._v(" "),s("h3",{attrs:{id:"微信小程序"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#微信小程序"}},[t._v("#")]),t._v(" 微信小程序")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),s("p",[t._v("微信小程序基础库需要设置在2.19.2及以上")])]),t._v(" "),s("h3",{attrs:{id:"支付宝小程序"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#支付宝小程序"}},[t._v("#")]),t._v(" 支付宝小程序")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("注意")]),t._v(" "),s("p",[t._v("uview-plus需要开启了"),s("code",[t._v("component2")]),t._v("模式才支持支付宝小程序")])]),t._v(" "),s("ol",[s("li",[t._v("支付宝在很早前，已升级为"),s("code",[t._v("component2")]),t._v("模式，此模式支持更多的功能和特性，uni-app上，很多的特性，如"),s("code",[t._v("provide/inject")]),t._v("、"),s("code",[t._v("$slots")]),t._v("等，需要开启此模式才能支持，\n而此模式在uni-app新建项目中默认是关闭的，因而需要在项目根目录的"),s("code",[t._v("manifest.json")]),t._v("中开启，如没有"),s("code",[t._v("alipay")]),t._v("属性节点，新增即可：")])]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[t._v("......\n"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"mp-alipay"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"component2"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n......\n")])])]),s("ol",{attrs:{start:"2"}},[s("li",[t._v("uview-plus的"),s("code",[t._v("waterfall")]),t._v("瀑布流组件使用了"),s("code",[t._v("$scoped slot")]),t._v("特性，由于hx的问题，在hx2.8.2修正了此问题，所以瀑布流组件需要hx2.8.2及以上才支持支付宝小程序。")])]),t._v(" "),s("h3",{attrs:{id:"vue特性在各平台支持度"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#vue特性在各平台支持度"}},[t._v("#")]),t._v(" Vue特性在各平台支持度")]),t._v(" "),s("ol",[s("li",[t._v("以下特性，uview-plus已对各小程序开发工具，H5浏览器，APP(不含NVUE)进行过实测，均获得支持，其中支付宝小程序需要开启"),s("code",[t._v("component2")]),t._v("模式。")])]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",{staticStyle:{"text-align":"center"}},[t._v("App（vue）")]),t._v(" "),s("th",{staticStyle:{"text-align":"center"}},[t._v("App（nvue）")]),t._v(" "),s("th",{staticStyle:{"text-align":"center"}},[t._v("H5")]),t._v(" "),s("th",{staticStyle:{"text-align":"center"}},[t._v("小程序")])])]),t._v(" "),s("tbody",[s("tr",[s("td",{staticStyle:{"text-align":"center"}},[t._v("√")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("√")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("√")]),t._v(" "),s("td",{staticStyle:{"text-align":"center"}},[t._v("√")])])])]),t._v(" "),s("ul",[s("li",[t._v("provide / inject")]),t._v(" "),s("li",[t._v("$slots")]),t._v(" "),s("li",[t._v("v-model / sync")]),t._v(" "),s("li",[t._v("$parent / $children")])]),t._v(" "),s("h3",{attrs:{id:"设置页面背景颜色"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#设置页面背景颜色"}},[t._v("#")]),t._v(" 设置页面背景颜色")]),t._v(" "),s("p",[t._v("一般情况下，我们给页面的"),s("code",[t._v("page")]),t._v("节点或者给页面的最外层"),s("code",[t._v("view")]),t._v("设置背景颜色，二者分别有如下需要注意点：")]),t._v(" "),s("h4",{attrs:{id:"_1-通过page节点设置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-通过page节点设置"}},[t._v("#")]),t._v(" 1. 通过"),s("code",[t._v("page")]),t._v("节点设置")]),t._v(" "),s("p",[t._v("这个方式全端有效，但是需要注意的是，在微信小程序，或者某些安卓机型上，该节点如果写在带"),s("code",[t._v("scoped")]),t._v("属性的样式标签内是无效的，所以我们建议\n您可以在页面多加一个不带scoped属性的样式标签，如下：")]),t._v(" "),s("div",{staticClass:"language-css extra-class"},[s("pre",{pre:!0,attrs:{class:"language-css"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 如果需要css的支持，还可以添加lang属性 */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v('<style lang="scss">\npage')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("background-color")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" $up-bg-color"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n</style>\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 带scoed属性的其他样式 */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v('<style lang="scss" scoped>\n.box')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t......\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n</style>\n")])])]),s("h4",{attrs:{id:"_2-通过页面外层view设置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-通过页面外层view设置"}},[t._v("#")]),t._v(" 2. 通过页面外层"),s("code",[t._v("view")]),t._v("设置")]),t._v(" "),s("p",[t._v("相比"),s("code",[t._v("page")]),t._v("节点，"),s("code",[t._v("view")]),t._v("的高度默认为内容高度，所以如果页面内容不足一屏高度时，底部剩余部分依然为默认的白色，所以我们给需要这个"),s("code",[t._v("view")]),t._v("设置一个\n最低高度，让它等于窗口高度：")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("wrap"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t\t......\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("scoped")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("lang")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("scss"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token style"}},[s("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".wrap")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("background-color")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" $up-bg-color"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("min-height")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 100vh"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("h3",{attrs:{id:"全局赋值设备信息的陷阱"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#全局赋值设备信息的陷阱"}},[t._v("#")]),t._v(" 全局赋值设备信息的陷阱")]),t._v(" "),s("p",[t._v("我们都知道，可以通过"),s("code",[t._v("uni.getSystemInfoSync()")]),t._v("获取设备信息，但是每次用到时都写一遍是很繁琐的，所以很多同学们都会突发奇想，比如在"),s("code",[t._v("main.js")]),t._v("或者\n在"),s("code",[t._v("App.vue")]),t._v("中将"),s("code",[t._v("uni.getSystemInfoSync()")]),t._v("的结果赋值给"),s("code",[t._v("Vue.prototype")]),t._v("，如下：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// main.js")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Vue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prototype"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("system "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" uni"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getSystemInfoSync")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("上面的写法没有问题，我们可以任意地方通过"),s("code",[t._v("this.system")]),t._v("得到设备的信息，但是这里有一个陷阱，写在"),s("code",[t._v("main.js")]),t._v("，意味着赋值代码只会被执行一次，且是APP启动的时候，\n但是uni-app中，设备信息的"),s("code",[t._v("windowHeight")]),t._v("属性是不含APP的导航栏和tabbar高度在内的，当我们进入首页时，"),s("code",[t._v("windowHeight")]),t._v("不含tabbar高度在内，高度可能为\n'700px'，但是进入内页后，没有tabbar，这时的"),s("code",[t._v("windowHeight")]),t._v("高度依然为700px(少掉了tabbar的50px高度)，显然是不正确的。"),s("br"),t._v("\n上面说的只是对"),s("code",[t._v("windowHeight")]),t._v("属性有影响，其他的属性无碍，如果是需要获取高度，建议每次都执行"),s("code",[t._v("uni.getSystemInfoSync()")]),t._v("，或者通过uview-plus提供的快捷工具\n"),s("code",[t._v("uni.$u.sys()")]),t._v("方法获取即可。")]),t._v(" "),s("h3",{attrs:{id:"小程序主包太大无法预览和发布"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#小程序主包太大无法预览和发布"}},[t._v("#")]),t._v(" 小程序主包太大无法预览和发布")]),t._v(" "),s("p",[t._v("我们都知道微信小程序预览和发布的主包大小都不能超过"),s("code",[t._v("2M")]),t._v("，否则无法真机预览和上传发布，经常有同学反馈刚使用uview-plus，调试时候主包就超过了"),s("code",[t._v("2M")]),t._v("而无法真机预览，\n我们在这里做一个说明，uview-plus是"),s("code",[t._v("按需引入")]),t._v("的，在发行时，HX会自动剔除您没有使用组件，即使您使用了uViwe的全部组件，整个uview-plus的大小也只有500K左右，但是有如下两点前提：")]),t._v(" "),s("ul",[s("li",[s("strong",[t._v("调试")]),s("br"),t._v("\n在调试阶段，为了调试的友好效果和编译速度等，HX默认是没有对JS进行压缩和去除注释，也没有进行组件按需引入的，所以会导致JS文件都很大，我们需要在\nHBuilder X进行如下操作，再重新编译即可：")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("HBuilderX   运行"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("运行到小程序模拟器"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("勾选 运行时是否压缩代码\n")])])]),s("ul",[s("li",[s("strong",[t._v("发布")]),s("br"),t._v("\n在HX中进行发布时，uview-plus的组件会按需引入(使用uview-plus所有组件的情况下，占用空间500k左右)，如果主包依然超出"),s("code",[t._v("2M")]),t._v("，您需要从多个方面着手：")])]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://uniapp.dcloud.io/collocation/pages?id=subpackages",target:"_blank",rel:"noopener noreferrer"}},[t._v("小程序分包"),s("OutboundLink")],1)]),t._v(" "),s("li",[t._v("将静态资源放到服务器进行引用")]),t._v(" "),s("li",[t._v('取消"ES6转ES5"设置')])]),t._v(" "),s("h3",{attrs:{id:"uni-scss的优缺点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#uni-scss的优缺点"}},[t._v("#")]),t._v(" uni.scss的优缺点")]),t._v(" "),s("p",[s("code",[t._v("uni.scss")]),t._v("为uni-app新建项目自带工程文件，使用的预处理器为"),s("code",[t._v("sass/scss")]),t._v("，由此可见，uni-app官方推荐的是"),s("code",[t._v("scss")]),t._v("，同时我们uview-plus也是"),s("code",[t._v("scss")]),t._v("的坚定推崇者，不建议在\nuni-app中使用"),s("code",[t._v("less")]),t._v("、"),s("code",[t._v("stylus")]),t._v("等。")]),t._v(" "),s("p",[s("code",[t._v("uni.scss")]),t._v("具有如下一些特点：")]),t._v(" "),s("ul",[s("li",[t._v("无需引入，uni-app在编译时，会自动引入此文件")]),t._v(" "),s("li",[t._v("在此中定义的"),s("code",[t._v("scss")]),t._v("变量，可以全局使用，可以在此定义一些颜色，主题，尺寸等变量")]),t._v(" "),s("li",[s("strong",[s("code",[t._v("uni.scss")]),t._v("会编译到每个"),s("code",[t._v("scss")]),t._v("文件中")]),t._v("(请着重理解这一句话)")])]),t._v(" "),s("p",[t._v("综上所述，我们可以得知，"),s("code",[t._v("uni.scss")]),t._v("主要是利用"),s("code",[t._v("scss")]),t._v("的特性，定义一些全局变量，供各个写了"),s("code",[t._v("lang=scss")]),t._v("的style标签引用，但是这引出了一个重要的问题："),s("br"),t._v(" "),s("code",[t._v("uni.scss")]),t._v("中所写的一切内容，都会注入到每个声明了"),s("code",[t._v("scss")]),t._v("的文件中，这意味着，如果您的"),s("code",[t._v("uni.scss")]),t._v("如果有几百行，大小10k左右，那么这个10k都会被注入所有的\n其他"),s("code",[t._v("scss")]),t._v("文件(页面)中，如果您的应用有50个页面，那么有可能因此导致整体的包体积多了50 * 10 = 500k的大小，这可能会导致小程序包太大而无法预览和发布，\n所以，我们建议您只将"),s("code",[t._v("scss")]),t._v("变量相关的内容放到"),s("code",[t._v("uni.scss")]),t._v("中。")]),t._v(" "),s("h3",{attrs:{id:"样式覆盖兼容性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#样式覆盖兼容性"}},[t._v("#")]),t._v(" 样式覆盖兼容性")]),t._v(" "),s("p",[t._v("为了避免样式被用户覆盖，或者被污染，一般组件或者页面都会给"),s("code",[t._v("style")]),t._v("标签加上"),s("code",[t._v("scoped")]),t._v("属性，如下演示为一个组件的内部构造：")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[t._v("/* item.vue */\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("item"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("scoped")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token style"}},[s("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".item")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("border")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 1px solid red"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("我们在页面中引入上方的"),s("code",[t._v("item")]),t._v("组件，并且想修改它的"),s("code",[t._v("border")]),t._v("边框为颜色(blue)，一般通过"),s("code",[t._v("v-deep")]),t._v("或"),s("code",[t._v("/deep/")]),t._v("指令修改，如下写法：")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("item")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("item")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("scoped")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token style"}},[s("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v("::v-deep .item")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("border")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 1px solid blue"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("上面的写法，在"),s("code",[t._v("App")]),t._v("和"),s("code",[t._v("H5")]),t._v("正常，但是在微信小程序无效，它要求"),s("code",[t._v("::v-deep")]),t._v("或"),s("code",[t._v("/deep/")]),t._v("前面必须还要有父元素的类名存在，如下：")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("wrap"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("item")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("item")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("scoped")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token style"}},[s("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".wrap ::v-deep .item")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("border")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 1px solid blue"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("如果在微信小程序中还需要注意一点，如果在自定义组件中使用uview-plus，样式穿透会不生效，这是微信小程序本身的限制，不过官方提供了一个参数供解决这个问题。")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("style")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("scoped")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token style"}},[s("span",{pre:!0,attrs:{class:"token language-css"}},[t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".wrap ::v-deep .item")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("border")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 1px solid blue"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token script"}},[s("span",{pre:!0,attrs:{class:"token language-javascript"}},[t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("styleIsolation")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'shared'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("script")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("如果是在支付宝小程序中，写在组件上的类名和内联样式，都是无效的，如下：")]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\t/* 在支付宝小程序，组件标签上的任何class和style都会被剔除，不会添加到组件内部的根元素中 */\n\t"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("item")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token special-attr"}},[s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("style")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),s("span",{pre:!0,attrs:{class:"token value css language-css"}},[s("span",{pre:!0,attrs:{class:"token property"}},[t._v("border")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 1px solid blue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("item"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("item")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("template")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])])])}),[],!1,null,"976bc590",null);s.default=e.exports}}]);