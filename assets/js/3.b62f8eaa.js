(window.webpackJsonp=window.webpackJsonp||[]).push([[3,25,42,45,98],{296:function(t,e){t.exports=function(t){return null==t}},298:function(t,e,s){},299:function(t,e,s){},300:function(t,e,s){},307:function(t,e,s){},309:function(t,e,s){},310:function(t,e,s){"use strict";s(298)},311:function(t,e,s){},312:function(t,e,s){"use strict";s(299)},313:function(t,e,s){var a=s(18),i=s(3),n=s(13);t.exports=function(t){return"string"==typeof t||!i(t)&&n(t)&&"[object String]"==a(t)}},314:function(t,e,s){"use strict";s(300)},317:function(t,e,s){},320:function(t,e,s){"use strict";s.r(e);var a=s(296),i=s.n(a);const n=/\/$/,o=/^[a-z]+:/i;var r={name:"PageEdit",computed:{lastUpdated(){return this.$page.lastUpdated},lastUpdatedText(){return"string"==typeof this.$themeLocaleConfig.lastUpdated?this.$themeLocaleConfig.lastUpdated:"string"==typeof this.$site.themeConfig.lastUpdated?this.$site.themeConfig.lastUpdated:"Last Updated"},editLink(){const t=i()(this.$page.frontmatter.editLink)?this.$site.themeConfig.editLinks:this.$page.frontmatter.editLink,{repo:e,docsDir:s="",docsBranch:a="master",docsRepo:n=e}=this.$site.themeConfig;return t&&n&&this.$page.relativePath?this.createEditLink(e,n,s,a,this.$page.relativePath):null},editLinkText(){return this.$themeLocaleConfig.editLinkText||this.$site.themeConfig.editLinkText||"Edit this page"}},methods:{createEditLink(t,e,s,a,i){if(/bitbucket.org/.test(e)){return e.replace(n,"")+"/src"+`/${a}/`+(s?s.replace(n,"")+"/":"")+i+`?mode=edit&spa=0&at=${a}&fileviewer=file-view-default`}if(/gitlab.com/.test(e)){return e.replace(n,"")+"/-/edit"+`/${a}/`+(s?s.replace(n,"")+"/":"")+i}return(o.test(e)?e:"https://github.com/"+e).replace(n,"")+"/edit"+`/${a}/`+(s?s.replace(n,"")+"/":"")+i}}},l=(s(312),s(6)),c=Object(l.a)(r,(function(){var t=this,e=t._self._c;return e("footer",{staticClass:"page-edit"},[e("bottom-ad"),t._v(" "),t.editLink?e("div",{staticClass:"edit-link"},[e("a",{attrs:{href:t.editLink,target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.editLinkText))]),t._v(" "),e("OutboundLink")],1):t._e(),t._v(" "),t.lastUpdated?e("div",{staticClass:"last-updated"},[e("span",{staticClass:"prefix"},[t._v(t._s(t.lastUpdatedText)+":")]),t._v(" "),e("span",{staticClass:"time"},[t._v(t._s(t.lastUpdated))])]):t._e()],1)}),[],!1,null,null,null);e.default=c.exports},321:function(t,e,s){"use strict";s.r(e);var a=s(287),i=s(313),n=s.n(i),o=s(296),r=s.n(o),l={name:"PageNav",props:["sidebarItems"],computed:{prev(){return u(c.PREV,this)},next(){return u(c.NEXT,this)}}};const c={NEXT:{resolveLink:function(t,e){return h(t,e,1)},getThemeLinkConfig:({nextLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.next},PREV:{resolveLink:function(t,e){return h(t,e,-1)},getThemeLinkConfig:({prevLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.prev}};function u(t,{$themeConfig:e,$page:s,$route:i,$site:o,sidebarItems:l}){const{resolveLink:c,getThemeLinkConfig:u,getPageLinkConfig:h}=t,d=u(e),p=h(s),g=r()(p)?d:p;return!1===g?void 0:n()(g)?Object(a.i)(o.pages,g,i.path):c(s,l)}function h(t,e,s){const a=[];!function t(e,s){for(let a=0,i=e.length;a<i;a++)"group"===e[a].type?t(e[a].children||[],s):s.push(e[a])}(e,a);for(let e=0;e<a.length;e++){const i=a[e];if("page"===i.type&&i.path===decodeURIComponent(t.path))return a[e+s]}}var d=l,p=(s(314),s(6)),g=Object(p.a)(d,(function(){var t=this,e=t._self._c;return t.prev||t.next?e("div",{staticClass:"page-nav"},[e("p",{staticClass:"inner"},[t.prev?e("span",{staticClass:"prev"},[t._v("\n      ←\n      "),"external"===t.prev.type?e("a",{staticClass:"prev",attrs:{href:t.prev.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{staticClass:"prev",attrs:{to:t.prev.path}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n      ")])],1):t._e(),t._v(" "),t.next?e("span",{staticClass:"next"},["external"===t.next.type?e("a",{attrs:{href:t.next.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{attrs:{to:t.next.path}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n      ")]),t._v("\n      →\n    ")],1):t._e()])]):t._e()}),[],!1,null,null,null);e.default=g.exports},322:function(t,e,s){"use strict";s.r(e);var a=s(290),i=s.n(a),n={data:()=>({id:"",adDialog:!1,qrDialog:!1,qrUrl:"",watchEnd:!1,loadingInstance:null,timer:null,check:null,whiteList:["/user/login.html"]}),created(){},mounted(){setTimeout(()=>{this.checkVip()},1e3),this.timer||(this.timer=setInterval(()=>{},1e4)),this.check=setInterval(()=>{this.checkDisplay()},5e3)},beforeDestroy(){clearInterval(this.check)},watch:{$route(t,e){this.checkVip()}},methods:{inWl(){return!!this.$route.path.startsWith("/guide/")||(!!this.$route.path.startsWith("/cooperation/")||(!!this.$route.path.startsWith("/user/")||this.whiteList.includes(this.$route.path)))},checkVip(){if(this.inWl())this.qrDialog=!1;else{if("undefined"!=typeof window&&window.localStorage){let t=localStorage.getItem("adExpire");if(!t||Date.parse(new Date)/1e3>t||t-Date.parse(new Date)/1e3>43200)return this.qrDialog=!0,void this.watchAd()}this.qrDialog=!1}},openDialog(){this.qrDialog=!0},checkDisplay(){const t=document.getElementById("vip-box");if(console.log(t),!t)return alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),void(document.documentElement.style.opacity="0");for(var e=document.getElementsByClassName("v-modal"),s=0;s<e.length;s++){"none"===window.getComputedStyle(e[s]).display&&alert("请关闭广告屏蔽器支持我们谢谢！")}},formatDate:t=>`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`,async watchAd(){try{let t=localStorage.getItem("id-"+formatDate);i.a.post("https://uiadmin.net/api/v1/wxapp/ad/add",{id:t||""}).then(t=>{let e=t.data;200===e.code?(this.id=e.data.id,localStorage.setItem("id-"+formatDate,this.id),this.qrUrl=e.data.base64):this.$message.error("出错"+e.msg)})}catch(t){this.$message.error("请求出错")}},async checkEnd(){try{this.$prompt("请输入正确的微信昵称（拼多多）用于广告验证，如未验证成功可间隔10秒重试，更多问题可加QQ598821125。","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputValue:localStorage.getItem("wxnickname")}).then(({value:t})=>{t?(localStorage.setItem("wxnickname",t),i.a.post("https://uiadmin.net/api/v1/wxapp/ad/check?id="+this.id,{wxnickname:t}).then(t=>{let e=t.data;200===e.code?(this.watchEnd=!0,localStorage.setItem("adExpire",Date.parse(new Date)/1e3+43200),this.qrDialog=!1):this.$message.error(e.msg)})):this.$message.error("请正确填写微信昵称")}).catch(()=>{})}catch(t){this.$message.error("检查出错")}}}},o=s(6),r=Object(o.a)(n,(function(){var t=this,e=t._self._c;return e("div",[e("el-dialog",{ref:"myElement",staticClass:"novip",attrs:{id:"vip-box",title:"广告",visible:t.qrDialog,width:"600px","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(e){t.qrDialog=e}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("div",[e("div",[t._v("验证阶段，非必要情况，请勿关闭页面或者刷新页面。")]),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:function(e){return e.stopPropagation(),t.checkEnd.apply(null,arguments)}}},[t._v("已经看完")])],1)]},proxy:!0}])},[e("div",[e("h3",[t._v("请使用微信扫码")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("扫码后请点击“打开广告”蓝色按钮")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("如遇到广告问题可加QQ598821125")]),t._v(" "),e("div",[t._v("\n        感谢对开源软件的支持与理解，现阶段观看广告将有助于uview-plus的可持续发展，特别是在鸿蒙、uni-app-x等方面的开发，我们也在积极探索更好的可持续发展模式，以投入更多的研发能力便于提供更加好用的框架。收集了大家的意见反馈我们正在规划推出社区发帖获得免广告点数，自媒体发短视频教程获得广告点数，提交FastView可视化模板送广告点数，提交项目线上案例送广告点数，帮助其它用户解决问题送广告点数等多种方法，希望能够适应不通的需求，并且能积极推动uview-plus发展。\n      ")]),t._v(" "),e("div",{directives:[{name:"loading",rawName:"v-loading",value:!t.qrUrl,expression:"qrUrl ? false : true"}],staticClass:"pt-3"},[t.qrUrl?e("img",{attrs:{src:t.qrUrl,alt:"mind"}}):t._e()])])])],1)}),[],!1,null,null,null);e.default=r.exports},325:function(t,e,s){"use strict";s.r(e);s(310);var a=s(6),i=Object(a.a)({},(function(){var t=this,e=t._self._c;return e("div",{staticClass:"sidebar-button",on:{click:function(e){return t.$emit("toggle-sidebar")}}},[e("svg",{staticClass:"icon",attrs:{xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",role:"img",viewBox:"0 0 448 512"}},[e("path",{attrs:{fill:"currentColor",d:"M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"}})])])}),[],!1,null,null,null);e.default=i.exports},327:function(t,e,s){"use strict";s(307)},328:function(t,e,s){"use strict";s(309)},329:function(t,e,s){"use strict";s(311)},332:function(t,e,s){"use strict";s(317)},421:function(t,e,s){"use strict";s.r(e);var a=s(124),i=s.n(a),n=(t,e,s=null)=>{let a=i()(e,"title","");return i()(e,"frontmatter.tags")&&(a+=" "+e.frontmatter.tags.join(" ")),s&&(a+=" "+s),o(t,a)};const o=(t,e)=>{const s=t=>t.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),a=new RegExp("[^\0-]"),i=t.split(/\s+/g).map(t=>t.trim()).filter(t=>!!t);if(a.test(t))return i.some(t=>e.toLowerCase().indexOf(t)>-1);{const a=t.endsWith(" ");return new RegExp(i.map((t,e)=>i.length!==e+1||a?`(?=.*\\b${s(t)}\\b)`:`(?=.*\\b${s(t)})`).join("")+".+","gi").test(e)}};var r={name:"SearchBox",data:()=>({query:"",focused:!1,focusIndex:0,placeholder:void 0}),computed:{showSuggestions(){return this.focused&&this.suggestions&&this.suggestions.length},suggestions(){const t=this.query.trim().toLowerCase();if(!t)return;const{pages:e}=this.$site,s=this.$site.themeConfig.searchMaxSuggestions||5,a=this.$localePath,i=[];for(let o=0;o<e.length&&!(i.length>=s);o++){const r=e[o];if(this.getPageLocalePath(r)===a&&this.isSearchable(r))if(n(t,r))i.push(r);else if(r.headers)for(let e=0;e<r.headers.length&&!(i.length>=s);e++){const s=r.headers[e];s.title&&n(t,r,s.title)&&i.push(Object.assign({},r,{path:r.path+"#"+s.slug,header:s}))}}return i},alignRight(){return(this.$site.themeConfig.nav||[]).length+(this.$site.repo?1:0)<=2}},mounted(){this.placeholder=this.$site.themeConfig.searchPlaceholder||"",document.addEventListener("keydown",this.onHotkey)},beforeDestroy(){document.removeEventListener("keydown",this.onHotkey)},methods:{getPageLocalePath(t){for(const e in this.$site.locales||{})if("/"!==e&&0===t.path.indexOf(e))return e;return"/"},isSearchable(t){let e=null;return null===e||(e=Array.isArray(e)?e:new Array(e),e.filter(e=>t.path.match(e)).length>0)},onHotkey(t){t.srcElement===document.body&&["s","/"].includes(t.key)&&(this.$refs.input.focus(),t.preventDefault())},onUp(){this.showSuggestions&&(this.focusIndex>0?this.focusIndex--:this.focusIndex=this.suggestions.length-1)},onDown(){this.showSuggestions&&(this.focusIndex<this.suggestions.length-1?this.focusIndex++:this.focusIndex=0)},go(t){this.showSuggestions&&(this.$router.push(this.suggestions[t].path),this.query="",this.focusIndex=0)},focus(t){this.focusIndex=t},unfocus(){this.focusIndex=-1}}},l=(s(328),s(6)),c=Object(l.a)(r,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"search-box"},[e("input",{ref:"input",class:{focused:t.focused},attrs:{"aria-label":"Search",placeholder:t.placeholder,autocomplete:"off",spellcheck:"false"},domProps:{value:t.query},on:{input:function(e){t.query=e.target.value},focus:function(e){t.focused=!0},blur:function(e){t.focused=!1},keyup:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.go(t.focusIndex)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?null:t.onUp.apply(null,arguments)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?null:t.onDown.apply(null,arguments)}]}}),t._v(" "),t.showSuggestions?e("ul",{staticClass:"suggestions",class:{"align-right":t.alignRight},on:{mouseleave:t.unfocus}},t._l(t.suggestions,(function(s,a){return e("li",{key:a,staticClass:"suggestion",class:{focused:a===t.focusIndex},on:{mousedown:function(e){return t.go(a)},mouseenter:function(e){return t.focus(a)}}},[e("a",{attrs:{href:s.path},on:{click:function(t){t.preventDefault()}}},[e("span",{staticClass:"page-title"},[t._v(t._s(s.title||s.path))]),t._v(" "),s.header?e("span",{staticClass:"header"},[t._v("> "+t._s(s.header.title))]):t._e()])])})),0):t._e()])}),[],!1,null,null,null).exports,u=s(325),h=s(305);function d(t,e){return t.ownerDocument.defaultView.getComputedStyle(t,null)[e]}var p={components:{SidebarButton:u.default,NavLinks:h.default,SearchBox:c,AlgoliaSearchBox:{}},data:()=>({linksWrapMaxWidth:null}),mounted(){const t=parseInt(d(this.$el,"paddingLeft"))+parseInt(d(this.$el,"paddingRight")),e=()=>{document.documentElement.clientWidth<719?this.linksWrapMaxWidth=null:this.linksWrapMaxWidth=this.$el.offsetWidth-t-(this.$refs.siteName&&this.$refs.siteName.offsetWidth||0)};e(),window.addEventListener("resize",e,!1)},computed:{algolia(){return this.$themeLocaleConfig.algolia||this.$site.themeConfig.algolia||{}},isAlgoliaSearch(){return this.algolia&&this.algolia.apiKey&&this.algolia.indexName}},methods:{noMoreTips(){localStorage.setItem("showV2Tips",!0),location.reload()}}},g=(s(329),Object(l.a)(p,(function(){var t=this,e=t._self._c;return e("div",{class:{"custom-navbar":t.showV2Tips}},[t.showV2Tips?e("div",{staticClass:"showV2Tips jump-link"},[t._v("\n\t\t    免费思维导图、流程图、手绘风格草图、演示文稿、文档、表格在线文档：\n\t\t    "),e("a",{staticClass:"link",attrs:{target:"_blank",href:"https://mind.lingyun.net/"}},[t._v("FinalMind")]),t._v(" "),e("a",{staticClass:"link",staticStyle:{"margin-left":"30px"},attrs:{href:"javascript:;"},on:{click:t.noMoreTips}},[t._v("不再提示")])]):t._e(),t._v(" "),e("header",{staticClass:"navbar",style:{position:t.showV2Tips?"relative":"fixed"}},[e("SidebarButton",{on:{"toggle-sidebar":function(e){return t.$emit("toggle-sidebar")}}}),t._v(" "),e("router-link",{staticClass:"home-link",attrs:{to:t.$localePath}},[t.$site.themeConfig.logo?e("img",{staticClass:"logo",attrs:{src:t.$withBase(t.$site.themeConfig.logo),alt:t.$siteTitle}}):t._e(),t._v(" "),t.$siteTitle?e("span",{ref:"siteName",staticClass:"site-name",class:{"can-hide":t.$site.themeConfig.logo}},[t._v("uview-plus")]):t._e()]),t._v(" "),e("div",{staticClass:"links",style:t.linksWrapMaxWidth?{"max-width":t.linksWrapMaxWidth+"px"}:{}},[t.isAlgoliaSearch?e("AlgoliaSearchBox",{attrs:{options:t.algolia}}):!1!==t.$site.themeConfig.search&&!1!==t.$page.frontmatter.search?e("SearchBox"):t._e(),t._v(" "),e("NavLinks",{staticClass:"can-hide"})],1)],1)])}),[],!1,null,null,null));e.default=g.exports},422:function(t,e,s){"use strict";s.r(e);var a={components:{NavLink:s(292).default},computed:{data(){return this.$page.frontmatter},actionLink(){return{link:this.data.actionLink,text:this.data.actionText}}}},i=(s(327),s(6)),n=Object(i.a)(a,(function(){var t=this,e=t._self._c;return e("div",[e("main",{staticClass:"home",attrs:{"aria-labelledby":"main-title"}},[e("header",{staticClass:"hero"},[t.data.heroImage?e("img",{attrs:{src:t.$withBase(t.data.heroImage),alt:t.data.heroAlt||"hero"}}):t._e(),t._v(" "),null!==t.data.heroText?e("h1",{attrs:{id:"main-title"}},[t._v(t._s(t.data.heroText||t.$title||"Hello"))]):t._e(),t._v(" "),null!==t.data.tagline?e("p",{staticClass:"description"},[t._v(t._s(t.data.tagline||t.$description||"Welcome to your VuePress site"))]):t._e(),t._v(" "),t.data.actionText&&t.data.actionLink?e("p",{staticClass:"action"},[e("NavLink",{staticClass:"action-button",attrs:{item:t.actionLink}})],1):t._e()]),t._v(" "),t.data.features&&t.data.features.length?e("div",{staticClass:"features"},t._l(t.data.features,(function(s,a){return e("div",{key:a,staticClass:"feature"},[e("h2",[t._v(t._s(s.title))]),t._v(" "),e("p",[t._v(t._s(s.details))])])})),0):t._e(),t._v(" "),e("Content",{staticClass:"theme-default-content custom"}),t._v(" "),t.data.footer?e("div",{staticClass:"footer"},[t._v(t._s(t.data.footer))]):t._e()],1)])}),[],!1,null,null,null);e.default=n.exports},423:function(t,e,s){"use strict";s.r(e);var a=s(320),i=s(321),n=s(322),o={components:{PageEdit:a.default,PageNav:i.default,AdVip:n.default},props:["sidebarItems"],data:()=>({})},r=s(6),l=Object(r.a)(o,(function(){var t=this,e=t._self._c;return e("main",{staticClass:"page",style:{marginTop:t.showV2Tips?"2.3rem":0}},[t._t("top"),t._v(" "),e("Content",{staticClass:"theme-default-content"}),t._v(" "),e("PageEdit"),t._v(" "),e("PageNav",t._b({},"PageNav",{sidebarItems:t.sidebarItems},!1)),t._v(" "),e("ad-vip"),t._v(" "),t._t("bottom")],2)}),[],!1,null,null,null);e.default=l.exports},424:function(t,e,s){"use strict";s.r(e);var a=s(318),i=s(305),n={name:"Sidebar",components:{SidebarLinks:a.default,NavLinks:i.default},data:()=>({apiShow:""}),props:["items"],created(){if("undefined"!=typeof window)switch(this.apiShow=localStorage.getItem("apiShow")?localStorage.getItem("apiShow"):"composition",console.log(this.apiShow,"apiShow"),this.apiShow){case"options":document.querySelector("#app").classList.remove("show-composition"),document.querySelector("#app").classList.add("show-options");break;case"composition":default:document.querySelector("#app").classList.remove("show-options"),document.querySelector("#app").classList.add("show-composition")}},methods:{apiChange(t){if("undefined"!=typeof window)switch(localStorage.setItem("apiShow",t),this.apiShow){case"options":document.querySelector("#app").classList.remove("show-composition"),document.querySelector("#app").classList.add("show-options");break;case"composition":default:document.querySelector("#app").classList.remove("show-options"),document.querySelector("#app").classList.add("show-composition")}}}},o=(s(332),s(6)),r=Object(o.a)(n,(function(){var t=this,e=t._self._c;return e("div",[e("aside",{staticClass:"sidebar",style:{marginTop:t.showV2Tips?"2.3rem":0}},[e("a",{staticClass:"jump-linker",attrs:{target:"_blank",href:"https://ext.dcloud.net.cn/plugin?id=20103"}},[e("img",{attrs:{src:t.$withBase("/customer/uiadmin-unicloud.png")}})]),t._v(" "),e("div",{staticClass:"jump-linker",attrs:{target:"_blank"}},[e("img",{attrs:{src:t.$withBase("/customer/contact1.png")}})]),t._v(" "),e("div",{staticStyle:{"background-color":"#f9f9f9",padding:"15px 10px","margin-top":"15px",width:"170px","border-radius":"6px"}},[e("el-switch",{attrs:{"active-value":"composition","inactive-value":"options","active-text":"组合式","inactive-text":"选项式"},on:{change:t.apiChange},model:{value:t.apiShow,callback:function(e){t.apiShow=e},expression:"apiShow"}})],1),t._v(" "),e("NavLinks"),t._v(" "),t._t("top"),t._v(" "),e("SidebarLinks",{attrs:{depth:0,items:t.items}}),t._v(" "),t._t("bottom")],2)])}),[],!1,null,null,null);e.default=r.exports},533:function(t,e,s){"use strict";s.r(e);var a=s(422),i=s(421),n=s(423),o=s(424),r=s(287),l={name:"Layout",components:{Home:a.default,Page:n.default,Sidebar:o.default,Navbar:i.default},data:()=>({isSidebarOpen:!1}),computed:{shouldShowNavbar(){const{themeConfig:t}=this.$site,{frontmatter:e}=this.$page;return!1!==e.navbar&&!1!==t.navbar&&(this.$title||t.logo||t.repo||t.nav||this.$themeLocaleConfig.nav)},shouldShowSidebar(){const{frontmatter:t}=this.$page;return!t.home&&!1!==t.sidebar&&this.sidebarItems.length},sidebarItems(){return Object(r.j)(this.$page,this.$page.regularPath,this.$site,this.$localePath)},pageClasses(){const t=this.$page.frontmatter.pageClass;return[{"no-navbar":!this.shouldShowNavbar,"sidebar-open":this.isSidebarOpen,"no-sidebar":!this.shouldShowSidebar},t]}},mounted(){this.$router.afterEach(()=>{this.isSidebarOpen=!1})},methods:{toggleSidebar(t){this.isSidebarOpen="boolean"==typeof t?t:!this.isSidebarOpen,this.$emit("toggle-sidebar",this.isSidebarOpen)},onTouchStart(t){this.touchStart={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY}},onTouchEnd(t){const e=t.changedTouches[0].clientX-this.touchStart.x,s=t.changedTouches[0].clientY-this.touchStart.y;Math.abs(e)>Math.abs(s)&&Math.abs(e)>40&&(e>0&&this.touchStart.x<=80?this.toggleSidebar(!0):this.toggleSidebar(!1))}}},c=s(6),u=Object(c.a)(l,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"theme-container",class:t.pageClasses,on:{touchstart:t.onTouchStart,touchend:t.onTouchEnd}},[t.shouldShowNavbar?e("Navbar",{on:{"toggle-sidebar":t.toggleSidebar}}):t._e(),t._v(" "),e("div",{staticClass:"sidebar-mask",on:{click:function(e){return t.toggleSidebar(!1)}}}),t._v(" "),e("Sidebar",{attrs:{items:t.sidebarItems},on:{"toggle-sidebar":t.toggleSidebar},scopedSlots:t._u([{key:"top",fn:function(){return[t._t("sidebar-top")]},proxy:!0},{key:"bottom",fn:function(){return[t._t("sidebar-bottom")]},proxy:!0}],null,!0)}),t._v(" "),t.$page.frontmatter.home?e("Home"):e("Page",{attrs:{"sidebar-items":t.sidebarItems},scopedSlots:t._u([{key:"top",fn:function(){return[t._t("page-top")]},proxy:!0},{key:"bottom",fn:function(){return[t._t("page-bottom")]},proxy:!0}],null,!0)})],1)}),[],!1,null,null,null);e.default=u.exports}}]);