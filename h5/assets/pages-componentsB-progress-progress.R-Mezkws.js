import{_ as e,r as t,a,c,w as l,ar as o,i as s,o as u,g as n,m as _,t as r,M as d,n as p}from"./index-Bme5D8O8.js";const f=e({data:()=>({androidNvue:!1,percentage1:30,percentage2:40,percentage3:50,percentage4:60,percentage5:70,percentage6:50}),onLoad(){uni.$u.sleep(2500).then((()=>{this.percentage1=120}))},methods:{computedWidth(e){this.percentage6="plus"===e?uni.$u.range(0,100,this.percentage6+10):uni.$u.range(0,100,this.percentage6-10)}}},[["render",function(e,f,g,i,h,m){const b=p,k=t(a("up-line-progress"),o),v=s;return u(),c(v,{class:"u-page"},{default:l((()=>[n(v,{class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("基础功能")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{percentage:h.percentage1},null,8,["percentage"])])),_:1})])),_:1}),n(v,{class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("不显示百分比")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{showText:!1,percentage:h.percentage2},null,8,["percentage"])])),_:1})])),_:1}),n(v,{class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("自定义高度")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{height:"8",showText:!1,percentage:h.percentage3},null,8,["percentage"])])),_:1})])),_:1}),n(v,{class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("自定义颜色")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{height:"8",showText:!1,percentage:h.percentage4,activeColor:"#3c9cff",inactiveColor:"#f3f4f6"},null,8,["percentage"])])),_:1})])),_:1}),h.androidNvue?d("",!0):(u(),c(v,{key:0,class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("自定义样式(不支持安卓环境的nvue)")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{height:"8",showText:!1,percentage:h.percentage5,activeColor:"#3c9cff",inactiveColor:"#f3f4f6"},{default:l((()=>[n(b,{class:"u-percentage-slot"},{default:l((()=>[_(r(h.percentage4)+"%",1)])),_:1})])),_:1},8,["percentage"])])),_:1})])),_:1})),n(v,{class:"u-demo-block"},{default:l((()=>[n(b,{class:"u-demo-block__title"},{default:l((()=>[_("手动加减")])),_:1}),n(v,{class:"u-demo-block__content"},{default:l((()=>[n(k,{height:"8",showText:!1,percentage:h.percentage6,activeColor:"#3c9cff",inactiveColor:"#f3f4f6"},null,8,["percentage"]),n(v,{class:"button-group"},{default:l((()=>[n(v,{class:"button-group__circle","hover-class":"u-hover-class",onClick:f[0]||(f[0]=e=>m.computedWidth("minus"))},{default:l((()=>[n(b,{class:"button-group__circle__text"},{default:l((()=>[_("减少")])),_:1})])),_:1}),n(v,{class:"button-group__circle","hover-class":"u-hover-class",onClick:f[1]||(f[1]=e=>m.computedWidth("plus"))},{default:l((()=>[n(b,{class:"button-group__circle__text"},{default:l((()=>[_("增加")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-a5bb914f"]]);export{f as default};
