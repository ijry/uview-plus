import{_ as t}from"./u-icon.8fecb8b7.js";import{j as e,m as n,k as o,d as i,o as s,c as r,w as a,a as c,f as d,t as p,u as l,g as u,i as m}from"./index.639d3d9d.js";import{r as g}from"./uni-app.es.f87317fd.js";import{_ as y}from"./u-button.c0b16c21.js";import{_ as f}from"./u-overlay.d6cc6c6f.js";import{_ as h}from"./plugin-vue_export-helper.21dcd24c.js";import"./u-loading-icon.1043df4a.js";import"./u-transition.bbe9f451.js";var S=h({name:"u-no-network",mixins:[n,o,{props:{tips:{type:String,default:e.noNetwork.tips},zIndex:{type:[String,Number],default:e.noNetwork.zIndex},image:{type:String,default:e.noNetwork.image}}}],data:()=>({isConnected:!0,networkType:"none"}),mounted(){this.isIOS="ios"===uni.getSystemInfoSync().platform,uni.onNetworkStatusChange((t=>{this.isConnected=t.isConnected,this.networkType=t.networkType,this.emitEvent(this.networkType)})),uni.getNetworkType({success:t=>{this.networkType=t.networkType,this.emitEvent(this.networkType),"none"==t.networkType?this.isConnected=!1:this.isConnected=!0}})},methods:{retry(){uni.getNetworkType({success:t=>{this.networkType=t.networkType,this.emitEvent(this.networkType),"none"==t.networkType?(uni.$u.toast("无网络连接"),this.isConnected=!1):(uni.$u.toast("网络已连接"),this.isConnected=!0)}}),this.$emit("retry")},emitEvent(t){this.$emit("none"===t?"disconnected":"connected")},async openSettings(){"none"!=this.networkType||this.openSystemSettings()},openAppSettings(){this.gotoAppSetting()},openSystemSettings(){this.isIOS?this.gotoiOSSetting():this.gotoAndroidSetting()},network(){var t=null,e=plus.ios.newObject("CTCellularData"),n=e.plusGetAttribute("restrictedState");return 0==n?t=null:2==n?t=1:1==n&&(t=2),plus.ios.deleteObject(e),t},gotoAppSetting(){if(this.isIOS){var t=plus.ios.import("UIApplication").sharedApplication(),e=plus.ios.import("NSURL"),n=e.URLWithString("app-settings:");t.openURL(n),plus.ios.deleteObject(n),plus.ios.deleteObject(e),plus.ios.deleteObject(t)}else{var o=plus.android.importClass("android.content.Intent"),i=plus.android.importClass("android.provider.Settings"),s=plus.android.importClass("android.net.Uri"),r=plus.android.runtimeMainActivity(),a=new o;a.setAction(i.ACTION_APPLICATION_DETAILS_SETTINGS);var c=s.fromParts("package",r.getPackageName(),null);a.setData(c),r.startActivity(a)}},gotoiOSSetting(){var t=plus.ios.import("UIApplication").sharedApplication(),e=plus.ios.import("NSURL"),n=e.URLWithString("App-prefs:root=General");t.openURL(n),plus.ios.deleteObject(n),plus.ios.deleteObject(e),plus.ios.deleteObject(t)},gotoAndroidSetting(){var t=plus.android.importClass("android.content.Intent"),e=plus.android.importClass("android.provider.Settings"),n=plus.android.runtimeMainActivity(),o=new t(e.ACTION_SETTINGS);n.startActivity(o)}}},[["render",function(e,n,o,h,S,k){const _=g(i("u-icon"),t),w=u,v=g(i("u-button"),y),T=m,C=g(i("u-overlay"),f);return s(),r(C,{show:!S.isConnected,zIndex:e.zIndex,onTouchmove:l(e.noop,["stop","prevent"]),customStyle:{backgroundColor:"#fff",display:"flex",justifyContent:"center"}},{default:a((()=>[c(T,{class:"u-no-network"},{default:a((()=>[c(_,{name:e.image,size:"150",imgMode:"widthFit",class:"u-no-network__error-icon"},null,8,["name"]),c(w,{class:"u-no-network__tips"},{default:a((()=>[d(p(e.tips),1)])),_:1}),c(T,{class:"u-no-network__retry"},{default:a((()=>[c(v,{size:"mini",text:"重试",type:"primary",plain:"",onClick:k.retry},null,8,["onClick"])])),_:1})])),_:1})])),_:1},8,["show","zIndex","onTouchmove"])}],["__scopeId","data-v-42ba3b2c"]]);var k=h({methods:{disconnected(){console.log("disconnected")},connected(){console.log("connected")},retry(){console.log("retry")}}},[["render",function(e,n,o,p,l,y){const f=g(i("u-no-network"),S),h=g(i("u-icon"),t),k=m,_=u;return s(),r(k,{class:"u-page"},{default:a((()=>[c(f,{onDisconnected:y.disconnected,onConnected:y.connected,onRetry:y.retry},null,8,["onDisconnected","onConnected","onRetry"]),c(k,{class:"u-content"},{default:a((()=>[c(k,{class:"u-content__circle"},{default:a((()=>[c(h,{name:"checkbox-mark",color:"#fff",size:"30"})])),_:1}),c(_,{class:"u-content__normal"},{default:a((()=>[d("网络正常")])),_:1}),c(_,{class:"u-content__tips"},{default:a((()=>[d("请您断开设备的WiFi和数据连接(或开启飞行模式)，即可看到效果")])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-e8cb58f4"]]);export{k as default};
