import{_ as o}from"./u-navbar.549ae336.js";import{o as s,c as t,w as i,i as a,a as e,b as l,r as n,F as r,d as c,e as p}from"./index-24ae516a.js";import{r as u}from"./uni-app.es.c6441c2e.js";import{_ as h}from"./u-cell.250e40d1.js";import{_ as w}from"./u-overlay.a6c5048b.js";import{_ as d}from"./_plugin-vue_export-helper.1b428a4d.js";import"./u-status-bar.b5454268.js";import"./u-icon.6bb997b0.js";import"./u-line.dec4c98a.js";import"./u-transition.f88084e9.js";const m=d({data:()=>({show:!1,showSlot:!1,showOpcatiy:!1,list:[{title:"基本案列",iconUrl:"https://cdn.uviewui.com/uview/demo/overlay/baseCases.png"},{title:"嵌入内容",iconUrl:"https://cdn.uviewui.com/uview/demo/overlay/embeddedContent.png"},{title:"设置透明度",iconUrl:"https://cdn.uviewui.com/uview/demo/overlay/setTransparency.png"}]}),methods:{openMask(o){0==o?this.show=!this.show:1==o?this.showSlot=!this.showSlot:2==o&&(this.showOpcatiy=!this.showOpcatiy)},navigateBack(){uni.navigateBack()}}},[["render",function(d,m,v,f,y,k){const _=u(c("up-navbar"),o),j=p,C=u(c("up-cell"),h),g=u(c("up-overlay"),w),b=a;return s(),t(b,{class:"u-page"},{default:i((()=>[e(_,{title:"遮罩层",onLeftClick:k.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),(s(!0),l(r,null,n(y.list,((o,a)=>(s(),t(C,{titleStyle:{fontWeight:500},onClick:o=>k.openMask(a),title:o.title,key:a,isLink:""},{default:i((()=>[e(j,{slot:"icon",class:"u-cell-icon",src:o.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128)),e(g,{show:y.show,onClick:m[0]||(m[0]=o=>y.show=!y.show)},null,8,["show"]),e(g,{show:y.showSlot,onClick:m[1]||(m[1]=o=>y.showSlot=!y.showSlot)},{default:i((()=>[e(b,{class:"overlay-wrap"},{default:i((()=>[e(b,{class:"overlay-wrap__box"})])),_:1})])),_:1},8,["show"]),e(g,{opacity:".85",show:y.showOpcatiy,onClick:m[2]||(m[2]=o=>y.showOpcatiy=!y.showOpcatiy)},null,8,["show"])])),_:1})}],["__scopeId","data-v-787fbc37"]]);export{m as default};