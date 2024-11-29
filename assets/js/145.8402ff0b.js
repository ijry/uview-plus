(window.webpackJsonp=window.webpackJsonp||[]).push([[145],{639:function(t,s,a){"use strict";a.r(s);var n=a(6),p=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"简要介绍app-use的原理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#简要介绍app-use的原理"}},[t._v("#")]),t._v(" 简要介绍app.use的原理")]),t._v(" "),s("p",[t._v("uview-plus会努力做好框架的内容，同时我们也希望您能学习到一些更深入的知识，我们坚信授之以鱼，不如授之以渔。")]),t._v(" "),s("p",[t._v("当您使用一些第三方插件或者框架时，经常会看到他们的安装引导处会让您写大概如下的内容：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" uviewPlus "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"@/uview-plus"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uviewPlus"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("p",[t._v("这里第一句没什么好说的，我们着重讲第二句"),s("code",[t._v("app.use(uviewPlus)")]),t._v("："),s("br"),t._v("\n这里我们把"),s("code",[t._v("uviewPlus")]),t._v("传递给了"),s("code",[t._v("app.use")]),t._v("，在"),s("code",[t._v("app")]),t._v("内部，是有定义一个"),s("code",[t._v("use")]),t._v("方法的，大概如下：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 这里的plugin参数就是，就是我们通过app.use(uviewPlus)引入的"uview-plus"')]),t._v("\napp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("use")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugin")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Function "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Object")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    \n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ......")]),t._v("\n\t\n\t"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" args "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("toArray")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("arguments"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 这一句很重要，这里的this，就是Vue，把他添加到args数组的第一个元素")]),t._v("\n\targs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("unshift")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 判断我们传递进来的"uview-plus"，也即这里的"plugin"内部是否有一个叫"install"的方法')]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 如果有，就执行我们的"uview-plus"，也即"plugin.install"方法')]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("typeof")]),t._v(" plugin"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("install "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'function'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      plugin"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("plugin"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" args"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("typeof")]),t._v(" plugin "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'function'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("plugin")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("null")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" args"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\t\n\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ......")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("从上面，我们可以看出，app的"),s("code",[t._v("use")]),t._v("方法内部，接受了"),s("code",[t._v("uviewPlus")]),t._v("这个插件，并判断"),s("code",[t._v("uviewPlus")]),t._v("内部是否有一个叫"),s("code",[t._v("install")]),t._v("的方法，如果有，就执行它，并且\n通过"),s("code",[t._v("apply")]),t._v("方法把数组当做参数传递进去(这里数组内部第一个元素"),s("code",[t._v("app")]),t._v("这个Vue对象实例，见上方注释，"),s("code",[t._v("apply")]),t._v("可以把数组[arg1, agr2]形式拆成(arg1, agr2)的形式)")]),t._v(" "),s("p",[t._v("有了上面的分析，我们知道uview-plus内部，肯定定义了一个叫"),s("code",[t._v("install")]),t._v("的方法，并且这个方法的第一个参数就是"),s("code",[t._v("app")]),t._v("这个Vue对象实例，uview-plus内部如下：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 这里我们定义了一个叫"install"的变量，它的内容是一个方法(函数)')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 它的第一个参数是Vue对象实例(上面有提到传进来的第一个参数就是app)，我们把$u挂载到了app.config.globalProperties中")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("install")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("app")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tapp"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("globalProperties"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" $u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// 这里我们导出一个对象，内部有一个叫"install"的方法，给上面说的Vue.use调用')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("default")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tinstall\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v('从上面我们可以看出，uview-plus把"$u"挂载到了'),s("code",[t._v("app.config.globalProperties")]),t._v("上，所以我们在项目页面的内部可以使用"),s("code",[t._v("this.$u.xxx")]),t._v("这种形式。")])])}),[],!1,null,null,null);s.default=p.exports}}]);