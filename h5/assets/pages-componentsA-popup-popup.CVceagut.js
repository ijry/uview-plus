import{_ as o,r as e,a as l,c as t,w as p,E as a,e as s,b as i,d as u,i as n,q as c,I as d,o as r,g as m,h as v,j as h,F as y,J as w,S as O,m as f,t as g,k}from"./index-Bme5D8O8.js";const C=o({data:()=>({show:!1,popupData:{overlay:!0,mode:"bottom",borderRadius:"",closeable:!0,closeOnClickOverlay:!0},list:[{popupData:{overlay:!0,mode:"top",closeOnClickOverlay:!0},title:"顶部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeTop.png"},{popupData:{overlay:!0,mode:"right",closeOnClickOverlay:!0},title:"右侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeRight.png"},{popupData:{overlay:!0,mode:"bottom",closeOnClickOverlay:!0},title:"底部弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeBottom.png"},{popupData:{overlay:!0,mode:"left",closeOnClickOverlay:!0},title:"左侧弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeLeft.png"},{popupData:{overlay:!0,mode:"center",round:10,closeOnClickOverlay:!0},title:"居中弹出",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/modeCenter.png"},{popupData:{overlay:!0,mode:"bottom",round:10,closeOnClickOverlay:!0},title:"显示圆角",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showRadis.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!1,closeOnClickOverlay:!1},title:"禁止点击遮罩关闭",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/noClose.png"},{popupData:{overlay:!0,mode:"bottom",closeable:!0,closeOnClickOverlay:!0},title:"显示关闭按钮",iconUrl:"https://cdn.uviewui.com/uview/demo/popup/showCloseBtn.png"}]}),methods:{openPopup(o){this.popupData=o,uni.$u.sleep().then((()=>{this.show=!this.show}))},navigateBack(){uni.navigateBack()},open(){},close(){this.show=!1}}},[["render",function(o,C,b,D,x,_){const U=e(l("up-navbar"),a),B=e(l("up-gap"),s),R=k,I=e(l("up-cell"),i),L=e(l("up-cell-group"),u),T=n,A=O,S=e(l("up-button"),c),j=e(l("up-popup"),d);return r(),t(T,null,{default:p((()=>[m(U,{title:"弹窗",onLeftClick:_.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),m(B,{height:"20",bgColor:"#fff"}),m(L,null,{default:p((()=>[(r(!0),v(y,null,h(x.list,((o,e)=>(r(),t(I,{titleStyle:{fontWeight:500},onClick:e=>_.openPopup(o.popupData),title:o.title,key:e,isLink:""},{icon:p((()=>[m(R,{class:"u-cell-icon",src:o.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),(r(),v(y,null,h(50,(o=>m(T,null,{default:p((()=>[m(T,{class:"u-p-l-10",style:{height:"20px"}})])),_:1}))),64)),m(j,{safeAreaInsetBottom:!0,safeAreaInsetTop:!0,mode:x.popupData.mode,show:x.show,round:x.popupData.round,overlay:x.popupData.overlay,borderRadius:x.popupData.borderRadius,closeable:x.popupData.closeable,closeOnClickOverlay:x.popupData.closeOnClickOverlay,onClose:_.close,onOpen:_.open},{default:p((()=>[m(T,{class:"u-popup-slot",style:w({padding:"12px",width:["bottom","top"].includes(x.popupData.mode)?"750rpx":"200px",marginTop:["left","right"].includes(x.popupData.mode)?"480rpx":"0"})},{default:p((()=>[m(A,{"scroll-y":"","enable-flex":"",style:{width:"120px",height:"80px","margin-bottom":"10px"}},{default:p((()=>[(r(),v(y,null,h(30,(o=>m(T,null,{default:p((()=>[f(" 列表滚动"+g(o),1)])),_:2},1024))),64))])),_:1}),m(T,null,{default:p((()=>[m(S,{type:"success",text:"点我关闭",customStyle:"width: 200rpx",size:"small",onClick:C[0]||(C[0]=o=>x.show=!x.show)})])),_:1})])),_:1},8,["style"])])),_:1},8,["mode","show","round","overlay","borderRadius","closeable","closeOnClickOverlay","onClose","onOpen"])])),_:1})}],["__scopeId","data-v-e6347c8a"]]);export{C as default};
