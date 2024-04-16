import{l as e,m as o,f as t,P as i,n,q as a,Q as r,o as d,c as l,w as s,y as c,s as u,b as g,F as m,r as f,u as y,j as p,t as h,i as v,k as w}from"./index-140fc608.js";import{_}from"./_plugin-vue_export-helper.1b428a4d.js";const S=_({name:"u-loading-icon",mixins:[o,t,{props:{show:{type:Boolean,default:()=>e.loadingIcon.show},color:{type:String,default:()=>e.loadingIcon.color},textColor:{type:String,default:()=>e.loadingIcon.textColor},vertical:{type:Boolean,default:()=>e.loadingIcon.vertical},mode:{type:String,default:()=>e.loadingIcon.mode},size:{type:[String,Number],default:()=>e.loadingIcon.size},textSize:{type:[String,Number],default:()=>e.loadingIcon.textSize},text:{type:[String,Number],default:()=>e.loadingIcon.text},timingFunction:{type:String,default:()=>e.loadingIcon.timingFunction},duration:{type:[String,Number],default:()=>e.loadingIcon.duration},inactiveColor:{type:String,default:()=>e.loadingIcon.inactiveColor}}}],data:()=>({array12:Array.from({length:12}),aniAngel:360,webviewHide:!1,loading:!1}),computed:{otherBorderColor(){const e=i(this.color,"#ffffff",100)[80];return"circle"===this.mode?this.inactiveColor?this.inactiveColor:e:"transparent"}},watch:{show(e){}},mounted(){this.init()},methods:{addUnit:n,addStyle:a,init(){setTimeout((()=>{}),20)},addEventListenerToWebview(){const e=r(),o=e[e.length-1].$getAppWebview();o.addEventListener("hide",(()=>{this.webviewHide=!0})),o.addEventListener("show",(()=>{this.webviewHide=!1}))}}},[["render",function(e,o,t,i,n,a){const r=v,_=w;return e.show?(d(),l(r,{key:0,class:c(["u-loading-icon",[e.vertical&&"u-loading-icon--vertical"]]),style:u([a.addStyle(e.customStyle)])},{default:s((()=>[n.webviewHide?y("",!0):(d(),l(r,{key:0,class:c(["u-loading-icon__spinner",[`u-loading-icon__spinner--${e.mode}`]]),ref:"ani",style:u({color:e.color,width:a.addUnit(e.size),height:a.addUnit(e.size),borderTopColor:e.color,borderBottomColor:a.otherBorderColor,borderLeftColor:a.otherBorderColor,borderRightColor:a.otherBorderColor,"animation-duration":`${e.duration}ms`,"animation-timing-function":"semicircle"===e.mode||"circle"===e.mode?e.timingFunction:""})},{default:s((()=>["spinner"===e.mode?(d(!0),g(m,{key:0},f(n.array12,((e,o)=>(d(),l(r,{key:o,class:"u-loading-icon__dot"})))),128)):y("",!0)])),_:1},8,["class","style"])),e.text?(d(),l(_,{key:1,class:"u-loading-icon__text",style:u({fontSize:a.addUnit(e.textSize),color:e.textColor})},{default:s((()=>[p(h(e.text),1)])),_:1},8,["style"])):y("",!0)])),_:1},8,["style","class"])):y("",!0)}],["__scopeId","data-v-86695817"]]);export{S as _};
