(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{322:function(t,e,a){"use strict";a.r(e);var i=a(291),s=a.n(i),r={data:()=>({id:"",adDialog:!1,qrDialog:!1,qrUrl:"",watchEnd:!1,loadingInstance:null,timer:null,check:null,whiteList:["/user/login.html"]}),created(){},mounted(){setTimeout(()=>{this.checkVip()},1e3),this.timer||(this.timer=setInterval(()=>{},1e4)),this.check=setInterval(()=>{this.checkDisplay()},5e3)},beforeDestroy(){clearInterval(this.check)},watch:{$route(t,e){this.checkVip()}},methods:{inWl(){return!!this.$route.path.startsWith("/guide/")||(!!this.$route.path.startsWith("/cooperation/")||(!!this.$route.path.startsWith("/user/")||this.whiteList.includes(this.$route.path)))},checkVip(){if(this.inWl())this.qrDialog=!1;else{if("undefined"!=typeof window&&window.localStorage){let t=localStorage.getItem("adExpire");if(!t||Date.parse(new Date)/1e3>t||t-Date.parse(new Date)/1e3>43200)return void this.watchAd()}this.qrDialog=!1}},openDialog(){this.qrDialog=!0},checkDisplay(){const t=document.getElementById("vip-box");if(console.log(t),!t)return alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),alert("请关闭广告屏蔽器支持我们！"),void(document.documentElement.style.opacity="0");for(var e=document.getElementsByClassName("v-modal"),a=0;a<e.length;a++){"none"===window.getComputedStyle(e[a]).display&&alert("请关闭广告屏蔽器支持我们谢谢！")}},formatDate(){let t=new Date;return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`},async watchAd(){let t={};if(localStorage){let e=localStorage.getItem("userState");e&&(e=JSON.parse(e),t.Authorization=e.token)}try{let e=localStorage.getItem("id-"+this.formatDate());s.a.post("https://uiadmin.net/api/v1/wxapp/ad/add",{id:e||""},{headers:t}).then(t=>{let e=t.data;200===e.code?e.data.isVip?(this.qrDialog=!1,this.watchEnd=!0,clearInterval(this.check),localStorage.setItem("adExpire",Date.parse(new Date)/1e3+43200),this.$message.success("免微信弹窗广告会员生效")):(this.id=e.data.id,localStorage.setItem("id-"+this.formatDate(),this.id),this.qrUrl=e.data.base64,this.qrDialog=!0):this.$message.error("出错"+e.msg)})}catch(t){console.log(t),this.$message.error("请求出错")}},async checkEnd(){try{this.$prompt("请输入正确的微信昵称（拼多多）用于广告验证，如未验证成功可间隔10秒重试，更多问题可加QQ598821125。","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputValue:localStorage.getItem("wxnickname")}).then(({value:t})=>{t?(localStorage.setItem("wxnickname",t),s.a.post("https://uiadmin.net/api/v1/wxapp/ad/check?id="+this.id,{wxnickname:t}).then(t=>{let e=t.data;200===e.code?(this.watchEnd=!0,localStorage.setItem("adExpire",Date.parse(new Date)/1e3+43200),this.qrDialog=!1):this.$message.error(e.msg)})):this.$message.error("请正确填写微信昵称")}).catch(()=>{})}catch(t){this.$message.error("检查出错")}}}},l=a(6),o=Object(l.a)(r,(function(){var t=this,e=t._self._c;return e("div",[e("el-dialog",{ref:"myElement",staticClass:"novip",attrs:{id:"vip-box",title:"广告",visible:t.qrDialog,width:"600px","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(e){t.qrDialog=e}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("div",[e("div",[t._v("验证阶段，非必要情况，请勿关闭页面或者刷新页面。")]),t._v(" "),e("el-button",{attrs:{type:"primary"},on:{click:function(e){return e.stopPropagation(),t.checkEnd.apply(null,arguments)}}},[t._v("已经看完")])],1)]},proxy:!0}])},[e("div",[e("h3",[t._v("请使用微信扫码")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("扫码后请点击“打开广告”蓝色按钮")]),t._v(" "),e("div",{staticClass:"mt-1"},[t._v("如遇到广告问题可加QQ598821125")]),t._v(" "),e("div",[t._v("\n        感谢对开源软件的支持与理解，现阶段观看广告将有助于uview-plus的可持续发展，特别是在鸿蒙、uni-app-x等方面的开发，我们也在积极探索更好的可持续发展模式，以投入更多的研发能力便于提供更加好用的框架。收集了大家的意见反馈我们正在规划推出社区发帖获得免广告点数，自媒体发短视频教程获得广告点数，提交FastView可视化模板送广告点数，提交项目线上案例送广告点数，帮助其它用户解决问题送广告点数等多种方法，希望能够适应不通的需求，并且能积极推动uview-plus发展。\n      ")]),t._v(" "),e("div",{directives:[{name:"loading",rawName:"v-loading",value:!t.qrUrl,expression:"qrUrl ? false : true"}],staticClass:"pt-3"},[t.qrUrl?e("img",{attrs:{src:t.qrUrl,alt:"mind"}}):t._e()]),t._v(" "),e("div",{staticClass:"mb-3"},[e("router-link",{staticClass:"mb-4 flex justify-center items-center flex-col",attrs:{to:"/user/vip"}},[t._v("\n          如果实在不想观看广告，应部分用户需求现已支持开通会员去广告。\n        ")])],1)])])],1)}),[],!1,null,null,null);e.default=o.exports}}]);