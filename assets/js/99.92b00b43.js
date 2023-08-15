(window.webpackJsonp=window.webpackJsonp||[]).push([[99],{557:function(t,s,n){"use strict";n.r(s);var a=n(6),e=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"安装"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[t._v("#")]),t._v(" 安装")]),t._v(" "),s("demo-model",{attrs:{url:"/"}}),t._v(" "),s("h3",{attrs:{id:"安装遇到问题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#安装遇到问题"}},[t._v("#")]),t._v(" 安装遇到问题？")]),t._v(" "),s("p",[t._v("为了方便更快的体验uview-plus，不被各种环境问题sdk问题所困扰，特提供了云端一键生成模板，只需要点击一次即可自动生成演示项目，坐等即可。")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://club.cloudstudio.net/261753/11943789224931328",target:"_blank",rel:"noopener noreferrer"}},[s("img",{attrs:{src:"https://cs-res.codehub.cn/common/assets/icon-badge.svg",alt:"Cloud Studio Template"}}),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"hbuilder-x方式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hbuilder-x方式"}},[t._v("#")]),t._v(" Hbuilder X方式")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/components/downloadSetting.html"}},[t._v("下载方式配置文档")])],1),t._v(" "),s("p",[t._v("如果您是使用"),s("code",[t._v("Hbuilder X")]),t._v("开发的用户，您可以在"),s("code",[t._v("uni-app")]),t._v("插件市场通过"),s("code",[t._v("uni_modules")]),t._v("的形式进行安装，此安装方式可以方便您后续在"),s("code",[t._v("uni_modules")]),t._v("对uview-plus进行一键升级。")]),t._v(" "),s("ul",[s("li",[t._v("在uni-app插件市场右上角选择"),s("code",[t._v("uni_modules版本")]),t._v("下的"),s("code",[t._v("使用HBuilderX导入插件")]),t._v("，导入到对应的项目中即可。")])]),t._v(" "),s("p",[s("strong",[t._v("注意：")]),t._v("  此安装方式必须要按照"),s("RouterLink",{attrs:{to:"/components/downloadSetting.html"}},[t._v("下载方式安装的配置")]),t._v("中的说明配置了才可用。")],1),t._v(" "),s("br"),t._v(" "),s("div",{staticClass:"download-link",on:{click:function(s){return t.downloadPost(2)}}},[t._v("\n\t下载地址："),s("a",{attrs:{target:"_blank",href:"https://ext.dcloud.net.cn/plugin?name=uview-plus"}},[t._v("https://ext.dcloud.net.cn/plugin?name=uview-plus")])]),t._v(" "),s("br"),t._v(" "),s("br"),t._v(" "),s("h3",{attrs:{id:"npm方式"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#npm方式"}},[t._v("#")]),t._v(" NPM方式")]),t._v(" "),s("p",[s("RouterLink",{attrs:{to:"/components/npmSetting.html"}},[t._v("npm方式配置文档")])],1),t._v(" "),s("p",[t._v("在项目根目录执行如下命令即可：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 如果您的根目录没有package.json文件的话，请先执行如下命令：")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// npm init -y")]),t._v("\n\nnpm install uview"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("plus\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 更新")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// npm update uview-plus")]),t._v("\n")])])]),s("p",[s("strong",[t._v("注意：")]),t._v("  此安装方式必须要按照"),s("RouterLink",{attrs:{to:"/components/npmSetting.html"}},[t._v("npm方式安装的配置")]),t._v("中的说明配置了才可用，且项目名称不能有"),s("strong",[t._v("中文")]),t._v("字符。")],1),t._v(" "),s("h3",{attrs:{id:"版本查询"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#版本查询"}},[t._v("#")]),t._v(" 版本查询")]),t._v(" "),s("p",[t._v("有两种方式可以查询到正在使用的uview-plus的版本：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 通过`console.log`打印的形式")]),t._v("\nconsole"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uni"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("$u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("v"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 可以查阅uview-plus的配置文件得知当前版本号，具体位置为：")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("uview"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("plus"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("libs"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("config"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("config"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("js\n")])])])],1)}),[],!1,null,null,null);s.default=e.exports}}]);