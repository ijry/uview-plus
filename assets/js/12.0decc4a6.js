(window.webpackJsonp=window.webpackJsonp||[]).push([[12,16,25,98],{287:function(t,e,n){"use strict";n.d(e,"c",(function(){return i})),n.d(e,"e",(function(){return l})),n.d(e,"f",(function(){return c})),n.d(e,"g",(function(){return u})),n.d(e,"a",(function(){return p})),n.d(e,"d",(function(){return d})),n.d(e,"i",(function(){return h})),n.d(e,"j",(function(){return f})),n.d(e,"b",(function(){return m})),n.d(e,"h",(function(){return v}));const i=/#.*$/,r=/\.(md|html)$/,a=/\/$/,s=/^[a-z]+:/i;function o(t){return decodeURI(t).replace(i,"").replace(r,"")}function l(t){return s.test(t)}function c(t){return/^mailto:/.test(t)}function u(t){return/^tel:/.test(t)}function p(t){if(l(t))return t;const e=t.match(i),n=e?e[0]:"",r=o(t);return a.test(r)?t:r+".html"+n}function d(t,e){const n=decodeURIComponent(t.hash),r=function(t){const e=t.match(i);if(e)return e[0]}(e);if(r&&n!==r)return!1;return o(t.path)===o(e)}function h(t,e,n){if(l(e))return{type:"external",path:e};n&&(e=function(t,e,n){const i=t.charAt(0);if("/"===i)return t;if("?"===i||"#"===i)return e+t;const r=e.split("/");n&&r[r.length-1]||r.pop();const a=t.replace(/^\//,"").split("/");for(let t=0;t<a.length;t++){const e=a[t];".."===e?r.pop():"."!==e&&r.push(e)}""!==r[0]&&r.unshift("");return r.join("/")}(e,n));const i=o(e);for(let e=0;e<t.length;e++)if(o(t[e].regularPath)===i)return Object.assign({},t[e],{type:"page",path:p(t[e].path)});return console.error(`[vuepress] No matching page found for sidebar item "${e}"`),{}}function f(t,e,n,i){const{pages:r,themeConfig:a}=n,s=i&&a.locales&&a.locales[i]||a;if("auto"===(t.frontmatter.sidebar||s.sidebar||a.sidebar))return g(t);const o=s.sidebar||a.sidebar;if(o){const{base:n,config:i}=function(t,e){if(Array.isArray(e))return{base:"/",config:e};for(const i in e)if(0===(n=t,/(\.html|\/)$/.test(n)?n:n+"/").indexOf(encodeURI(i)))return{base:i,config:e[i]};var n;return{}}(e,o);return"auto"===i?g(t):i?i.map(t=>function t(e,n,i,r=1){if("string"==typeof e)return h(n,e,i);if(Array.isArray(e))return Object.assign(h(n,e[0],i),{title:e[1]});{const a=e.children||[];return 0===a.length&&e.path?Object.assign(h(n,e.path,i),{title:e.title}):{type:"group",path:e.path,title:e.title,sidebarDepth:e.sidebarDepth,initialOpenGroupIndex:e.initialOpenGroupIndex,children:a.map(e=>t(e,n,i,r+1)),collapsable:!1!==e.collapsable}}}(t,r,n)):[]}return[]}function g(t){const e=m(t.headers||[]);return[{type:"group",collapsable:!1,title:t.title,path:null,children:e.map(e=>({type:"auto",title:e.title,basePath:t.path,path:t.path+"#"+e.slug,children:e.children||[]}))}]}function m(t){let e;return(t=t.map(t=>Object.assign({},t))).forEach(t=>{2===t.level?e=t:e&&(e.children||(e.children=[])).push(t)}),t.filter(t=>2===t.level)}function v(t){return Object.assign(t,{type:t.items&&t.items.length?"links":"link"})}},296:function(t,e){t.exports=function(t){return null==t}},299:function(t,e,n){},300:function(t,e,n){},312:function(t,e,n){"use strict";n(299)},313:function(t,e,n){var i=n(18),r=n(3),a=n(13);t.exports=function(t){return"string"==typeof t||!r(t)&&a(t)&&"[object String]"==i(t)}},314:function(t,e,n){"use strict";n(300)},320:function(t,e,n){"use strict";n.r(e);var i=n(296),r=n.n(i);const a=/\/$/,s=/^[a-z]+:/i;var o={name:"PageEdit",computed:{lastUpdated(){return this.$page.lastUpdated},lastUpdatedText(){return"string"==typeof this.$themeLocaleConfig.lastUpdated?this.$themeLocaleConfig.lastUpdated:"string"==typeof this.$site.themeConfig.lastUpdated?this.$site.themeConfig.lastUpdated:"Last Updated"},editLink(){const t=r()(this.$page.frontmatter.editLink)?this.$site.themeConfig.editLinks:this.$page.frontmatter.editLink,{repo:e,docsDir:n="",docsBranch:i="master",docsRepo:a=e}=this.$site.themeConfig;return t&&a&&this.$page.relativePath?this.createEditLink(e,a,n,i,this.$page.relativePath):null},editLinkText(){return this.$themeLocaleConfig.editLinkText||this.$site.themeConfig.editLinkText||"Edit this page"}},methods:{createEditLink(t,e,n,i,r){if(/bitbucket.org/.test(e)){return e.replace(a,"")+"/src"+`/${i}/`+(n?n.replace(a,"")+"/":"")+r+`?mode=edit&spa=0&at=${i}&fileviewer=file-view-default`}if(/gitlab.com/.test(e)){return e.replace(a,"")+"/-/edit"+`/${i}/`+(n?n.replace(a,"")+"/":"")+r}return(s.test(e)?e:"https://github.com/"+e).replace(a,"")+"/edit"+`/${i}/`+(n?n.replace(a,"")+"/":"")+r}}},l=(n(312),n(6)),c=Object(l.a)(o,(function(){var t=this,e=t._self._c;return e("footer",{staticClass:"page-edit"},[e("bottom-ad"),t._v(" "),t.editLink?e("div",{staticClass:"edit-link"},[e("a",{attrs:{href:t.editLink,target:"_blank",rel:"noopener noreferrer"}},[t._v(t._s(t.editLinkText))]),t._v(" "),e("OutboundLink")],1):t._e(),t._v(" "),t.lastUpdated?e("div",{staticClass:"last-updated"},[e("span",{staticClass:"prefix"},[t._v(t._s(t.lastUpdatedText)+":")]),t._v(" "),e("span",{staticClass:"time"},[t._v(t._s(t.lastUpdated))])]):t._e()],1)}),[],!1,null,null,null);e.default=c.exports},321:function(t,e,n){"use strict";n.r(e);var i=n(287),r=n(313),a=n.n(r),s=n(296),o=n.n(s),l={name:"PageNav",props:["sidebarItems"],computed:{prev(){return u(c.PREV,this)},next(){return u(c.NEXT,this)}}};const c={NEXT:{resolveLink:function(t,e){return p(t,e,1)},getThemeLinkConfig:({nextLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.next},PREV:{resolveLink:function(t,e){return p(t,e,-1)},getThemeLinkConfig:({prevLinks:t})=>t,getPageLinkConfig:({frontmatter:t})=>t.prev}};function u(t,{$themeConfig:e,$page:n,$route:r,$site:s,sidebarItems:l}){const{resolveLink:c,getThemeLinkConfig:u,getPageLinkConfig:p}=t,d=u(e),h=p(n),f=o()(h)?d:h;return!1===f?void 0:a()(f)?Object(i.i)(s.pages,f,r.path):c(n,l)}function p(t,e,n){const i=[];!function t(e,n){for(let i=0,r=e.length;i<r;i++)"group"===e[i].type?t(e[i].children||[],n):n.push(e[i])}(e,i);for(let e=0;e<i.length;e++){const r=i[e];if("page"===r.type&&r.path===decodeURIComponent(t.path))return i[e+n]}}var d=l,h=(n(314),n(6)),f=Object(h.a)(d,(function(){var t=this,e=t._self._c;return t.prev||t.next?e("div",{staticClass:"page-nav"},[e("p",{staticClass:"inner"},[t.prev?e("span",{staticClass:"prev"},[t._v("\n      ←\n      "),"external"===t.prev.type?e("a",{staticClass:"prev",attrs:{href:t.prev.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{staticClass:"prev",attrs:{to:t.prev.path}},[t._v("\n        "+t._s(t.prev.title||t.prev.path)+"\n      ")])],1):t._e(),t._v(" "),t.next?e("span",{staticClass:"next"},["external"===t.next.type?e("a",{attrs:{href:t.next.path,target:"_blank",rel:"noopener noreferrer"}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n\n        "),e("OutboundLink")],1):e("RouterLink",{attrs:{to:t.next.path}},[t._v("\n        "+t._s(t.next.title||t.next.path)+"\n      ")]),t._v("\n      →\n    ")],1):t._e()])]):t._e()}),[],!1,null,null,null);e.default=f.exports},322:function(t,e,n){"use strict";n.r(e);var i=n(290),r=n.n(i),a={data:()=>({id:"",adDialog:!1,qrDialog:!1,qrUrl:"",watchEnd:!1,loadingInstance:null,timer:null,check:null,whiteList:["/user/login.html"]}),created(){},mounted(){setTimeout(()=>{this.checkVip()},1e3),this.timer||(this.timer=setInterval(()=>{},1e4)),this.check=setInterval(()=>{this.checkDisplay()},5e3)},beforeDestroy(){clearInterval(this.check)},watch:{$route(t,e){this.checkVip()}},methods:{inWl(){return!!this.$route.path.startsWith("/guide/")||(!!this.$route.path.startsWith("/cooperation/")||(!!this.$route.path.startsWith("/user/")||this.whiteList.includes(this.$route.path)))},checkVip(){if(this.inWl())this.qrDialog=!1;else{if("undefined"!=typeof window&&window.localStorage){let t=localStorage.getItem("adExpire");if(!t||Date.parse(new Date)/1e3>t||t-Date.parse(new Date)/1e3>43200)return this.qrDialog=!0,void this.watchAd()}this.qrDialog=!1}},openDialog(){this.qrDialog=!0},checkDisplay(){const t=document.getElementById("vip-box");if(console.log(t),!t)return alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),void(document.documentElement.style.opacity="0");for(var e=document.getElementsByClassName("v-modal"),n=0;n<e.length;n++){"none"===window.getComputedStyle(e[n]).display&&alert("请关闭广告屏蔽器支持我们谢谢！")}},formatDate(){let t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`},async watchAd(){try{let t=localStorage.getItem("id-"+this.formatDate());r.a.post("https://uiadmin.net/api/v1/wxapp/ad/add",{id:t||""}).then(t=>{let e=t.data;200===e.code?(this.id=e.data.id,localStorage.setItem("id-"+this.formatDate(),this.id),this.qrUrl=e.data.base64):this.$message.error("出错"+e.msg)})}catch(t){this.$message.error("请求出错")}},async checkEnd(){try{this.$prompt("请输入正确的微信昵称（拼多多）用于广告验证，如未验证成功可间隔10秒重试，更多问题可加QQ598821125。","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputValue:localStorage.getItem("wxnickname")}).then(({value:t})=>{t?(localStorage.setItem("wxnickname",t),r.a.post("https://uiadmin.net/api/v1/wxapp/ad/check?id="+this.id,{wxnickname:t}).then(t=>{let e=t.data;200===e.code?(this.watchEnd=!0,localStorage.setItem("adExpire",Date.parse(new Date)/1e3+43200),this.qrDialog=!1):this.$message.error(e.msg)})):this.$message.error("请正确填写微信昵称")}).catch(()=>{})}catch(t){this.$message.error("检查出错")}}}},s=n(6),o=Object(s.a)(a,(function(){var t=this,e=t._self._c;return e("div",[e("el-dialog",{ref:"myElement",staticClass:"novip",attrs:{id:"vip-box",title:"广告",visible:t.qrDialog,width:"600px","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(e){t.qrDialog=e}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("div",[e("div",[t._v("验证阶段，非必要情况，请勿关闭页面或者刷新页面。")]),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:function(e){return e.stopPropagation(),t.checkEnd.apply(null,arguments)}}},[t._v("已经看完")])],1)]},proxy:!0}])},[e("div",[e("h3",[t._v("请使用微信扫码")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("扫码后请点击“打开广告”蓝色按钮")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("如遇到广告问题可加QQ598821125")]),t._v(" "),e("div",[t._v("\n        感谢对开源软件的支持与理解，现阶段观看广告将有助于uview-plus的可持续发展，特别是在鸿蒙、uni-app-x等方面的开发，我们也在积极探索更好的可持续发展模式，以投入更多的研发能力便于提供更加好用的框架。收集了大家的意见反馈我们正在规划推出社区发帖获得免广告点数，自媒体发短视频教程获得广告点数，提交FastView可视化模板送广告点数，提交项目线上案例送广告点数，帮助其它用户解决问题送广告点数等多种方法，希望能够适应不通的需求，并且能积极推动uview-plus发展。\n      ")]),t._v(" "),e("div",{directives:[{name:"loading",rawName:"v-loading",value:!t.qrUrl,expression:"qrUrl ? false : true"}],staticClass:"pt-3"},[t.qrUrl?e("img",{attrs:{src:t.qrUrl,alt:"mind"}}):t._e()])])])],1)}),[],!1,null,null,null);e.default=o.exports},423:function(t,e,n){"use strict";n.r(e);var i=n(320),r=n(321),a=n(322),s={components:{PageEdit:i.default,PageNav:r.default,AdVip:a.default},props:["sidebarItems"],data:()=>({})},o=n(6),l=Object(o.a)(s,(function(){var t=this,e=t._self._c;return e("main",{staticClass:"page",style:{marginTop:t.showV2Tips?"2.3rem":0}},[t._t("top"),t._v(" "),e("Content",{staticClass:"theme-default-content"}),t._v(" "),e("PageEdit"),t._v(" "),e("PageNav",t._b({},"PageNav",{sidebarItems:t.sidebarItems},!1)),t._v(" "),e("ad-vip"),t._v(" "),t._t("bottom")],2)}),[],!1,null,null,null);e.default=l.exports}}]);