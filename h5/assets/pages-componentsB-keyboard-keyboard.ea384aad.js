import{_ as e}from"./u-navbar.e3194188.js";import{o,c as a,w as t,a as i,b as s,r as n,F as r,d,i as c,e as l}from"./index.639d3d9d.js";import{r as u}from"./uni-app.es.f87317fd.js";import{_ as m}from"./u-gap.299d3089.js";import{_ as p}from"./u-cell.572d7e8b.js";import{_ as h}from"./u-cell-group.faa24020.js";import{_ as f}from"./u-keyboard.0ec0659c.js";import{_ as b}from"./plugin-vue_export-helper.21dcd24c.js";import"./u-status-bar.83380ec3.js";import"./u-icon.8fecb8b7.js";import"./u-line.e68cb869.js";import"./u-popup.7f98a8f1.js";import"./u-overlay.d6cc6c6f.js";import"./u-transition.bbe9f451.js";import"./u-safe-bottom.457b576f.js";var k=b({data:()=>({input:"",keyData:{mode:"",dotDisabled:!1,random:!1},list:[{title:"车牌号键盘",iconUrl:"https://cdn.uviewui.com/uview/demo/keyboard/car.png"},{title:"数字键盘",iconUrl:"https://cdn.uviewui.com/uview/demo/keyboard/number.png"},{title:"身份证键盘",iconUrl:"https://cdn.uviewui.com/uview/demo/keyboard/IdCard.png"},{title:'隐藏键盘"."符号',iconUrl:"https://cdn.uviewui.com/uview/demo/keyboard/dot.png"},{title:"打乱键盘按键的顺序",iconUrl:"https://cdn.uviewui.com/uview/demo/keyboard/order.png"}],show:!1}),methods:{navigateBack(){uni.navigateBack()},openKeyboard(e){this.keyData={mode:"",dotDisabled:!1,random:!1},0==e?this.keyData.mode="":1==e?this.keyData.mode="number":2==e?this.keyData.mode="card":3==e?(this.keyData.mode="number",this.keyData.dotDisabled=!0):4==e&&(this.keyData.mode="number",this.keyData.random=!0),this.input="",this.show=!0},change(e){this.input+=e},close(){this.show=!1},cancel(){this.show=!1},confirm(){this.show=!1},backspace(){this.input=this.input.slice(0,-1)}}},[["render",function(b,k,y,g,w,v){const D=u(d("u-navbar"),e),j=u(d("u-gap"),m),C=l,_=u(d("u-cell"),p),U=u(d("u-cell-group"),h),x=u(d("u-keyboard"),f),B=c;return o(),a(B,{class:"u-page"},{default:t((()=>[i(D,{title:"键盘",onLeftClick:v.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),i(j,{height:"20",bgColor:"#fff"}),i(U,null,{default:t((()=>[(o(!0),s(r,null,n(w.list,((e,s)=>(o(),a(_,{titleStyle:{fontWeight:500},onClick:e=>v.openKeyboard(s),title:e.title,key:s,isLink:""},{default:t((()=>[i(C,{slot:"icon",class:"u-cell-icon",src:e.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),i(x,{mode:w.keyData.mode,dotDisabled:w.keyData.dotDisabled,random:w.keyData.random,show:w.show,onClose:v.close,onCancel:v.cancel,onConfirm:v.confirm,onChange:v.change,onBackspace:v.backspace},null,8,["mode","dotDisabled","random","show","onClose","onCancel","onConfirm","onChange","onBackspace"])])),_:1})}],["__scopeId","data-v-64072359"]]);export{k as default};
