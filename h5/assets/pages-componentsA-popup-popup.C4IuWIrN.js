import{_ as o,r as e,C as l,a as t,d as p,b as a,c as s,A as i,G as u,o as n,f as c,w as d,i as r,g as m,h as v,j as h,F as w,H as y,m as f,k as O}from"./index-B1PVPaTC.js";const C=o({data:()=>({show:!1,popupData:{overlay:!0,mode:"bottom",borderRadius:"",closeable:!0,closeOnClickOverlay:!0},list:[{popupData:{overlay:!0,mode:"top",closeOnClickOverlay:!0},title:"顶部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeTop.png"},{popupData:{overlay:!0,mode:"right",closeOnClickOverlay:!0},title:"右侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeRight.png"},{popupData:{overlay:!0,mode:"bottom",closeOnClickOverlay:!0},title:"底部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeBottom.png"},{popupData:{overlay:!0,mode:"left",closeOnClickOverlay:!0},title:"左侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeLeft.png"},{popupData:{overlay:!0,mode:"center",round:10,closeOnClickOverlay:!0},title:"居中弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeCenter.png"},{popupData:{overlay:!0,mode:"bottom",round:10,closeOnClickOverlay:!0},title:"显示圆角",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showRadis.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!1,closeOnClickOverlay:!1},title:"禁止点击遮罩关闭",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/noClose.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!0,closeOnClickOverlay:!0},title:"显示关闭按钮",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showCloseBtn.png"}]}),methods:{openPopup(o){this.popupData=o,uni.$u.sleep().then((()=>{this.show=!this.show}))},navigateBack(){uni.navigateBack()},open(){},close(){this.show=!1}}},[["render",function(o,C,g,k,b,D){const _=e(t("up-navbar"),l),x=e(t("up-gap"),p),U=O,B=e(t("up-cell"),a),R=e(t("up-cell-group"),s),A=r,I=e(t("up-button"),i),L=e(t("up-popup"),u);return n(),c(A,null,{default:d((()=>[m(_,{title:"弹窗",onLeftClick:D.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),m(x,{height:"20",bgColor:"#fff"}),m(R,null,{default:d((()=>[(n(!0),v(w,null,h(b.list,((o,e)=>(n(),c(B,{titleStyle:{fontWeight:500},onClick:e=>D.openPopup(o.popupData),title:o.title,key:e,isLink:""},{icon:d((()=>[m(U,{class:"u-cell-icon",src:o.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),m(L,{safeAreaInsetBottom:!0,safeAreaInsetTop:!0,mode:b.popupData.mode,show:b.show,round:b.popupData.round,overlay:b.popupData.overlay,borderRadius:b.popupData.borderRadius,closeable:b.popupData.closeable,closeOnClickOverlay:b.popupData.closeOnClickOverlay,onClose:D.close,onOpen:D.open},{default:d((()=>[m(A,{class:"u-popup-slot",style:y({width:["bottom","top"].includes(b.popupData.mode)?"750rpx":"200px",marginTop:["left","right"].includes(b.popupData.mode)?"480rpx":"0"})},{default:d((()=>[m(A,{style:{height:"12vh","overflow-y":"scroll","margin-bottom":"10px"}},{default:d((()=>[(n(),v(w,null,h(30,(o=>m(A,null,{default:d((()=>[f(" 列表滚动{[i]} ")])),_:1}))),64))])),_:1}),m(A,null,{default:d((()=>[m(I,{type:"success",text:"点我关闭",customStyle:"width: 200rpx",size:"small",onClick:C[0]||(C[0]=o=>b.show=!b.show)})])),_:1})])),_:1},8,["style"])])),_:1},8,["mode","show","round","overlay","borderRadius","closeable","closeOnClickOverlay","onClose","onOpen"])])),_:1})}],["__scopeId","data-v-fd4bdd02"]]);export{C as default};