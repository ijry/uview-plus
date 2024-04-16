import{l as e,m as t,f as o,M as l,n as i,d as n,o as c,c as a,w as s,h as u,a as r,u as d,b as m,F as _,r as f,s as p,j as k,t as y,i as h,k as b,S as x,E as g,x as S,v as C,q as w}from"./index-140fc608.js";import{_ as N}from"./u-icon.f3757cb0.js";import{r as z}from"./uni-app.es.432a22c1.js";import{_ as v}from"./_plugin-vue_export-helper.1b428a4d.js";const B=v({mixins:[t,o,{props:{text:{type:[Array],default:()=>e.columnNotice.text},icon:{type:String,default:()=>e.columnNotice.icon},mode:{type:String,default:()=>e.columnNotice.mode},color:{type:String,default:()=>e.columnNotice.color},bgColor:{type:String,default:()=>e.columnNotice.bgColor},fontSize:{type:[String,Number],default:()=>e.columnNotice.fontSize},speed:{type:[String,Number],default:()=>e.columnNotice.speed},step:{type:Boolean,default:()=>e.columnNotice.step},duration:{type:[String,Number],default:()=>e.columnNotice.duration},disableTouch:{type:Boolean,default:()=>e.columnNotice.disableTouch}}}],watch:{text:{immediate:!0,handler(e,t){l.array(e)}}},computed:{textStyle(){let e={};return e.color=this.color,e.fontSize=i(this.fontSize),e},vertical(){return"horizontal"!=this.mode}},data:()=>({index:0}),emits:["click","close"],methods:{noticeChange(e){this.index=e.detail.current},clickHandler(){this.$emit("click",this.index)},close(){this.$emit("close")}}},[["render",function(e,t,o,l,i,S){const C=z(n("u-icon"),N),w=h,v=b,B=x,T=g;return c(),a(w,{class:"u-notice",onClick:S.clickHandler},{default:s((()=>[u(e.$slots,"icon",{},(()=>[e.icon?(c(),a(w,{key:0,class:"u-notice__left-icon"},{default:s((()=>[r(C,{name:e.icon,color:e.color,size:"19"},null,8,["name","color"])])),_:1})):d("",!0)]),!0),r(T,{"disable-touch":e.disableTouch,vertical:!e.step,circular:"",interval:e.duration,autoplay:!0,class:"u-notice__swiper",onChange:S.noticeChange},{default:s((()=>[(c(!0),m(_,null,f(e.text,((e,t)=>(c(),a(B,{key:t,class:"u-notice__swiper__item"},{default:s((()=>[r(v,{class:"u-notice__swiper__item__text u-line-1",style:p([S.textStyle])},{default:s((()=>[k(y(e),1)])),_:2},1032,["style"])])),_:2},1024)))),128))])),_:1},8,["disable-touch","vertical","interval","onChange"]),["link","closable"].includes(e.mode)?(c(),a(w,{key:0,class:"u-notice__right-icon"},{default:s((()=>["link"===e.mode?(c(),a(C,{key:0,name:"arrow-right",size:17,color:e.color},null,8,["color"])):d("",!0),"closable"===e.mode?(c(),a(C,{key:1,name:"close",size:16,color:e.color,onClick:S.close},null,8,["color","onClick"])):d("",!0)])),_:1})):d("",!0)])),_:3},8,["onClick"])}],["__scopeId","data-v-8f44c17b"]]);const T=v({name:"u-row-notice",mixins:[t,o,{props:{text:{type:String,default:()=>e.rowNotice.text},icon:{type:String,default:()=>e.rowNotice.icon},mode:{type:String,default:()=>e.rowNotice.mode},color:{type:String,default:()=>e.rowNotice.color},bgColor:{type:String,default:()=>e.rowNotice.bgColor},fontSize:{type:[String,Number],default:()=>e.rowNotice.fontSize},speed:{type:[String,Number],default:()=>e.rowNotice.speed}}}],data:()=>({animationDuration:"0",animationPlayState:"paused",nvueInit:!0,show:!0}),watch:{text:{immediate:!0,handler(e,t){this.vue(),l.string(e)}},fontSize(){this.vue()},speed(){this.vue()}},computed:{textStyle(){let e={};return e.color=this.color,e.fontSize=i(this.fontSize),e},animationStyle(){let e={};return e.animationDuration=this.animationDuration,e.animationPlayState=this.animationPlayState,e},innerText(){let e=[];const t=this.text.split("");for(let o=0;o<t.length;o+=20)e.push(t.slice(o,o+20).join(""));return e}},mounted(){this.init()},emits:["click","close"],methods:{init(){this.vue(),l.string(this.text)},async vue(){let e=0;await S(),e=(await this.$uGetRect(".u-notice__content__text")).width,(await this.$uGetRect(".u-notice__content")).width,this.animationDuration=e/C(this.speed)+"s",this.animationPlayState="paused",setTimeout((()=>{this.animationPlayState="running"}),10)},async nvue(){},loopAnimation(e,t){},getNvueRect(e){},clickHandler(e){this.$emit("click")},close(){this.$emit("close")}}},[["render",function(e,t,o,l,i,x){const g=z(n("u-icon"),N),S=h,C=b;return c(),a(S,{class:"u-notice",onClick:x.clickHandler},{default:s((()=>[u(e.$slots,"icon",{},(()=>[e.icon?(c(),a(S,{key:0,class:"u-notice__left-icon"},{default:s((()=>[r(g,{name:e.icon,color:e.color,size:"19"},null,8,["name","color"])])),_:1})):d("",!0)]),!0),r(S,{class:"u-notice__content",ref:"u-notice__content"},{default:s((()=>[r(S,{ref:"u-notice__content__text",class:"u-notice__content__text",style:p([x.animationStyle])},{default:s((()=>[(c(!0),m(_,null,f(x.innerText,((e,t)=>(c(),a(C,{key:t,style:p([x.textStyle])},{default:s((()=>[k(y(e),1)])),_:2},1032,["style"])))),128))])),_:1},8,["style"])])),_:1},512),["link","closable"].includes(e.mode)?(c(),a(S,{key:0,class:"u-notice__right-icon"},{default:s((()=>["link"===e.mode?(c(),a(g,{key:0,name:"arrow-right",size:17,color:e.color},null,8,["color"])):d("",!0),"closable"===e.mode?(c(),a(g,{key:1,onClick:x.close,name:"close",size:16,color:e.color},null,8,["onClick","color"])):d("",!0)])),_:1})):d("",!0)])),_:3},8,["onClick"])}],["__scopeId","data-v-e9b0f02a"]]);const $=v({name:"u-notice-bar",mixins:[t,o,{props:{text:{type:[Array,String],default:()=>e.noticeBar.text},direction:{type:String,default:()=>e.noticeBar.direction},step:{type:Boolean,default:()=>e.noticeBar.step},icon:{type:String,default:()=>e.noticeBar.icon},mode:{type:String,default:()=>e.noticeBar.mode},color:{type:String,default:()=>e.noticeBar.color},bgColor:{type:String,default:()=>e.noticeBar.bgColor},speed:{type:[String,Number],default:()=>e.noticeBar.speed},fontSize:{type:[String,Number],default:()=>e.noticeBar.fontSize},duration:{type:[String,Number],default:()=>e.noticeBar.duration},disableTouch:{type:Boolean,default:()=>e.noticeBar.disableTouch},url:{type:String,default:()=>e.noticeBar.url},linkType:{type:String,default:()=>e.noticeBar.linkType}}}],data:()=>({show:!0}),emits:["click","close"],methods:{addStyle:w,click(e){this.$emit("click",e),this.url&&this.linkType&&this.openPage()},close(){this.show=!1,this.$emit("close")}}},[["render",function(e,t,o,l,i,u){const r=z(n("u-column-notice"),B),m=z(n("u-row-notice"),T),_=h;return i.show?(c(),a(_,{key:0,class:"u-notice-bar",style:p([{backgroundColor:e.bgColor},u.addStyle(e.customStyle)])},{default:s((()=>["column"===e.direction||"row"===e.direction&&e.step?(c(),a(r,{key:0,color:e.color,bgColor:e.bgColor,text:e.text,mode:e.mode,step:e.step,icon:e.icon,"disable-touch":e.disableTouch,fontSize:e.fontSize,duration:e.duration,onClose:u.close,onClick:u.click},null,8,["color","bgColor","text","mode","step","icon","disable-touch","fontSize","duration","onClose","onClick"])):(c(),a(m,{key:1,color:e.color,bgColor:e.bgColor,text:e.text,mode:e.mode,fontSize:e.fontSize,speed:e.speed,url:e.url,linkType:e.linkType,icon:e.icon,onClose:u.close,onClick:u.click},null,8,["color","bgColor","text","mode","fontSize","speed","url","linkType","icon","onClose","onClick"]))])),_:1},8,["style"])):d("",!0)}],["__scopeId","data-v-d347253a"]]);const j=v({data:()=>({text1:"uview-plus众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用",text2:"uview-plus众多的贴心小工具，是您开发过程中召之即来的利器，让您飞镖在手，百步穿杨",text3:"uview-plus收集众多的常用页面和布局，减少开发者的重复工作，让您专注逻辑，事半功倍",text4:["寒雨连江夜入吴","平明送客楚山孤","洛阳亲友如相问","一片冰心在玉壶"],text5:"涵盖uniapp各个方面，给开发者方向指导和设计理念，让您茅塞顿开，一马平川"}),onLoad(){},methods:{click(e){console.log(e)}}},[["render",function(e,t,o,l,i,u){const d=b,m=z(n("up-notice-bar"),$),_=h;return c(),a(_,{class:"u-page"},{default:s((()=>[r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("基础功能")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text1},null,8,["text"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("可关闭")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text5,mode:"closable"},null,8,["text"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("自定义横向滚动速度")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text2,speed:"250",mode:"closable"},null,8,["text"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("可跳转(点击右箭头)")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text3,mode:"link",url:"/pages/componentsB/tag/tag"},null,8,["text"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("横向步进滚动")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text4,step:!0,onClick:u.click},null,8,["text","onClick"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("纵向滚动")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text4,direction:"column",onClick:u.click},null,8,["text","onClick"])])),_:1})])),_:1}),r(_,{class:"u-demo-block"},{default:s((()=>[r(d,{class:"u-demo-block__title"},{default:s((()=>[k("自定义样式")])),_:1}),r(_,{class:"u-demo-block__content"},{default:s((()=>[r(m,{text:i.text1,color:"#ffffff",bgColor:"#f56c6c"},null,8,["text"])])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-3fecde21"]]);export{j as default};
