import{_ as s,c as a,w as t,r as e,aL as i,a as l,A as u,aQ as n,aR as r,aS as _,o,h as m,F as c,j as d,g as f,i as p,k as h,m as g,n as x,t as v}from"./index-BRmPopP0.js";const b=()=>{const s=[],a="A".charCodeAt(0);s.push("↑"),s.push("☆");for(let t=0;t<16;t++)s.push(String.fromCharCode(a+t));return s.push("#"),s};const j=s({data:()=>({indexList:b(),urls:["./static/uview/album/1.jpg","./static/uview/album/2.jpg","./static/uview/album/3.jpg","./static/uview/album/4.jpg","./static/uview/album/5.jpg","./static/uview/album/6.jpg","./static/uview/album/7.jpg","./static/uview/album/8.jpg","./static/uview/album/9.jpg","./static/uview/album/10.jpg"],names:["勇往无敌","疯狂的迪飙","磊爱可","梦幻梦幻梦","枫中飘瓢","飞翔天使","曾经第一","追风幻影族长","麦小姐","胡格罗雅","Red磊磊","乐乐立立","青龙爆风","跑跑卡叮车","山里狼","supersonic超"]}),computed:{itemArr(){return this.indexList.map((s=>{const a=[];for(let t=0;t<10;t++)a.push({name:this.names[uni.$u.random(0,this.names.length-1)],url:this.urls[uni.$u.random(0,this.urls.length-1)]});return a}))}},methods:{goNext(){uni.navigateTo({url:"indexList2"})}}},[["render",function(s,b,j,w,C,z){const L=e(l("up-avatar"),i),q=g,S=p,k=e(l("up-line"),u),A=e(l("up-index-anchor"),n),B=h,Q=e(l("up-index-item"),r),y=e(l("up-index-list"),_);return o(),a(y,{indexList:C.indexList},{header:t((()=>[f(S,{class:"list"},{default:t((()=>[f(S,{class:"list__item",onClick:z.goNext},{default:t((()=>[f(L,{shape:"square",size:"35",icon:"man-add-fill",fontSize:"26",randomBgColor:""}),f(q,{class:"list__item__user-name"},{default:t((()=>[x("新的朋友")])),_:1})])),_:1},8,["onClick"]),f(k),f(S,{class:"list__item"},{default:t((()=>[f(L,{shape:"square",size:"35",icon:"tags-fill",fontSize:"26",randomBgColor:""}),f(q,{class:"list__item__user-name"},{default:t((()=>[x("标签")])),_:1})])),_:1}),f(k),f(S,{class:"list__item"},{default:t((()=>[f(L,{shape:"square",size:"35",icon:"chrome-circle-fill",fontSize:"26",randomBgColor:""}),f(q,{class:"list__item__user-name"},{default:t((()=>[x("朋友圈")])),_:1})])),_:1}),f(k),f(S,{class:"list__item"},{default:t((()=>[f(L,{shape:"square",size:"35",icon:"qq-fill",fontSize:"26",randomBgColor:""}),f(q,{class:"list__item__user-name"},{default:t((()=>[x("QQ")])),_:1})])),_:1}),f(k)])),_:1})])),footer:t((()=>[f(S,{class:"u-safe-area-inset--bottom"},{default:t((()=>[f(q,{class:"list__footer"},{default:t((()=>[x("共305位好友")])),_:1})])),_:1})])),default:t((()=>[(o(!0),m(c,null,d(z.itemArr,((s,e)=>(o(),a(Q,{key:e},{default:t((()=>[f(A,{text:C.indexList[e]},null,8,["text"]),(o(!0),m(c,null,d(s,((s,e)=>(o(),a(S,{class:"list",key:e},{default:t((()=>[f(S,{class:"list__item"},{default:t((()=>[f(B,{class:"list__item__avatar",src:s.url},null,8,["src"]),f(q,{class:"list__item__user-name"},{default:t((()=>[x(v(s.name),1)])),_:2},1024)])),_:2},1024),f(k)])),_:2},1024)))),128))])),_:2},1024)))),128))])),_:1},8,["indexList"])}],["__scopeId","data-v-2f30e82b"]]);export{j as default};
