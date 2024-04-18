(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{553:function(t,a,s){"use strict";s.r(a);var e=s(6),_=Object(e.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"对比uview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#对比uview"}},[t._v("#")]),t._v(" 对比uView")]),t._v(" "),a("p",[t._v("uview-plus对比uView2.x，目前除了支持vue3，其他共接口我们将尽量保持兼容，最大减少大家的学习和迁移成本。\n下面列出一些uview-plus与uView2.x的差异（同时保留了uView1.x与uView2.x的差异方便大家查看，但是uView1.x并不支持升级到uview-plus），让您能更好的对"),a("code",[t._v("element-plus")]),t._v("有整体的认识，了解该使用哪个版本，以及是否值得升级到"),a("code",[t._v("uview-plus")]),t._v("版本。")]),t._v(" "),a("h4",{attrs:{id:"_1-对nvue的支持"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-对nvue的支持"}},[t._v("#")]),t._v(" 1. 对nvue的支持")]),t._v(" "),a("p",[t._v("众所周知，uView2.x是兼容nvue的，目前uview-plus也继承了这一优点也全面实现了兼容"),a("code",[t._v("nvue")]),t._v("。"),a("br"),t._v("\n我们也知道，"),a("code",[t._v("nvue")]),t._v("的背后其实是"),a("code",[t._v("weex")]),t._v("，在渲染上有出色的效果，但是其也有很多无法填平的兼容问题，导致某些情况下费尽心思依然无法实现理想的效果。")]),t._v(" "),a("h4",{attrs:{id:"_2-form表单校验的加强"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-form表单校验的加强"}},[t._v("#")]),t._v(" 2. form表单校验的加强")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，"),a("code",[t._v("prop")]),t._v("参数不支持"),a("code",[t._v("a.b.c")]),t._v("的写法，"),a("code",[t._v("2.x")]),t._v("实现了支持，同时对"),a("code",[t._v("form")]),t._v("组件引入了"),a("code",[t._v("validateField、resetFields、clearValidate")]),t._v("等方法，从各个方面对表单功能\n进行了加强，让您在移动端依然能对表单校验游刃有余。")]),t._v(" "),a("h4",{attrs:{id:"_3-优化popup弹窗组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-优化popup弹窗组件"}},[t._v("#")]),t._v(" 3. 优化popup弹窗组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们对弹窗进行了优化，有如下：")]),t._v(" "),a("ul",[a("li",[t._v("修复了"),a("code",[t._v("1.x")]),t._v("中快速切换可能会卡死；")]),t._v(" "),a("li",[t._v("移除了内置的"),a("code",[t._v("scroll-view")]),t._v("组件，让"),a("code",[t._v("popup")]),t._v("内的内容可以超出边界；")]),t._v(" "),a("li",[t._v("优化弹窗的响应速度")]),t._v(" "),a("li",[t._v("处理了由于uni-app的问题，导致微信小程序内，弹窗内无法准确获取元素尺寸而导致某些内嵌组件失效的问题；")]),t._v(" "),a("li",[t._v("提供一个"),a("code",[t._v("bgColor")]),t._v("参数，设置为"),a("code",[t._v("transparent")]),t._v("可以方便去掉背景色，实现个性化的中部弹窗；")])]),t._v(" "),a("h4",{attrs:{id:"_4-提供通用性的customstyle参数"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-提供通用性的customstyle参数"}},[t._v("#")]),t._v(" 4. 提供通用性的customStyle参数")]),t._v(" "),a("p",[t._v("我们为每个组件都提供了一个"),a("code",[t._v("customStyle")]),t._v("，一般作用于组件内部的根节点，可以方便设置一些基础样式，它同时能接受对象或者字符串的样式形式，如下：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 对象形式")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("up"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("badge "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("customStyle"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("\"{backgroundColor: 'red'}\"")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("up"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("badge"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 字符串形式")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("up"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("badge customStyle"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"background-color: red;"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("up"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("badge"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v("\n")])])]),a("h4",{attrs:{id:"_5-优化在微信小程序上的差异"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-优化在微信小程序上的差异"}},[t._v("#")]),t._v(" 5. 优化在微信小程序上的差异")]),t._v(" "),a("p",[t._v("微信小程序中，默认情况下，自定义组件本身的那个节点是一个“普通”的节点，使用时可以在这个节点上设置"),a("code",[t._v("class style 、动画、 flex")]),t._v("布局等，但是在复杂的\n布局下，这可能会导致我们无法控制组件的整体布局，所以在"),a("code",[t._v("2.x")]),t._v("中，我们统一将所有组件设置为“虚拟的”，让其能更好的按我们的预期进行工作。")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// #ifdef MP-WEIXIN")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("virtualHost")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// #endif")]),t._v("\n")])])]),a("h4",{attrs:{id:"_6-加强calendar日历组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_6-加强calendar日历组件"}},[t._v("#")]),t._v(" 6. 加强calendar日历组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们加入了多个控制参数，让您能够对日历进行各个方面进行细致的操作，如通过"),a("code",[t._v("formatter")]),t._v("参数，可以自定义日历提示语，角标等；允许控制日期最大和最小范围；\n可以通过滚动的形式，同时展示多个月份；总之，相比"),a("code",[t._v("1.x")]),t._v("，我们从每个方面进行了细致的考虑，并提供了对应的处理方法。")]),t._v(" "),a("h4",{attrs:{id:"_7-picker组件的调整"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_7-picker组件的调整"}},[t._v("#")]),t._v(" 7. picker组件的调整")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们提供了"),a("code",[t._v("picker")]),t._v("和"),a("code",[t._v("select")]),t._v("组件，这些组件存在一些不足与混乱，同时可能无法配置出我们想要的场景，在"),a("code",[t._v("2.x")]),t._v("中，我们对此进行了梳理，拆分为典型的"),a("code",[t._v("picker")]),t._v("组件，\n用于普通的非时间类型选择，同时提供"),a("code",[t._v("datetime-picker")]),t._v("组件，用于专门的时间选择，并针对时间的格式化，最小和最大时间等方面，提供了多样化的控制参数。")]),t._v(" "),a("h4",{attrs:{id:"_8-加强numberbox组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_8-加强numberbox组件"}},[t._v("#")]),t._v(" 8. 加强numberBox组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("上，由于历史原因，此组件存在更新值时可能会有异常的问题。在"),a("code",[t._v("2.x")]),t._v("中，我们对此组件进行了重构和加强，加入异步控制，以及样式完全自定义的特性，让它能适用于\n任何您需要它的场景。")]),t._v(" "),a("h4",{attrs:{id:"_9-优化upload组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_9-优化upload组件"}},[t._v("#")]),t._v(" 9. 优化upload组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们将上传的核心功能集成在组件内，导致在某些特殊返回状态，以及有前端直传"),a("code",[t._v("oss")]),t._v("时，可能会操作不方便的问题。"),a("br"),t._v("\n所以，在"),a("code",[t._v("2.x")]),t._v("中，我们重构了此组件，此后，组件内部只提供图片(新增了视频和文件类型)的选择与展示，将上传的步骤交由外部用户自定义的逻辑进行操作，实现更好的解耦。")]),t._v(" "),a("h4",{attrs:{id:"_10-优化radio和checkbox组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_10-优化radio和checkbox组件"}},[t._v("#")]),t._v(" 10. 优化radio和checkbox组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们没法控制这两个组件的排列形式，所以在"),a("code",[t._v("2.x")]),t._v("中，我们提供了一个"),a("code",[t._v("placement")]),t._v("参数，可以对调图片与文本的位置，用于在特殊场景的布局，同时我们在组件内部进行了\n特殊处理，让他们能更好的配合"),a("code",[t._v("form")]),t._v("组件进行表单校验。")]),t._v(" "),a("h4",{attrs:{id:"_11-switch组件细节优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_11-switch组件细节优化"}},[t._v("#")]),t._v(" 11. switch组件细节优化")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，该组件能够满足正常使用，在"),a("code",[t._v("2.x")]),t._v("中，我们对它进行优化，比如加入更好的"),a("code",[t._v("loading")]),t._v("效果、切换动画、以及提供"),a("code",[t._v("space")]),t._v("参数让您配置出另一种风格的样式。")]),t._v(" "),a("h4",{attrs:{id:"_12-优化countdown倒计时组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_12-优化countdown倒计时组件"}},[t._v("#")]),t._v(" 12. 优化countDown倒计时组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们对此组件进行如下优化：")]),t._v(" "),a("ul",[a("li",[t._v("加入毫秒级的功能")]),t._v(" "),a("li",[t._v("提供完全自定义的样式配置，让它能适用于任何场景。")])]),t._v(" "),a("h4",{attrs:{id:"_13-优化swipeaction滑动单元格组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_13-优化swipeaction滑动单元格组件"}},[t._v("#")]),t._v(" 13. 优化swipeAction滑动单元格组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们针对不同的平台，采用不同的方案去实现此组件的效果，在"),a("code",[t._v("nvue")]),t._v("上，我们采用了"),a("code",[t._v("BindingX")]),t._v("方案，在APP和微信小程序，H5上，我们采用了"),a("code",[t._v("wxs")]),t._v("的方案，\n这些优化 ，能让我们滑动单元格时，有丝滑和细腻的效果。")]),t._v(" "),a("h4",{attrs:{id:"_14-组件内部获取尺寸时机的优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_14-组件内部获取尺寸时机的优化"}},[t._v("#")]),t._v(" 14. 组件内部获取尺寸时机的优化")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，普遍的做法是在组件初始化完成后获取内部元素的尺寸，这导致在内容变化而导致尺寸变化后，可能导致不准确，或者需要通过调用组件的方法重新进行初始化。"),a("br"),t._v("\n而在"),a("code",[t._v("2.x")]),t._v("中，我们对此进行了反思，采用的方法为每次需要进行操作的时候，重新获取元素的尺寸，典型的为"),a("code",[t._v("collapse")]),t._v("折叠面板组件，在每次打开的时候，组件都会重新\n计算该展示的高度。")]),t._v(" "),a("h4",{attrs:{id:"_15-父子嵌套组件调用的优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_15-父子嵌套组件调用的优化"}},[t._v("#")]),t._v(" 15. 父子嵌套组件调用的优化")]),t._v(" "),a("p",[t._v("在uview-plus中，有很多组件都采用父子嵌套的做法，比如"),a("code",[t._v("radio")]),t._v("组件，就由"),a("code",[t._v("u-radio-group")]),t._v("和"),a("code",[t._v("u-radio")]),t._v("组件，"),a("code",[t._v("1.x")]),t._v("中对类似的组件采用了统一的处理方法，该方法存在一定的缺陷，\n导致反复操作一些子组件时，重复加入一些实例到管理状态中，从而导致卡顿或者混乱。在"),a("code",[t._v("2.x")]),t._v("中，我们对类似的问题进行了优化，保证了状态的正确性，以及在组件被卸载的时候，进行移除。")]),t._v(" "),a("h4",{attrs:{id:"_16-骨架屏组件重构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_16-骨架屏组件重构"}},[t._v("#")]),t._v(" 16. 骨架屏组件重构")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们需要给骨架屏组件提供类名，以及初始的模拟数据，让组件内部进行尺寸获取以及在对应的位置绘制占位图，在便捷性的同时，舍弃了可控性。"),a("br"),t._v("\n所以，在"),a("code",[t._v("2.x")]),t._v("中，我们采用了另一种实现方式，让用户可以通过参数的形式，配置出想要的占位图信息，可以获得更强的自定义性。")]),t._v(" "),a("h4",{attrs:{id:"_17-加强http请求"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_17-加强http请求"}},[t._v("#")]),t._v(" 17. 加强http请求")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们提供了基本可用的"),a("code",[t._v("http")]),t._v("支持，它也存在一些缺陷，比如不支持"),a("code",[t._v("upload、download")]),t._v("，其他各项配置不够细化等。"),a("br"),t._v("\n在"),a("code",[t._v("2.x")]),t._v("中，我们引入更专业的"),a("code",[t._v("luch-request")]),t._v("插件，它能全面的支持一个企业应用在各种复杂场景下的请求配置需求，我们对此插件进行了进一步的封装，并提供了详细实践用例，\n您可以在"),a("a",{attrs:{href:"https://www.uviewui.com/js/http.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Http请求"),a("OutboundLink")],1),t._v("章节中查阅更多关于它的用法。")]),t._v(" "),a("h4",{attrs:{id:"_18-提供全局性的组件默认参数配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_18-提供全局性的组件默认参数配置"}},[t._v("#")]),t._v(" 18. 提供全局性的组件默认参数配置")]),t._v(" "),a("p",[t._v("我们知道，每个组件都有很多的"),a("code",[t._v("props")]),t._v("参数，在调用组件的时候，通过修改对应的参数，可以覆盖组件的默认值。但是在对于某个常用的组件来说，如果组件的某个参数\n默认值不符合自己的需求，就需要在每次调用的时候，都去覆盖它。"),a("br"),t._v("\n在"),a("code",[t._v("2.x")]),t._v("中，我们对此提供了一个解决方案，假设"),a("code",[t._v("u-text")]),t._v("的"),a("code",[t._v("color")]),t._v("为"),a("code",[t._v("#333333")]),t._v("，而您应用的默认色值为"),a("code",[t._v("#555555")]),t._v("，就需要每次使用"),a("code",[t._v("u-text")]),t._v("组件时，都去修改它，如下：")]),t._v(" "),a("div",{staticClass:"language-html extra-class"},[a("pre",{pre:!0,attrs:{class:"language-html"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- 列表页 --\x3e")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("up-text")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("color")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("#555555"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("text")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("列表内容"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("up-text")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("\x3c!-- 详情页 --\x3e")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("up-text")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("color")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("#555555"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),a("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("text")]),a("span",{pre:!0,attrs:{class:"token attr-value"}},[a("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("详情内容"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token tag"}},[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("up-text")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们可以通过"),a("code",[t._v("uni.$u.props.组件名.参数名")]),t._v("的形去对组件的某个默认参数进行全局覆盖，比如我们我要修改"),a("code",[t._v("u-text")]),t._v("组件"),a("code",[t._v("color")]),t._v("参数：")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 建议在main.js中(初始化uview-plus之后)引入外部配置文件中进行统一处理")]),t._v("\nuni"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("props"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("text"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("color "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#555555'")]),t._v("\n")])])]),a("p",[t._v("在进行如上设置后，整个应用中，任意调用"),a("code",[t._v("u-text")]),t._v("的地方，"),a("code",[t._v("color")]),t._v("参数的默认值都成为了"),a("code",[t._v("#555555")]),t._v("。")]),t._v(" "),a("h4",{attrs:{id:"_19-优化demo演示效果-以及移除了模板和js的模块"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_19-优化demo演示效果-以及移除了模板和js的模块"}},[t._v("#")]),t._v(" 19. 优化demo演示效果，以及移除了模板和js的模块")]),t._v(" "),a("p",[t._v("为了让组件库更加专注和简洁，我们在演示demo中，移除了"),a("code",[t._v("1.x")]),t._v("中关于"),a("code",[t._v("模板")]),t._v("和"),a("code",[t._v("js")]),t._v("的模块，同时优化了组件的演示效果，不再使用"),a("code",[t._v("1.x")]),t._v("切换按钮的形式去动态切换效果，\n而是提供更直观的形式对组件的重要效果进行罗列演示。"),a("br"),t._v("\n同时，在官网中，我们也移除了"),a("code",[t._v("模板")]),t._v("模块。")]),t._v(" "),a("h4",{attrs:{id:"_20-加强tag组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_20-加强tag组件"}},[t._v("#")]),t._v(" 20. 加强tag组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们对"),a("code",[t._v("tag")]),t._v("组件进行了加强，相较"),a("code",[t._v("1.x")]),t._v("，它具有如下优势：")]),t._v(" "),a("ul",[a("li",[t._v("可以配置关闭功能")]),t._v(" "),a("li",[t._v("可以配置图标")]),t._v(" "),a("li",[t._v("可以适用于进行多选和单选的场景")])]),t._v(" "),a("h4",{attrs:{id:"_21-加强swiper轮播图组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_21-加强swiper轮播图组件"}},[t._v("#")]),t._v(" 21. 加强swiper轮播图组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("2.x")]),t._v("中，我们对"),a("code",[t._v("swiper")]),t._v("组件进行了加强，让它可以配置出更加灵活的指示器样式，同时加入加载中的状态，以及可以嵌入视频播放的特性。")]),t._v(" "),a("h4",{attrs:{id:"_22-优化sticky吸顶组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_22-优化sticky吸顶组件"}},[t._v("#")]),t._v(" 22. 优化sticky吸顶组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("中，我们采用的是监听元素状态的形式，通过"),a("code",[t._v("js")]),t._v("方案进行吸顶，但是随着时代的进步以及设备的升级，大部分设备以及某些平台已经实现了对"),a("code",[t._v("css sticky")]),t._v("支持，\n所以在"),a("code",[t._v("2.x")]),t._v("中，我们采用了两种方案，在各个平台，比如"),a("code",[t._v("nvue, App, Ios，Android，微信小程序，H5")]),t._v("等，通过各种手段，去判断当前平台或者设备是否支持"),a("code",[t._v("css sticky")]),t._v("，\n如果支持则优先使用"),a("code",[t._v("css")]),t._v("方案以获得更细腻的效果。如果不支持"),a("code",[t._v("css")]),t._v("方案，则自动降级为"),a("code",[t._v("js")]),t._v("方案。")]),t._v(" "),a("h4",{attrs:{id:"_23-优化tabs组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_23-优化tabs组件"}},[t._v("#")]),t._v(" 23. 优化tabs组件")]),t._v(" "),a("p",[t._v("在"),a("code",[t._v("1.x")]),t._v("，可能会存在动态增减菜单下，底部滑块位置可能会错乱的问题，得益于"),a("code",[t._v("2.x")]),t._v("的整体架构调整，我们在每次移动滑块时，都会重新获取菜单的尺寸，再进行移动，保证了滑块\n能准确移动到如期的位置。同时，我们对此组件还进行其他细节优化，比如可以禁用某个菜单，显示角标，可以配合"),a("code",[t._v("u-sticky")]),t._v("进行吸顶等。")])])}),[],!1,null,null,null);a.default=_.exports}}]);