import{_ as e,r as t,a,c as l,w as o,as as c,at as n,i,e as u,o as s,g as _,m as h,n as p,k as d}from"./index-Bme5D8O8.js";const g=e({data:()=>({value1:0,value2:1,value3:"play-right",value4:0,value5:0,value6:0,value7:3}),onLoad(){},methods:{change5(e){if(1===e)return uni.$u.toast("请您先登录");this.value5=e},change1(e){this.value1=e,console.log("change1",e)},click1(e){console.log("click1",e)},goNext(){uni.navigateTo({url:"tabbar2"})}}},[["render",function(e,g,m,v,r,f){const x=p,C=t(a("up-tabbar-item"),c),k=t(a("up-tabbar"),n),b=i,y=d,I=t(a("up-gap"),u);return s(),l(b,{class:"u-page"},{default:o((()=>[_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("基础功能")])),_:1}),_(k,{value:r.value1,onChange:f.change1,fixed:!1,placeholder:!1,safeAreaInsetBottom:!1},{default:o((()=>[_(C,{text:"首页",icon:"home",onClick:f.click1},null,8,["onClick"]),_(C,{text:"放映厅",icon:"photo",onClick:f.click1},null,8,["onClick"]),_(C,{text:"直播",icon:"play-right",onClick:f.click1},null,8,["onClick"]),_(C,{text:"我的",icon:"account",onClick:f.click1},null,8,["onClick"])])),_:1},8,["value","onChange"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("显示徽标")])),_:1}),_(k,{value:r.value2,placeholder:!1,onChange:g[0]||(g[0]=e=>r.value2=e),fixed:!1,safeAreaInsetBottom:!1},{default:o((()=>[_(C,{text:"首页",icon:"home",dot:""}),_(C,{text:"放映厅",icon:"photo",badge:"3"}),_(C,{text:"直播",icon:"play-right"}),_(C,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("匹配标签的名称")])),_:1}),_(k,{placeholder:!1,value:r.value3,onChange:g[1]||(g[1]=e=>r.value3=e),fixed:!1,safeAreaInsetBottom:!1},{default:o((()=>[_(C,{text:"首页",icon:"home",name:"home"}),_(C,{text:"放映厅",icon:"photo",name:"photo"}),_(C,{text:"直播",icon:"play-right",name:"play-right"}),_(C,{text:"我的",name:"account",icon:"account"})])),_:1},8,["value"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("自定义图标/颜色")])),_:1}),_(k,{value:r.value4,onChange:g[2]||(g[2]=e=>r.value4=e),fixed:!1,placeholder:!1,activeColor:"#d81e06",safeAreaInsetBottom:!1},{default:o((()=>[_(C,{text:"首页"},{"active-icon":o((()=>[_(y,{class:"u-page__item__slot-icon",src:"https://cdn.uviewui.com/uview/common/bell-selected.png"})])),"inactive-icon":o((()=>[_(y,{class:"u-page__item__slot-icon",src:"https://cdn.uviewui.com/uview/common/bell.png"})])),_:1}),_(C,{text:"放映厅",icon:"photo"}),_(C,{text:"直播",icon:"play-right"}),_(C,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("拦截切换事件(点击第二个标签)")])),_:1}),_(k,{value:r.value5,fixed:!1,onChange:f.change5,safeAreaInsetBottom:!1,placeholder:!1},{default:o((()=>[_(C,{text:"首页",icon:"home"}),_(C,{text:"放映厅",icon:"photo"}),_(C,{text:"直播",icon:"play-right"}),_(C,{text:"我的",icon:"account"})])),_:1},8,["value","onChange"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("去除上边框")])),_:1}),_(k,{value:r.value7,placeholder:!1,border:!1,onChange:g[3]||(g[3]=e=>r.value7=e),fixed:!1,safeAreaInsetBottom:!1},{default:o((()=>[_(C,{text:"首页",icon:"home"}),_(C,{text:"放映厅",icon:"photo"}),_(C,{text:"直播",icon:"play-right"}),_(C,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1}),_(b,{class:"u-page__item"},{default:o((()=>[_(x,{class:"u-page__item__title"},{default:o((()=>[h("固定在底部(固定在屏幕最下方)")])),_:1}),_(I,{height:"150"}),_(k,{value:r.value6,onChange:g[4]||(g[4]=e=>r.value6=e),fixed:!0,placeholder:!0,safeAreaInsetBottom:!0},{default:o((()=>[_(C,{onClick:f.goNext,text:"首页",icon:"home"},null,8,["onClick"]),_(C,{text:"放映厅",icon:"photo"}),_(C,{text:"直播",icon:"play-right"}),_(C,{text:"我的",icon:"account"})])),_:1},8,["value"])])),_:1})])),_:1})}],["__scopeId","data-v-8f23a463"]]);export{g as default};
