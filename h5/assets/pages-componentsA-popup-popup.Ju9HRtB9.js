import{_ as o}from"./u-navbar.Bf3kjtr5.js";import{r as e,o as t,c as p,w as l,i as a,a as i,b as s,d as u,F as n,u as r,j as c,e as d}from"./index-lHKUqzda.js";import{r as m}from"./uni-app.es.BmvKtZ2J.js";import{_ as v}from"./u-gap.wOQmlUi9.js";import{_ as h}from"./u-cell.B_euWBvp.js";import{_ as f}from"./u-cell-group.C_igBCTk.js";import{_ as y}from"./u-button.BTa0gxCB.js";import{_ as w}from"./u-popup.roB5QQRK.js";import{_ as b}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./u-status-bar.S9AsCJf3.js";import"./u-icon.CdJBGE0i.js";import"./u-line.DpmJBAll.js";import"./u-loading-icon.DLZZmOLj.js";import"./u-overlay.0xXsNheU.js";import"./u-transition.xLz8uJgF.js";import"./u-safe-bottom.4gjRy_sF.js";const g=b({data:()=>({show:!1,popupData:{overlay:!0,mode:"bottom",borderRadius:"",closeable:!0,closeOnClickOverlay:!0},list:[{popupData:{overlay:!0,mode:"top",closeOnClickOverlay:!0},title:"顶部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeTop.png"},{popupData:{overlay:!0,mode:"right",closeOnClickOverlay:!0},title:"右侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeRight.png"},{popupData:{overlay:!0,mode:"bottom",closeOnClickOverlay:!0},title:"底部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeBottom.png"},{popupData:{overlay:!0,mode:"left",closeOnClickOverlay:!0},title:"左侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeLeft.png"},{popupData:{overlay:!0,mode:"center",round:10,closeOnClickOverlay:!0},title:"居中弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeCenter.png"},{popupData:{overlay:!0,mode:"bottom",round:10,closeOnClickOverlay:!0},title:"显示圆角",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showRadis.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!1,closeOnClickOverlay:!1},title:"禁止点击遮罩关闭",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/noClose.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!0,closeOnClickOverlay:!0},title:"显示关闭按钮",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showCloseBtn.png"}]}),methods:{openPopup(o){this.popupData=o,uni.$u.sleep().then((()=>{this.show=!this.show}))},navigateBack(){uni.navigateBack()},open(){},close(){this.show=!1}}},[["render",function(b,g,O,C,k,D){const _=m(e("up-navbar"),o),j=m(e("up-gap"),v),x=d,U=m(e("up-cell"),h),B=m(e("up-cell-group"),f),R=a,I=m(e("up-button"),y),L=m(e("up-popup"),w);return t(),p(R,null,{default:l((()=>[i(_,{title:"弹窗",onLeftClick:D.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),i(j,{height:"20",bgColor:"#fff"}),i(B,null,{default:l((()=>[(t(!0),s(n,null,u(k.list,((o,e)=>(t(),p(U,{titleStyle:{fontWeight:500},onClick:e=>D.openPopup(o.popupData),title:o.title,key:e,isLink:""},{icon:l((()=>[i(x,{class:"u-cell-icon",src:o.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),i(L,{safeAreaInsetBottom:!0,safeAreaInsetTop:!0,mode:k.popupData.mode,show:k.show,round:k.popupData.round,overlay:k.popupData.overlay,borderRadius:k.popupData.borderRadius,closeable:k.popupData.closeable,closeOnClickOverlay:k.popupData.closeOnClickOverlay,onClose:D.close,onOpen:D.open},{default:l((()=>[i(R,{class:"u-popup-slot",style:r({width:["bottom","top"].includes(k.popupData.mode)?"750rpx":"200px",marginTop:["left","right"].includes(k.popupData.mode)?"480rpx":"0"})},{default:l((()=>[i(R,{style:{height:"12vh","overflow-y":"scroll","margin-bottom":"10px"}},{default:l((()=>[(t(),s(n,null,u(30,(o=>i(R,null,{default:l((()=>[c(" 列表滚动{[i]} ")])),_:1}))),64))])),_:1}),i(R,null,{default:l((()=>[i(I,{type:"success",text:"点我关闭",customStyle:"width: 200rpx",size:"small",onClick:g[0]||(g[0]=o=>k.show=!k.show)})])),_:1})])),_:1},8,["style"])])),_:1},8,["mode","show","round","overlay","borderRadius","closeable","closeOnClickOverlay","onClose","onOpen"])])),_:1})}],["__scopeId","data-v-fd4bdd02"]]);export{g as default};