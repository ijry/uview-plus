import{_ as s}from"./u-button.DGMxXTXs.js";import{r as t,o as a,b as e,a as i,w as l,F as u,j as o,c as r,d as n,v as m,k as _,i as p,t as d,e as c}from"./index-CXXRRuMq.js";import{r as f}from"./uni-app.es.BNkCRunp.js";import{_ as h}from"./u-avatar.B-D8vRHv.js";import{_ as j}from"./u-line.095seISH.js";import{_ as g,a as w,b}from"./u-index-list.BWvKzjtf.js";import{_ as v}from"./u-popup.Cn8zhNu1.js";import{_ as x}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./u-loading-icon.C1waypw1.js";import"./u-icon.1lf6jBTT.js";import"./u-text.CypMxEsz.js";import"./u-link.1XxFcH2w.js";import"./u-transition.B-xKlpj3.js";import"./u-overlay.DQP19lh7.js";import"./u-status-bar.DWodaReQ.js";import"./u-safe-bottom.x9ya_L3h.js";const z=()=>{const s=[],t="A".charCodeAt(0);s.push("↑"),s.push("☆");for(let a=0;a<10;a++)s.push(String.fromCharCode(t+a));return s.push("#"),s};const C=x({data:()=>({show:!1,indexList:z(),urls:["./static/uview/album/1.jpg","./static/uview/album/2.jpg","./static/uview/album/3.jpg","./static/uview/album/4.jpg","./static/uview/album/5.jpg","./static/uview/album/6.jpg","./static/uview/album/7.jpg","./static/uview/album/8.jpg","./static/uview/album/9.jpg","./static/uview/album/10.jpg"],names:["勇往无敌","疯狂的迪飙","磊爱可","梦幻梦幻梦","枫中飘瓢","飞翔天使","曾经第一","追风幻影族长","麦小姐","胡格罗雅","Red磊磊","乐乐立立","青龙爆风","跑跑卡叮车","山里狼","supersonic超"]}),computed:{itemArr(){return this.indexList.map((s=>{const t=[];for(let a=0;a<10;a++)t.push({name:this.names[uni.$u.random(0,this.names.length-1)],url:this.urls[uni.$u.random(0,this.urls.length-1)]});return t}))}}},[["render",function(x,z,C,y,L,k){const q=f(t("up-button"),s),A=f(t("up-avatar"),h),B=_,S=p,I=f(t("up-line"),j),Q=f(t("up-index-anchor"),g),$=c,D=f(t("up-index-item"),w),E=f(t("up-index-list"),b),F=f(t("up-popup"),v);return a(),e(u,null,[i(q,{type:"primary",size:"small",style:{width:"120px"},onClick:z[0]||(z[0]=s=>L.show=!0)},{default:l((()=>[o("打开弹窗")])),_:1}),i(F,{show:L.show,"onUpdate:show":z[1]||(z[1]=s=>L.show=s),safeAreaInsetBottom:!1},{default:l((()=>[L.show?(a(),r(S,{key:0},{default:l((()=>[i(E,{style:{height:"600px"},indexList:L.indexList},{header:l((()=>[i(S,{class:"list"},{default:l((()=>[i(S,{class:"list__item"},{default:l((()=>[i(A,{shape:"square",size:"35",icon:"man-add-fill",fontSize:"26",randomBgColor:""}),i(B,{class:"list__item__user-name"},{default:l((()=>[o("新的朋友")])),_:1})])),_:1}),i(I),i(S,{class:"list__item"},{default:l((()=>[i(A,{shape:"square",size:"35",icon:"tags-fill",fontSize:"26",randomBgColor:""}),i(B,{class:"list__item__user-name"},{default:l((()=>[o("标签")])),_:1})])),_:1}),i(I),i(S,{class:"list__item"},{default:l((()=>[i(A,{shape:"square",size:"35",icon:"chrome-circle-fill",fontSize:"26",randomBgColor:""}),i(B,{class:"list__item__user-name"},{default:l((()=>[o("朋友圈")])),_:1})])),_:1}),i(I),i(S,{class:"list__item"},{default:l((()=>[i(A,{shape:"square",size:"35",icon:"qq-fill",fontSize:"26",randomBgColor:""}),i(B,{class:"list__item__user-name"},{default:l((()=>[o("QQ")])),_:1})])),_:1}),i(I)])),_:1})])),footer:l((()=>[i(S,{class:"u-safe-area-inset--bottom"},{default:l((()=>[i(B,{class:"list__footer"},{default:l((()=>[o("共305位好友")])),_:1})])),_:1})])),default:l((()=>[(a(!0),e(u,null,n(k.itemArr,((s,t)=>(a(),r(D,{key:t},{default:l((()=>[i(Q,{text:L.indexList[t]},null,8,["text"]),(a(!0),e(u,null,n(s,((s,t)=>(a(),r(S,{class:"list",key:t},{default:l((()=>[i(S,{class:"list__item"},{default:l((()=>[i($,{class:"list__item__avatar",src:s.url},null,8,["src"]),i(B,{class:"list__item__user-name"},{default:l((()=>[o(d(s.name),1)])),_:2},1024)])),_:2},1024),i(I)])),_:2},1024)))),128))])),_:2},1024)))),128))])),_:1},8,["indexList"])])),_:1})):m("",!0)])),_:1},8,["show"])],64)}],["__scopeId","data-v-e74c1146"]]);export{C as default};
