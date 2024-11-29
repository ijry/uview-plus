(window.webpackJsonp=window.webpackJsonp||[]).push([[149],{644:function(t,s,a){"use strict";a.r(s);var n=a(6),o=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"customicon-扩展自定义图标库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#customicon-扩展自定义图标库"}},[t._v("#")]),t._v(" CustomIcon 扩展自定义图标库")]),t._v(" "),s("p",[t._v("uview-plus已通过大量的实践中，收集了用户最有可能需要用到的图标，见"),s("RouterLink",{attrs:{to:"/components/icon.html"}},[t._v("Icon 图标")]),t._v("，但我们也相信，它肯定无法覆盖所有的场景和需求。")],1),t._v(" "),s("p",[t._v("用户也可以使用标签的方式，自行引入字体图标，为何要通过扩展的方式集成呢？"),s("br"),t._v("\n这是因为uview-plus有统一的字体图标组件，使用方便，配置灵活，且风格统一。")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"custom-block-title"},[t._v("说明")]),t._v(" "),s("p",[t._v("以下说明和演示，均针对"),s("a",{attrs:{href:"https://www.iconfont.cn",target:"_blank",rel:"noopener noreferrer"}},[t._v("阿里字体图标库"),s("OutboundLink")],1),t._v("，其他字体库源同理")])]),t._v(" "),s("p",[t._v("总的来说，我们要实现的效果如下：")]),t._v(" "),s("div",{staticClass:"language-css extra-class"},[s("pre",{pre:!0,attrs:{class:"language-css"}},[s("code",[s("span",{pre:!0,attrs:{class:"token atrule"}},[s("span",{pre:!0,attrs:{class:"token rule"}},[t._v("@font-face")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('/* 声明"custom-icon"字体 */')]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("font-family")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"custom-icon"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("src")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token url"}},[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("url")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string url"}},[t._v("'data:application/x-font-woff2;charset=utf-8;base64,xxxxxxxx'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("format")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'woff2'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".custom-icon")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('/* 引用上面声明的"custom-icon"字体 */')]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("font-family")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"custom-icon"')]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("!important")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("font-size")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" 16px"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("font-style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" normal"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("-webkit-font-smoothing")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" antialiased"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("-moz-osx-font-smoothing")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" grayscale"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('/* 字体图标的前缀为"custom-icon-" */')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".custom-icon-copy:before")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token property"}},[t._v("content")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"\\e641"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("通过如下方式引用：")]),t._v(" "),s("p",[t._v("通过"),s("code",[t._v("custom-prefix")]),t._v("指定类名为"),s("code",[t._v("custom-icon")])]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("up-icon")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("copy"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("custom-prefix")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("custom-icon"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("up-icon")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("h3",{attrs:{id:"基础说明"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#基础说明"}},[t._v("#")]),t._v(" 基础说明")]),t._v(" "),s("p",[t._v("我们假定您一个项目中，需要扩展多个图标，所以您应该把各个图标收集进一个阿里图标库的项目中，即使您后面不断的扩展图标，也能让它们在同一个库中。")]),t._v(" "),s("p",[t._v('一般情况下，我们建议您在收藏的项目中，使用"下载至本地"的功能，而后解压，复制文件夹中的"iconfont.css"至uni-app目中(其余的文件可忽略)')]),t._v(" "),s("p",[t._v('下面的操作默认您已进入阿里图标库的"图标管理"栏目中')]),t._v(" "),s("ol",[s("li",[t._v('我们建议，您应该修改这个图标的前缀，这样以后有新图标加入的时候，不用每次频繁修改前缀，在右上角的"更多操作"中，进入"编辑项目"：')])]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_3.png")}}),t._v(" "),s("ol",{attrs:{start:"2"}},[s("li",[t._v('修改"FontClass/Symbol 前缀"项为"custom-icon-"，修改"Font Family"为"custom-icon"，如下图：')])]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_4.png")}}),t._v(" "),s("ol",{attrs:{start:"3"}},[s("li",[t._v("下载项目至本地")])]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_1.png")}}),t._v(" "),s("ol",{attrs:{start:"4"}},[s("li",[t._v('复制"iconfont.css"至项目，一般放在根目录的'),s("code",[t._v("static")]),t._v("文件夹下")])]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_2.png")}}),t._v(" "),s("ol",{attrs:{start:"5"}},[s("li",[t._v('复制"iconfont.css"文件到uni-app目根目录的'),s("code",[t._v("static")]),t._v('目录后(也可以为其他目录)，打开"iconfont.css"，内部如下：')])]),t._v(" "),s("p",[t._v('删掉下图圈出的部分，记得把"src: url(\'data:application/x-font-woff2......"最后的逗号'),s("code",[t._v(",")]),t._v("改成分号"),s("code",[t._v(";")]),t._v("。")]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_8.png")}}),t._v(" "),s("ol",{attrs:{start:"6"}},[s("li",[t._v("最终如下图：")])]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_9.png")}}),t._v(" "),s("ol",{attrs:{start:"7"}},[s("li",[t._v('在项目根目录的"App.vue"中，引入上述的"iconfont.css"，注意自己存放的路径，且通过"@import"引入的外部样式，为了兼容性建议使用相对路径，\n且引入的样式，需要写在'),s("code",[t._v("style")]),t._v("标签有效内容中的最前面，如下：")])]),t._v(" "),s("div",{staticClass:"language-css extra-class"},[s("pre",{pre:!0,attrs:{class:"language-css"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* App.vue */")]),t._v("\n<style>\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/* 此处为style标签内容的最前面 */")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token atrule"}},[s("span",{pre:!0,attrs:{class:"token rule"}},[t._v("@import")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"./static/iconfont.css"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")])]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token selector"}},[t._v(".view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t......\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('/* 下面为错误示例，因为这里不是style标签内容的最前面，前面还有个".view"的样式 */')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('/* @import "./static/iconfont.css"; */')]),t._v("\n</style>\n")])])]),s("ol",{attrs:{start:"8"}},[s("li",[t._v("在页面通过uview-plus的"),s("RouterLink",{attrs:{to:"/components/icon.html"}},[t._v("Icon")]),t._v('组件使用图标，图标名称为您在阿里图标库中点击"编辑图标"时的"Font Class / Symbol"(该值可修改，每次修改都需重新下载"iconfont.css"放到uni-app目中，\n覆盖原来的"iconfont.css")')],1)]),t._v(" "),s("img",{attrs:{src:t.$withBase("/custom_icon/custom_icon_7.png")}}),t._v(" "),s("p",[t._v('如上图，我们得到"backspace"值，使用如下：')]),t._v(" "),s("div",{staticClass:"language-html extra-class"},[s("pre",{pre:!0,attrs:{class:"language-html"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("up-icon")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("backspace"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("custom-prefix")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("custom-icon"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("size")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("30"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("color")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("#888888"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("up-icon")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("从上可以看出，相比uview-plus内置的图标使用，多了一句固定的"),s("code",[t._v('custom-prefix="custom-icon"')]),t._v("，其余使用方法完全相同\n"),s("br"),s("br"),s("br"),s("br")]),t._v(" "),s("p",[s("strong",[t._v("注意")]),t._v('：执行完上面的操作后，您就可以随心所欲的扩展自己的图标了，最重要的是第二步，修改了它，就免了以后每次都要修改"iconfont.css"的多处细节。\n当然，每次新增图标，当您把"iconfont.css"复制至项目中覆盖原来的"iconfont.css"后，都需要执行一遍第5步删掉多余的内容，别忘了修改最后的'),s("code",[t._v(",")]),t._v("为"),s("code",[t._v(";")]),t._v("。")]),t._v(" "),s("p",[t._v("最后提一下，为了多平台兼容性，您应该仅把单色图标添加到阿里图标库的项目中，即使添加了多色的图标，在使用中，也会被转成单色。")]),t._v(" "),s("p",[t._v("祝您使用愉快！")])])}),[],!1,null,null,null);s.default=o.exports}}]);