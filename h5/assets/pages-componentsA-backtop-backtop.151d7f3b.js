import{l as t,m as o,f as a,n as e,v as c,p as s,q as l,d as i,o as n,c as u,w as r,s as p,a as d,j as m,t as b,u as k,h,k as f,i as T,b as y,r as g,F as S}from"./index-140fc608.js";import{_,a as x}from"./u-checkbox-group.e00babb8.js";import{r as D}from"./uni-app.es.432a22c1.js";import{_ as w}from"./u-icon.f3757cb0.js";import{_ as C}from"./u-transition.8fcac4ae.js";import{_ as j}from"./_plugin-vue_export-helper.1b428a4d.js";const v=j({name:"u-back-top",mixins:[o,a,{props:{mode:{type:String,default:()=>t.backtop.mode},icon:{type:String,default:()=>t.backtop.icon},text:{type:String,default:()=>t.backtop.text},duration:{type:[String,Number],default:()=>t.backtop.duration},scrollTop:{type:[String,Number],default:()=>t.backtop.scrollTop},top:{type:[String,Number],default:()=>t.backtop.top},bottom:{type:[String,Number],default:()=>t.backtop.bottom},right:{type:[String,Number],default:()=>t.backtop.right},zIndex:{type:[String,Number],default:()=>t.backtop.zIndex},iconStyle:{type:Object,default:()=>t.backtop.iconStyle}}}],computed:{backTopStyle(){return{bottom:e(this.bottom),right:e(this.right),width:"40px",height:"40px",position:"fixed",zIndex:10}},show(){return c(this.scrollTop)>c(this.top)},contentStyle(){const t={};let o=0;return o="circle"===this.mode?"100px":"4px",t.borderTopLeftRadius=o,t.borderTopRightRadius=o,t.borderBottomLeftRadius=o,t.borderBottomRightRadius=o,s(t,l(this.customStyle))}},emits:["click"],methods:{backToTop(){uni.pageScrollTo({scrollTop:0,duration:this.duration}),this.$emit("click")}}},[["render",function(t,o,a,e,c,s){const l=D(i("u-icon"),w),y=f,g=T,S=D(i("u-transition"),C);return n(),u(S,{mode:"fade",customStyle:s.backTopStyle,show:s.show},{default:r((()=>[t.$slots.default||t.$slots.$default?h(t.$slots,"default",{key:1},void 0,!0):(n(),u(g,{key:0,class:"u-back-top",style:p([s.contentStyle]),onClick:s.backToTop},{default:r((()=>[d(l,{name:t.icon,"custom-style":t.iconStyle},null,8,["name","custom-style"]),t.text?(n(),u(y,{key:0,class:"u-back-top__text"},{default:r((()=>[m(b(t.text),1)])),_:1})):k("",!0)])),_:1},8,["style","onClick"]))])),_:3},8,["customStyle","show"])}],["__scopeId","data-v-ca4fb41d"]]);const N=j({data:()=>({value:["自定义图标"],backTopData:{mode:"circle",icon:"arrow-upward",bottom:100,customStyle:{},iconStyle:{},right:20,duration:300},scrollTop:0,checkboxList:[{name:"显示方形"},{name:"自定义图标"},{name:"自定义距离"},{name:"自定义样式"},{name:"自定义返回顶部滚动时间"}]}),onLoad(){this.backTopData.icon="arrow-up"},onPageScroll(t){this.scrollTop=t.scrollTop},methods:{checkboxChange(t){t.includes("显示方形")?this.backTopData.mode="square":this.backTopData.mode="circle",t.includes("自定义图标")?this.backTopData.icon="arrow-up":this.backTopData.icon="arrow-upward",t.includes("自定义距离")?(this.backTopData.bottom=300,this.backTopData.right=20):this.backTopData.bottom=100,t.includes("自定义样式")?(this.backTopData.customStyle={backgroundColor:"#2979ff"},this.backTopData.iconStyle={color:"#ffffff"}):(this.backTopData.customStyle={},this.backTopData.iconStyle={}),t.includes("自定义返回顶部滚动时间")?this.backTopData.duration=1500:this.backTopData.duration=300},click(){console.log("click")}}},[["render",function(t,o,a,e,c,s){const l=f,p=D(i("up-checkbox"),_),b=D(i("up-checkbox-group"),x),k=T,h=D(i("up-back-top"),v);return n(),u(k,{class:"u-page",ref:"u-back-top"},{default:r((()=>[d(k,{class:"u-demo-block"},{default:r((()=>[d(l,{class:"u-demo-block__title"},{default:r((()=>[m("自定义backTop(滚动页面即可在右下角看到图标)")])),_:1}),d(k,{class:"u-demo-block__content"},{default:r((()=>[d(k,{class:"u-page__backTop-item"},{default:r((()=>[d(b,{placement:"column",shape:"square",onChange:s.checkboxChange,modelValue:c.value,"onUpdate:modelValue":o[0]||(o[0]=t=>c.value=t)},{default:r((()=>[(n(!0),y(S,null,g(c.checkboxList,((t,o)=>(n(),u(p,{customStyle:{marginBottom:"8px"},key:o,label:t.name,name:t.name},null,8,["label","name"])))),128))])),_:1},8,["onChange","modelValue"])])),_:1})])),_:1})])),_:1}),d(h,{right:c.backTopData.right,customStyle:c.backTopData.customStyle,bottom:c.backTopData.bottom,icon:c.backTopData.icon,mode:c.backTopData.mode,iconStyle:c.backTopData.iconStyle,duration:c.backTopData.duration,scrollTop:c.scrollTop,onClick:s.click},null,8,["right","customStyle","bottom","icon","mode","iconStyle","duration","scrollTop","onClick"])])),_:1},512)}],["__scopeId","data-v-607054f3"]]);export{N as default};
