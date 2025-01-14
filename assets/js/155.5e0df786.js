(window.webpackJsonp=window.webpackJsonp||[]).push([[155],{791:function(e,v,_){"use strict";_.r(v);var n=_(18),r=Object(n.a)({},(function(){var e=this,v=e._self._c;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h2",{attrs:{id:"设计理念"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#设计理念"}},[e._v("#")]),e._v(" 设计理念")]),e._v(" "),v("h4",{attrs:{id:"导航栏"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#导航栏"}},[e._v("#")]),e._v(" 导航栏")]),e._v(" "),v("p",[e._v("uniapp可以通过配置"),v("code",[e._v("pages.json")]),e._v("生成原生元素的导航栏，简要说明如下：")]),e._v(" "),v("ul",[v("li",[e._v("优点是可以快速渲染，配置便捷，还可以带入一部分原生内容(针对App Store)")]),e._v(" "),v("li",[e._v("缺点是配置不够灵活，遮罩无法覆盖导航栏等")])]),e._v(" "),v("p",[e._v("建议：")]),e._v(" "),v("ul",[v("li",[e._v("如果开发者使用nvue，可以直接自定义导航栏，无需使用uniapp自带的")]),e._v(" "),v("li",[e._v("如果是普通的vue页面，直接使用uniapp自带导航栏。如果自带的不能满足，条件允许就用"),v("code",[e._v("subNVue")]),e._v("绘制，否则就用普通元素绘制")])]),e._v(" "),v("p",[e._v("说明：uni官方有关于导航栏的详细说明，请参见"),v("a",{attrs:{href:"https://uniapp.dcloud.io/collocation/pages?id=customnav",target:"_blank",rel:"noopener noreferrer"}},[e._v("自定义导航栏"),v("OutboundLink")],1)]),e._v(" "),v("h4",{attrs:{id:"关于nvue"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#关于nvue"}},[e._v("#")]),e._v(" 关于nvue")]),e._v(" "),v("p",[e._v("nvue源自于uniapp引入的阿里weex开源原生渲染引擎，单weex来说，是不推荐使用的，因为它没有周边的生态和第三方的功能。"),v("br"),e._v("\nuniapp引入weex之后，一直在整合，但也没有对weex进行定制开发，在APP端某些需要性能相关的可以使用nvue，以下是我们对nvue的一些见解：")]),e._v(" "),v("ul",[v("li",[e._v("nvue具有媲美"),v("code",[e._v("react native")]),e._v("的性能，uniapp一直在打通vue和nvue的壁垒")]),e._v(" "),v("li",[e._v("nvue页面中还不能像写vue一样便利，比如对样式的限制，api还不能和vue完全互通等")])]),e._v(" "),v("p",[e._v("建议：uniapp一直在强化vue，重心不在nvue，如果不是特别复杂的应用，可以直接使用vue开发，应用的首页(V3版本)使用"),v("code",[e._v("nvue")]),e._v("，渲染的速度会有显著的提升，\n如果有需要进一步了解，请参见"),v("a",{attrs:{href:"https://uniapp.dcloud.io/use-weex?id=nvue%E5%BC%80%E5%8F%91%E4%B8%8Evue%E5%BC%80%E5%8F%91%E7%9A%84%E5%B8%B8%E8%A7%81%E5%8C%BA%E5%88%AB",target:"_blank",rel:"noopener noreferrer"}},[e._v("nvue开发与vue开发的常见区别"),v("OutboundLink")],1)]),e._v(" "),v("h4",{attrs:{id:"关于单位"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#关于单位"}},[e._v("#")]),e._v(" 关于单位")]),e._v(" "),v("p",[e._v("我们在web中，常用的是"),v("code",[e._v("px")]),e._v("，"),v("code",[e._v("rem")]),e._v("等单位，"),v("code",[e._v("rem")]),e._v("在uniapp中不推荐使用，我们分别做如下阐述：")]),e._v(" "),v("p",[e._v("web中：\n可以使用"),v("code",[e._v("px")]),e._v("，它属于静态单位，它的最终呈现尺寸不会和屏幕尺寸有关系")]),e._v(" "),v("p",[e._v("uniapp中(vue和nvue)："),v("br"),e._v(" "),v("code",[e._v("px")]),e._v("属于静态单位，uni中还有"),v("code",[e._v("upx")]),e._v("和"),v("code",[e._v("rpx")]),e._v("单位，"),v("code",[e._v("upx")]),e._v("为uniapp成立之初的动态单位，后来各家小程序跟随微信小程序，都使用\n"),v("code",[e._v("rpx")]),e._v("单位，使它成为了既定的事实标准，uniapp也就提倡并官宣使用"),v("code",[e._v("rpx")]),e._v("单位，但是"),v("code",[e._v("upx")]),e._v("也一样能使用，和"),v("code",[e._v("rpx")]),e._v("效果相同。"),v("br"),e._v("\n另外：uniapp，vh和vw也完全可以使用的，一般我们需要让某个元素高度铺满整个屏幕时，可以设置高度为"),v("code",[e._v("100vh")]),e._v("。")]),e._v(" "),v("p",[e._v("weex中：\n这里说的是阿里的weex，而不是uniapp改良后的nvue版本中的weex，它的"),v("code",[e._v("px")]),e._v("单位和uniapp中的"),v("code",[e._v("rpx")]),e._v("或者"),v("code",[e._v("upx")]),e._v("是一样的，也属于\n动态单位，它自创了个"),v("code",[e._v("wx")]),e._v("单位，和web中的"),v("code",[e._v("px")]),e._v("一样，属于静态单位。"),v("br"),e._v("\n说明：uniapp的nvue版本中，虽然也是引入weex，但是改良后，没有了"),v("code",[e._v("wx")]),e._v("，"),v("code",[e._v("nvue")]),e._v("的"),v("code",[e._v("rpx")]),e._v("("),v("code",[e._v("upx")]),e._v(")与"),v("code",[e._v("px")]),e._v("和uniapp的vue版本单位效果一致。")]),e._v(" "),v("p",[e._v("建议：开发中，只需谨记两个单位，"),v("code",[e._v("px")]),e._v("和"),v("code",[e._v("rpx")]),e._v("，一般情况下，我们推荐字体和宽高等，都使用"),v("code",[e._v("rpx")]),e._v("单位，如果真的需要固定尺寸，就是用"),v("code",[e._v("px")]),e._v("。\n如果关于各单位和他们的由来历史，还需要进一步了解，可以参见"),v("a",{attrs:{href:"https://uniapp.dcloud.io/frame?id=%E5%B0%BA%E5%AF%B8%E5%8D%95%E4%BD%8D",target:"_blank",rel:"noopener noreferrer"}},[e._v("尺寸单位"),v("OutboundLink")],1)]),e._v(" "),v("h4",{attrs:{id:"布局"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#布局"}},[e._v("#")]),e._v(" 布局")]),e._v(" "),v("p",[e._v("为兼容多端运行，我们建议开发者使用"),v("code",[e._v("flex")]),e._v("，不要使用"),v("code",[e._v("float")]),e._v("布局。移动端使用"),v("code",[e._v("flex")]),e._v("是没有顾虑的，而"),v("code",[e._v("flex")]),e._v("布局，可以达到事半功倍的效果。"),v("br"),e._v("\n如果不熟悉"),v("code",[e._v("flex")]),e._v("，可以参考"),v("a",{attrs:{href:"http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("阮一峰的flex教程"),v("OutboundLink")],1)]),e._v(" "),v("h4",{attrs:{id:"简要介绍vue-use的原理"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#简要介绍vue-use的原理"}},[e._v("#")]),e._v(" 简要介绍Vue.use的原理")]),e._v(" "),v("p",[e._v("uview-plus的引用，用到了"),v("code",[e._v("Vue.use")]),e._v("的，我们想借此机会，向您解释一下"),v("code",[e._v("Vue.use")]),e._v("的原理，详见"),v("RouterLink",{attrs:{to:"/components/vueuse.html"}},[e._v("简要介绍Vue.use的原理")])],1)])}),[],!1,null,null,null);v.default=r.exports}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9kb2NzL2d1aWRlL2Rlc2lnbi5tZCIsIndlYnBhY2s6Ly8vLi9kb2NzL2d1aWRlL2Rlc2lnbi5tZD9mNjZkIl0sIm5hbWVzIjpbImNvbXBvbmVudCIsIl92bSIsInRoaXMiLCJfYyIsIl9zZWxmIiwiYXR0cnMiLCIkcGFyZW50Iiwic2xvdEtleSIsInN0YXRpY0NsYXNzIiwiX3YiXSwibWFwcGluZ3MiOiJtR0FBQSxJLFFDTUlBLEVBQVksWUFMSCxJRERBLFdBQWtCLElBQUlDLEVBQUlDLEtBQUtDLEVBQUdGLEVBQUlHLE1BQU1ELEdBQUcsT0FBT0EsRUFBRywwQkFBMEIsQ0FBQ0UsTUFBTSxDQUFDLFdBQVdKLEVBQUlLLFFBQVFDLFVBQVUsQ0FBQ0osRUFBRyxLQUFLLENBQUNFLE1BQU0sQ0FBQyxHQUFLLFNBQVMsQ0FBQ0YsRUFBRyxJQUFJLENBQUNLLFlBQVksZ0JBQWdCSCxNQUFNLENBQUMsS0FBTyxVQUFVLENBQUNKLEVBQUlRLEdBQUcsT0FBT1IsRUFBSVEsR0FBRyxXQUFXUixFQUFJUSxHQUFHLEtBQUtOLEVBQUcsS0FBSyxDQUFDRSxNQUFNLENBQUMsR0FBSyxRQUFRLENBQUNGLEVBQUcsSUFBSSxDQUFDSyxZQUFZLGdCQUFnQkgsTUFBTSxDQUFDLEtBQU8sU0FBUyxDQUFDSixFQUFJUSxHQUFHLE9BQU9SLEVBQUlRLEdBQUcsVUFBVVIsRUFBSVEsR0FBRyxLQUFLTixFQUFHLElBQUksQ0FBQ0YsRUFBSVEsR0FBRyxnQkFBZ0JOLEVBQUcsT0FBTyxDQUFDRixFQUFJUSxHQUFHLGdCQUFnQlIsRUFBSVEsR0FBRyx3QkFBd0JSLEVBQUlRLEdBQUcsS0FBS04sRUFBRyxLQUFLLENBQUNBLEVBQUcsS0FBSyxDQUFDRixFQUFJUSxHQUFHLDhDQUE4Q1IsRUFBSVEsR0FBRyxLQUFLTixFQUFHLEtBQUssQ0FBQ0YsRUFBSVEsR0FBRyw0QkFBNEJSLEVBQUlRLEdBQUcsS0FBS04sRUFBRyxJQUFJLENBQUNGLEVBQUlRLEdBQUcsU0FB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LEVBQUlRLEdBQUcsT0FBT1IsRUFBSVEsR0FBRyxxQkFBcUJSLEVBQUlRLEdBQUcsS0FBS04sRUFBRyxJQUFJLENBQUNGLEVBQUlRLEdBQUcscUJBQXFCTixFQUFHLE9BQU8sQ0FBQ0YsRUFBSVEsR0FBRyxhQUFhUixFQUFJUSxHQUFHLG9CQUFvQk4sRUFBRyxPQUFPLENBQUNGLEVBQUlRLEdBQUcsYUFBYVIsRUFBSVEsR0FBRyxVQUFVTixFQUFHLGFBQWEsQ0FBQ0UsTUFBTSxDQUFDLEdBQUssNEJBQTRCLENBQUNKLEVBQUlRLEdBQUcscUJBQXFCLE9BRXJpSyxJQ1FwQixFQUNBLEtBQ0EsS0FDQSxNQUlhLFVBQUFULEUiLCJmaWxlIjoiYXNzZXRzL2pzLzE1NS41ZTBkZjc4Ni5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKXt2YXIgX3ZtPXRoaXMsX2M9X3ZtLl9zZWxmLl9jO3JldHVybiBfYygnQ29udGVudFNsb3RzRGlzdHJpYnV0b3InLHthdHRyczp7XCJzbG90LWtleVwiOl92bS4kcGFyZW50LnNsb3RLZXl9fSxbX2MoJ2gyJyx7YXR0cnM6e1wiaWRcIjpcIuiuvuiuoeeQhuW/tVwifX0sW19jKCdhJyx7c3RhdGljQ2xhc3M6XCJoZWFkZXItYW5jaG9yXCIsYXR0cnM6e1wiaHJlZlwiOlwiI+iuvuiuoeeQhuW/tVwifX0sW192bS5fdihcIiNcIildKSxfdm0uX3YoXCIg6K6+6K6h55CG5b+1XCIpXSksX3ZtLl92KFwiIFwiKSxfYygnaDQnLHthdHRyczp7XCJpZFwiOlwi5a+86Iiq5qCPXCJ9fSxbX2MoJ2EnLHtzdGF0aWNDbGFzczpcImhlYWRlci1hbmNob3JcIixhdHRyczp7XCJocmVmXCI6XCIj5a+86Iiq5qCPXCJ9fSxbX3ZtLl92KFwiI1wiKV0pLF92bS5fdihcIiDlr7zoiKrmoI9cIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwidW5pYXBw5Y+v5Lul6YCa6L+H6YWN572uXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicGFnZXMuanNvblwiKV0pLF92bS5fdihcIueUn+aIkOWOn+eUn+WFg+e0oOeahOWvvOiIquagj++8jOeugOimgeivtOaYjuWmguS4i++8mlwiKV0pLF92bS5fdihcIiBcIiksX2MoJ3VsJyxbX2MoJ2xpJyxbX3ZtLl92KFwi5LyY54K55piv5Y+v5Lul5b+r6YCf5riy5p+T77yM6YWN572u5L6/5o2377yM6L+Y5Y+v5Lul5bim5YWl5LiA6YOo5YiG5Y6f55Sf5YaF5a65KOmSiOWvuUFwcCBTdG9yZSlcIildKSxfdm0uX3YoXCIgXCIpLF9jKCdsaScsW192bS5fdihcIue8uueCueaYr+mFjee9ruS4jeWkn+eBtea0u++8jOmBrue9qeaXoOazleimhuebluWvvOiIquagj+etiVwiKV0pXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcIuW7uuiuru+8mlwiKV0pLF92bS5fdihcIiBcIiksX2MoJ3VsJyxbX2MoJ2xpJyxbX3ZtLl92KFwi5aaC5p6c5byA5Y+R6ICF5L2/55SobnZ1Ze+8jOWPr+S7peebtOaOpeiHquWumuS5ieWvvOiIquagj++8jOaXoOmcgOS9v+eUqHVuaWFwcOiHquW4pueahFwiKV0pLF92bS5fdihcIiBcIiksX2MoJ2xpJyxbX3ZtLl92KFwi5aaC5p6c5piv5pmu6YCa55qEdnVl6aG16Z2i77yM55u05o6l5L2/55SodW5pYXBw6Ieq5bim5a+86Iiq5qCP44CC5aaC5p6c6Ieq5bim55qE5LiN6IO95ruh6Laz77yM5p2h5Lu25YWB6K645bCx55SoXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwic3ViTlZ1ZVwiKV0pLF92bS5fdihcIue7mOWItu+8jOWQpuWImeWwseeUqOaZrumAmuWFg+e0oOe7mOWItlwiKV0pXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcIuivtOaYju+8mnVuaeWumOaWueacieWFs+S6juWvvOiIquagj+eahOivpue7huivtOaYju+8jOivt+WPguingVwiKSxfYygnYScse2F0dHJzOntcImhyZWZcIjpcImh0dHBzOi8vdW5pYXBwLmRjbG91ZC5pby9jb2xsb2NhdGlvbi9wYWdlcz9pZD1jdXN0b21uYXZcIixcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJyZWxcIjpcIm5vb3BlbmVyIG5vcmVmZXJyZXJcIn19LFtfdm0uX3YoXCLoh6rlrprkuYnlr7zoiKrmoI9cIiksX2MoJ091dGJvdW5kTGluaycpXSwxKV0pLF92bS5fdihcIiBcIiksX2MoJ2g0Jyx7YXR0cnM6e1wiaWRcIjpcIuWFs+S6jm52dWVcIn19LFtfYygnYScse3N0YXRpY0NsYXNzOlwiaGVhZGVyLWFuY2hvclwiLGF0dHJzOntcImhyZWZcIjpcIiPlhbPkuo5udnVlXCJ9fSxbX3ZtLl92KFwiI1wiKV0pLF92bS5fdihcIiDlhbPkuo5udnVlXCIpXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcIm52dWXmupDoh6rkuo51bmlhcHDlvJXlhaXnmoTpmL/ph4x3ZWV45byA5rqQ5Y6f55Sf5riy5p+T5byV5pOO77yM5Y2Vd2VleOadpeivtO+8jOaYr+S4jeaOqOiNkOS9v+eUqOeahO+8jOWboOS4uuWug+ayoeacieWRqOi+ueeahOeUn+aAgeWSjOesrOS4ieaWueeahOWKn+iDveOAglwiKSxfYygnYnInKSxfdm0uX3YoXCJcXG51bmlhcHDlvJXlhaV3ZWV45LmL5ZCO77yM5LiA55u05Zyo5pW05ZCI77yM5L2G5Lmf5rKh5pyJ5a+5d2VleOi/m+ihjOWumuWItuW8gOWPke+8jOWcqEFQUOerr+afkOS6m+mcgOimgeaAp+iDveebuOWFs+eahOWPr+S7peS9v+eUqG52dWXvvIzku6XkuIvmmK/miJHku6zlr7ludnVl55qE5LiA5Lqb6KeB6Kej77yaXCIpXSksX3ZtLl92KFwiIFwiKSxfYygndWwnLFtfYygnbGknLFtfdm0uX3YoXCJudnVl5YW35pyJ5aqy576OXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicmVhY3QgbmF0aXZlXCIpXSksX3ZtLl92KFwi55qE5oCn6IO977yMdW5pYXBw5LiA55u05Zyo5omT6YCadnVl5ZKMbnZ1ZeeahOWjgeWeklwiKV0pLF92bS5fdihcIiBcIiksX2MoJ2xpJyxbX3ZtLl92KFwibnZ1ZemhtemdouS4rei/mOS4jeiDveWDj+WGmXZ1ZeS4gOagt+S+v+WIqe+8jOavlOWmguWvueagt+W8j+eahOmZkOWItu+8jGFwaei/mOS4jeiDveWSjHZ1ZeWujOWFqOS6kumAmuetiVwiKV0pXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcIuW7uuiuru+8mnVuaWFwcOS4gOebtOWcqOW8uuWMlnZ1Ze+8jOmHjeW/g+S4jeWcqG52dWXvvIzlpoLmnpzkuI3mmK/nibnliKvlpI3mnYLnmoTlupTnlKjvvIzlj6/ku6Xnm7TmjqXkvb/nlKh2dWXlvIDlj5HvvIzlupTnlKjnmoTpppbpobUoVjPniYjmnKwp5L2/55SoXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwibnZ1ZVwiKV0pLF92bS5fdihcIu+8jOa4suafk+eahOmAn+W6puS8muacieaYvuiRl+eahOaPkOWNh++8jFxcbuWmguaenOaciemcgOimgei/m+S4gOatpeS6huino++8jOivt+WPguingVwiKSxfYygnYScse2F0dHJzOntcImhyZWZcIjpcImh0dHBzOi8vdW5pYXBwLmRjbG91ZC5pby91c2Utd2VleD9pZD1udnVlJUU1JUJDJTgwJUU1JThGJTkxJUU0JUI4JThFdnVlJUU1JUJDJTgwJUU1JThGJTkxJUU3JTlBJTg0JUU1JUI4JUI4JUU4JUE3JTgxJUU1JThDJUJBJUU1JTg4JUFCXCIsXCJ0YXJnZXRcIjpcIl9ibGFua1wiLFwicmVsXCI6XCJub29wZW5lciBub3JlZmVycmVyXCJ9fSxbX3ZtLl92KFwibnZ1ZeW8gOWPkeS4jnZ1ZeW8gOWPkeeahOW4uOingeWMuuWIq1wiKSxfYygnT3V0Ym91bmRMaW5rJyldLDEpXSksX3ZtLl92KFwiIFwiKSxfYygnaDQnLHthdHRyczp7XCJpZFwiOlwi5YWz5LqO5Y2V5L2NXCJ9fSxbX2MoJ2EnLHtzdGF0aWNDbGFzczpcImhlYWRlci1hbmNob3JcIixhdHRyczp7XCJocmVmXCI6XCIj5YWz5LqO5Y2V5L2NXCJ9fSxbX3ZtLl92KFwiI1wiKV0pLF92bS5fdihcIiDlhbPkuo7ljZXkvY1cIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwi5oiR5Lus5Zyod2Vi5Lit77yM5bi455So55qE5pivXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicHhcIildKSxfdm0uX3YoXCLvvIxcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJyZW1cIildKSxfdm0uX3YoXCLnrYnljZXkvY3vvIxcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJyZW1cIildKSxfdm0uX3YoXCLlnKh1bmlhcHDkuK3kuI3mjqjojZDkvb/nlKjvvIzmiJHku6zliIbliKvlgZrlpoLkuIvpmJDov7DvvJpcIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwid2Vi5Lit77yaXFxu5Y+v5Lul5L2/55SoXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicHhcIildKSxfdm0uX3YoXCLvvIzlroPlsZ7kuo7pnZnmgIHljZXkvY3vvIzlroPnmoTmnIDnu4jlkYjnjrDlsLrlr7jkuI3kvJrlkozlsY/luZXlsLrlr7jmnInlhbPns7tcIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwidW5pYXBw5LitKHZ1ZeWSjG52dWUp77yaXCIpLF9jKCdicicpLF92bS5fdihcIiBcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJweFwiKV0pLF92bS5fdihcIuWxnuS6jumdmeaAgeWNleS9je+8jHVuaeS4rei/mOaciVwiKSxfYygnY29kZScsW192bS5fdihcInVweFwiKV0pLF92bS5fdihcIuWSjFwiKSxfYygnY29kZScsW192bS5fdihcInJweFwiKV0pLF92bS5fdihcIuWNleS9je+8jFwiKSxfYygnY29kZScsW192bS5fdihcInVweFwiKV0pLF92bS5fdihcIuS4unVuaWFwcOaIkOeri+S5i+WIneeahOWKqOaAgeWNleS9je+8jOWQjuadpeWQhOWutuWwj+eoi+W6j+i3n+maj+W+ruS/oeWwj+eoi+W6j++8jOmDveS9v+eUqFxcblwiKSxfYygnY29kZScsW192bS5fdihcInJweFwiKV0pLF92bS5fdihcIuWNleS9je+8jOS9v+Wug+aIkOS4uuS6huaXouWumueahOS6i+Wunuagh+WHhu+8jHVuaWFwcOS5n+WwseaPkOWAoeW5tuWumOWuo+S9v+eUqFwiKSxfYygnY29kZScsW192bS5fdihcInJweFwiKV0pLF92bS5fdihcIuWNleS9je+8jOS9huaYr1wiKSxfYygnY29kZScsW192bS5fdihcInVweFwiKV0pLF92bS5fdihcIuS5n+S4gOagt+iDveS9v+eUqO+8jOWSjFwiKSxfYygnY29kZScsW192bS5fdihcInJweFwiKV0pLF92bS5fdihcIuaViOaenOebuOWQjOOAglwiKSxfYygnYnInKSxfdm0uX3YoXCJcXG7lj6blpJbvvJp1bmlhcHDvvIx2aOWSjHZ35Lmf5a6M5YWo5Y+v5Lul5L2/55So55qE77yM5LiA6Iis5oiR5Lus6ZyA6KaB6K6p5p+Q5Liq5YWD57Sg6auY5bqm6ZO65ruh5pW05Liq5bGP5bmV5pe277yM5Y+v5Lul6K6+572u6auY5bqm5Li6XCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwiMTAwdmhcIildKSxfdm0uX3YoXCLjgIJcIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwid2VleOS4re+8mlxcbui/memHjOivtOeahOaYr+mYv+mHjOeahHdlZXjvvIzogIzkuI3mmK91bmlhcHDmlLnoia/lkI7nmoRudnVl54mI5pys5Lit55qEd2VleO+8jOWug+eahFwiKSxfYygnY29kZScsW192bS5fdihcInB4XCIpXSksX3ZtLl92KFwi5Y2V5L2N5ZKMdW5pYXBw5Lit55qEXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicnB4XCIpXSksX3ZtLl92KFwi5oiW6ICFXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwidXB4XCIpXSksX3ZtLl92KFwi5piv5LiA5qC355qE77yM5Lmf5bGe5LqOXFxu5Yqo5oCB5Y2V5L2N77yM5a6D6Ieq5Yib5LqG5LiqXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwid3hcIildKSxfdm0uX3YoXCLljZXkvY3vvIzlkox3ZWLkuK3nmoRcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJweFwiKV0pLF92bS5fdihcIuS4gOagt++8jOWxnuS6jumdmeaAgeWNleS9jeOAglwiKSxfYygnYnInKSxfdm0uX3YoXCJcXG7or7TmmI7vvJp1bmlhcHDnmoRudnVl54mI5pys5Lit77yM6Jm954S25Lmf5piv5byV5YWld2VleO+8jOS9huaYr+aUueiJr+WQju+8jOayoeacieS6hlwiKSxfYygnY29kZScsW192bS5fdihcInd4XCIpXSksX3ZtLl92KFwi77yMXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwibnZ1ZVwiKV0pLF92bS5fdihcIueahFwiKSxfYygnY29kZScsW192bS5fdihcInJweFwiKV0pLF92bS5fdihcIihcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJ1cHhcIildKSxfdm0uX3YoXCIp5LiOXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicHhcIildKSxfdm0uX3YoXCLlkox1bmlhcHDnmoR2dWXniYjmnKzljZXkvY3mlYjmnpzkuIDoh7TjgIJcIildKSxfdm0uX3YoXCIgXCIpLF9jKCdwJyxbX3ZtLl92KFwi5bu66K6u77ya5byA5Y+R5Lit77yM5Y+q6ZyA6LCo6K6w5Lik5Liq5Y2V5L2N77yMXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwicHhcIildKSxfdm0uX3YoXCLlkoxcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJycHhcIildKSxfdm0uX3YoXCLvvIzkuIDoiKzmg4XlhrXkuIvvvIzmiJHku6zmjqjojZDlrZfkvZPlkozlrr3pq5jnrYnvvIzpg73kvb/nlKhcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJycHhcIildKSxfdm0uX3YoXCLljZXkvY3vvIzlpoLmnpznnJ/nmoTpnIDopoHlm7rlrprlsLrlr7jvvIzlsLHmmK/nlKhcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJweFwiKV0pLF92bS5fdihcIuOAglxcbuWmguaenOWFs+S6juWQhOWNleS9jeWSjOS7luS7rOeahOeUseadpeWOhuWPsu+8jOi/mOmcgOimgei/m+S4gOatpeS6huino++8jOWPr+S7peWPguingVwiKSxfYygnYScse2F0dHJzOntcImhyZWZcIjpcImh0dHBzOi8vdW5pYXBwLmRjbG91ZC5pby9mcmFtZT9pZD0lRTUlQjAlQkElRTUlQUYlQjglRTUlOEQlOTUlRTQlQkQlOERcIixcInRhcmdldFwiOlwiX2JsYW5rXCIsXCJyZWxcIjpcIm5vb3BlbmVyIG5vcmVmZXJyZXJcIn19LFtfdm0uX3YoXCLlsLrlr7jljZXkvY1cIiksX2MoJ091dGJvdW5kTGluaycpXSwxKV0pLF92bS5fdihcIiBcIiksX2MoJ2g0Jyx7YXR0cnM6e1wiaWRcIjpcIuW4g+WxgFwifX0sW19jKCdhJyx7c3RhdGljQ2xhc3M6XCJoZWFkZXItYW5jaG9yXCIsYXR0cnM6e1wiaHJlZlwiOlwiI+W4g+WxgFwifX0sW192bS5fdihcIiNcIildKSxfdm0uX3YoXCIg5biD5bGAXCIpXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcIuS4uuWFvOWuueWkmuerr+i/kOihjO+8jOaIkeS7rOW7uuiuruW8gOWPkeiAheS9v+eUqFwiKSxfYygnY29kZScsW192bS5fdihcImZsZXhcIildKSxfdm0uX3YoXCLvvIzkuI3opoHkvb/nlKhcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJmbG9hdFwiKV0pLF92bS5fdihcIuW4g+WxgOOAguenu+WKqOerr+S9v+eUqFwiKSxfYygnY29kZScsW192bS5fdihcImZsZXhcIildKSxfdm0uX3YoXCLmmK/msqHmnInpob7omZHnmoTvvIzogIxcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJmbGV4XCIpXSksX3ZtLl92KFwi5biD5bGA77yM5Y+v5Lul6L6+5Yiw5LqL5Y2K5Yqf5YCN55qE5pWI5p6c44CCXCIpLF9jKCdicicpLF92bS5fdihcIlxcbuWmguaenOS4jeeGn+aCiVwiKSxfYygnY29kZScsW192bS5fdihcImZsZXhcIildKSxfdm0uX3YoXCLvvIzlj6/ku6Xlj4LogINcIiksX2MoJ2EnLHthdHRyczp7XCJocmVmXCI6XCJodHRwOi8vd3d3LnJ1YW55aWZlbmcuY29tL2Jsb2cvMjAxNS8wNy9mbGV4LWdyYW1tYXIuaHRtbFwiLFwidGFyZ2V0XCI6XCJfYmxhbmtcIixcInJlbFwiOlwibm9vcGVuZXIgbm9yZWZlcnJlclwifX0sW192bS5fdihcIumYruS4gOWzsOeahGZsZXjmlZnnqItcIiksX2MoJ091dGJvdW5kTGluaycpXSwxKV0pLF92bS5fdihcIiBcIiksX2MoJ2g0Jyx7YXR0cnM6e1wiaWRcIjpcIueugOimgeS7i+e7jXZ1ZS11c2XnmoTljp/nkIZcIn19LFtfYygnYScse3N0YXRpY0NsYXNzOlwiaGVhZGVyLWFuY2hvclwiLGF0dHJzOntcImhyZWZcIjpcIiPnroDopoHku4vnu412dWUtdXNl55qE5Y6f55CGXCJ9fSxbX3ZtLl92KFwiI1wiKV0pLF92bS5fdihcIiDnroDopoHku4vnu41WdWUudXNl55qE5Y6f55CGXCIpXSksX3ZtLl92KFwiIFwiKSxfYygncCcsW192bS5fdihcInV2aWV3LXBsdXPnmoTlvJXnlKjvvIznlKjliLDkuoZcIiksX2MoJ2NvZGUnLFtfdm0uX3YoXCJWdWUudXNlXCIpXSksX3ZtLl92KFwi55qE77yM5oiR5Lus5oOz5YCf5q2k5py65Lya77yM5ZCR5oKo6Kej6YeK5LiA5LiLXCIpLF9jKCdjb2RlJyxbX3ZtLl92KFwiVnVlLnVzZVwiKV0pLF92bS5fdihcIueahOWOn+eQhu+8jOivpuingVwiKSxfYygnUm91dGVyTGluaycse2F0dHJzOntcInRvXCI6XCIvY29tcG9uZW50cy92dWV1c2UuaHRtbFwifX0sW192bS5fdihcIueugOimgeS7i+e7jVZ1ZS51c2XnmoTljp/nkIZcIildKV0sMSldKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5cbmV4cG9ydCB7IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zIH0iLCJpbXBvcnQgeyByZW5kZXIsIHN0YXRpY1JlbmRlckZucyB9IGZyb20gXCIuL2Rlc2lnbi5tZD92dWUmdHlwZT10ZW1wbGF0ZSZpZD0yYjExNGRjOVwiXG52YXIgc2NyaXB0ID0ge31cblxuXG4vKiBub3JtYWxpemUgY29tcG9uZW50ICovXG5pbXBvcnQgbm9ybWFsaXplciBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9ydW50aW1lL2NvbXBvbmVudE5vcm1hbGl6ZXIuanNcIlxudmFyIGNvbXBvbmVudCA9IG5vcm1hbGl6ZXIoXG4gIHNjcmlwdCxcbiAgcmVuZGVyLFxuICBzdGF0aWNSZW5kZXJGbnMsXG4gIGZhbHNlLFxuICBudWxsLFxuICBudWxsLFxuICBudWxsXG4gIFxuKVxuXG5leHBvcnQgZGVmYXVsdCBjb21wb25lbnQuZXhwb3J0cyJdLCJzb3VyY2VSb290IjoiIn0=