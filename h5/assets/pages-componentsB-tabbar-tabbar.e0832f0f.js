import{j as e,m as t,k as a,d as l,o,c as i,w as n,a as c,b as s,l as u,F as r,f as d,t as h,q as p,i as _,g as m,n as b,p as f,u as v,e as g}from"./index.639d3d9d.js";import{_ as x}from"./u-icon.8fecb8b7.js";import{r as y}from"./uni-app.es.f87317fd.js";import{_ as C}from"./u-badge.5c0adb8e.js";import{_ as k}from"./plugin-vue_export-helper.21dcd24c.js";import{_ as I}from"./u-safe-bottom.457b576f.js";import{_ as S}from"./u-gap.299d3089.js";var A=k({name:"u-tabbar-item",mixins:[t,a,{props:{name:{type:[String,Number,null],default:e.tabbarItem.name},icon:{icon:String,default:e.tabbarItem.icon},badge:{type:[String,Number,null],default:e.tabbarItem.badge},dot:{type:Boolean,default:e.tabbarItem.dot},text:{type:String,default:e.tabbarItem.text},badgeStyle:{type:[Object,String],default:e.tabbarItem.badgeStyle}}}],data:()=>({isActive:!1,parentData:{value:null,activeColor:"",inactiveColor:""}}),options:{virtualHost:!0},created(){this.init()},methods:{init(){this.updateParentData(),this.parent||uni.$u.error("u-tabbar-item必须搭配u-tabbar组件使用");const e=this.parent.children.indexOf(this);this.isActive=(this.name||e)===this.parentData.value},updateParentData(){this.getParentData("u-tabbar")},updateFromParent(){this.init()},clickHandler(){this.$nextTick((()=>{const e=this.parent.children.indexOf(this),t=this.name||e;t!==this.parent.value&&this.parent.$emit("change",t),this.$emit("click",t)}))}}},[["render",function(e,t,a,b,f,v){const g=y(l("u-icon"),x),k=y(l("u-badge"),C),I=_,S=m;return o(),i(I,{class:"u-tabbar-item",style:p([e.$u.addStyle(e.customStyle)]),onClick:v.clickHandler},{default:n((()=>[c(I,{class:"u-tabbar-item__icon"},{default:n((()=>[e.icon?(o(),i(g,{key:0,name:e.icon,color:f.isActive?f.parentData.activeColor:f.parentData.inactiveColor,size:20},null,8,["name","color"])):(o(),s(r,{key:1},[f.isActive?u(e.$slots,"active-icon",{key:0},void 0,!0):u(e.$slots,"inactive-icon",{key:1},void 0,!0)],64)),c(k,{absolute:"",offset:[0,e.dot?"34rpx":e.badge>9?"14rpx":"20rpx"],customStyle:e.badgeStyle,isDot:e.dot,value:e.badge||(e.dot?1:null),show:e.dot||e.badge>0},null,8,["offset","customStyle","isDot","value","show"])])),_:3}),u(e.$slots,"text",{},(()=>[c(S,{class:"u-tabbar-item__text",style:p({color:f.isActive?f.parentData.activeColor:f.parentData.inactiveColor})},{default:n((()=>[d(h(e.text),1)])),_:1},8,["style"])]),!0)])),_:3},8,["style","onClick"])}],["__scopeId","data-v-20eee164"]]);var B=k({name:"u-tabbar",mixins:[t,a,{props:{value:{type:[String,Number,null],default:e.tabbar.value},safeAreaInsetBottom:{type:Boolean,default:e.tabbar.safeAreaInsetBottom},border:{type:Boolean,default:e.tabbar.border},zIndex:{type:[String,Number],default:e.tabbar.zIndex},activeColor:{type:String,default:e.tabbar.activeColor},inactiveColor:{type:String,default:e.tabbar.inactiveColor},fixed:{type:Boolean,default:e.tabbar.fixed},placeholder:{type:Boolean,default:e.tabbar.placeholder}}}],data:()=>({placeholderHeight:0}),computed:{tabbarStyle(){const e={zIndex:this.zIndex};return uni.$u.deepMerge(e,uni.$u.addStyle(this.customStyle))},updateChild(){return[this.value,this.activeColor,this.inactiveColor]},updatePlaceholder(){return[this.fixed,this.placeholder]}},watch:{updateChild(){this.updateChildren()},updatePlaceholder(){this.setPlaceholderHeight()}},created(){this.children=[]},mounted(){this.setPlaceholderHeight()},methods:{updateChildren(){this.children.length&&this.children.map((e=>e.updateFromParent()))},async setPlaceholderHeight(){this.fixed&&this.placeholder&&(await uni.$u.sleep(20),this.$uGetRect(".u-tabbar__content").then((({height:e=50})=>{this.placeholderHeight=e})))}}},[["render",function(e,t,a,s,r,d){const h=_,m=y(l("u-safe-bottom"),I);return o(),i(h,{class:"u-tabbar"},{default:n((()=>[c(h,{class:f(["u-tabbar__content",[e.border&&"u-border-top",e.fixed&&"u-tabbar--fixed"]]),ref:"u-tabbar__content",onTouchmove:v(e.noop,["stop","prevent"]),style:p([d.tabbarStyle])},{default:n((()=>[c(h,{class:"u-tabbar__content__item-wrapper"},{default:n((()=>[u(e.$slots,"default",{},void 0,!0)])),_:3}),e.safeAreaInsetBottom?(o(),i(m,{key:0})):b("",!0)])),_:3},8,["onTouchmove","class","style"]),e.placeholder?(o(),i(h,{key:0,class:"u-tabbar__placeholder",style:p({height:r.placeholderHeight+"px"})},null,8,["style"])):b("",!0)])),_:3})}],["__scopeId","data-v-2948fc23"]]);var $=k({data:()=>({value1:0,value2:1,value3:"play-right",value4:0,value5:0,value6:0,value7:3}),onLoad(){},methods:{change5(e){if(1===e)return uni.$u.toast("请您先登录");this.value5=e},change1(e){this.value1=e,console.log("change1",e)},click1(e){console.log("click1",e)}}},[["render",function(e,t,a,s,u,r){const h=m,p=y(l("u-tabbar-item"),A),b=y(l("u-tabbar"),B),f=_,v=g,x=y(l("u-gap"),S);return o(),i(f,{class:"u-page"},{default:n((()=>[c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("基础功能")])),_:1}),c(b,{value:u.value1,onChange:r.change1,fixed:!1,placeholder:!1,safeAreaInsetBottom:!1},{default:n((()=>[c(p,{text:"首页",icon:"home",onClick:r.click1},null,8,["onClick"]),c(p,{text:"放映厅",icon:"photo",onClick:r.click1},null,8,["onClick"]),c(p,{text:"直播",icon:"play-right",onClick:r.click1},null,8,["onClick"]),c(p,{text:"我的",icon:"account",onClick:r.click1},null,8,["onClick"])])),_:1},8,["value","onChange"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("显示徽标")])),_:1}),c(b,{value:u.value2,placeholder:!1,onChange:t[0]||(t[0]=e=>u.value2=e),fixed:!1,safeAreaInsetBottom:!1},{default:n((()=>[c(p,{text:"首页",icon:"home",dot:""}),c(p,{text:"放映厅",icon:"photo",badge:"3"}),c(p,{text:"直播",icon:"play-right"}),c(p,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("匹配标签的名称")])),_:1}),c(b,{placeholder:!1,value:u.value3,onChange:t[1]||(t[1]=e=>u.value3=e),fixed:!1,safeAreaInsetBottom:!1},{default:n((()=>[c(p,{text:"首页",icon:"home",name:"home"}),c(p,{text:"放映厅",icon:"photo",name:"photo"}),c(p,{text:"直播",icon:"play-right",name:"play-right"}),c(p,{text:"我的",name:"account",icon:"account"})])),_:1},8,["value"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("自定义图标/颜色")])),_:1}),c(b,{value:u.value4,onChange:t[2]||(t[2]=e=>u.value4=e),fixed:!1,placeholder:!1,activeColor:"#d81e06",safeAreaInsetBottom:!1},{default:n((()=>[c(p,{text:"首页"},{"active-icon":n((()=>[c(v,{class:"u-page__item__slot-icon",src:"https://cdn.uviewui.com/uview/common/bell-selected.png"})])),"inactive-icon":n((()=>[c(v,{class:"u-page__item__slot-icon",src:"https://cdn.uviewui.com/uview/common/bell.png"})])),_:1}),c(p,{text:"放映厅",icon:"photo"}),c(p,{text:"直播",icon:"play-right"}),c(p,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("拦截切换事件(点击第二个标签)")])),_:1}),c(b,{value:u.value5,fixed:!1,onChange:r.change5,safeAreaInsetBottom:!1,placeholder:!1},{default:n((()=>[c(p,{text:"首页",icon:"home"}),c(p,{text:"放映厅",icon:"photo"}),c(p,{text:"直播",icon:"play-right"}),c(p,{text:"我的",icon:"account"})])),_:1},8,["value","onChange"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("去除上边框")])),_:1}),c(b,{value:u.value7,placeholder:!1,border:!1,onChange:t[3]||(t[3]=e=>u.value7=e),fixed:!1,safeAreaInsetBottom:!1},{default:n((()=>[c(p,{text:"首页",icon:"home"}),c(p,{text:"放映厅",icon:"photo"}),c(p,{text:"直播",icon:"play-right"}),c(p,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),c(f,{class:"u-page__item"},{default:n((()=>[c(h,{class:"u-page__item__title"},{default:n((()=>[d("固定在底部(固定在屏幕最下方)")])),_:1}),c(x,{height:"150"}),c(b,{value:u.value6,onChange:t[4]||(t[4]=e=>u.value6=e),fixed:!0,placeholder:!0,safeAreaInsetBottom:!0},{default:n((()=>[c(p,{text:"首页",icon:"home"}),c(p,{text:"放映厅",icon:"photo"}),c(p,{text:"直播",icon:"play-right"}),c(p,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1})])),_:1})}],["__scopeId","data-v-18684d62"]]);export{$ as default};
