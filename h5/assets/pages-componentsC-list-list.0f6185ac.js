import{_ as u}from"./u-avatar.f4485169.js";import{o as t,c as i,w as e,a as s,b as o,r as a,F as l,d as r,i as m}from"./index.639d3d9d.js";import{r as p}from"./uni-app.es.f87317fd.js";import{_ as c}from"./u-cell.572d7e8b.js";import{_ as d,a as n}from"./u-list.5efd21a6.js";import{_ as v}from"./plugin-vue_export-helper.21dcd24c.js";import"./u-icon.8fecb8b7.js";import"./u--text.0e961fc9.js";import"./u-link.8313c57b.js";import"./u-line.e68cb869.js";var w=v({data:()=>({indexList:[],urls:["https://cdn.uviewui.com/uview/album/1.jpg","https://cdn.uviewui.com/uview/album/2.jpg","https://cdn.uviewui.com/uview/album/3.jpg","https://cdn.uviewui.com/uview/album/4.jpg","https://cdn.uviewui.com/uview/album/5.jpg","https://cdn.uviewui.com/uview/album/6.jpg","https://cdn.uviewui.com/uview/album/7.jpg","https://cdn.uviewui.com/uview/album/8.jpg","https://cdn.uviewui.com/uview/album/9.jpg","https://cdn.uviewui.com/uview/album/10.jpg"]}),onLoad(){this.loadmore()},methods:{scrolltolower(){this.loadmore()},loadmore(){for(let u=0;u<30;u++)this.indexList.push({url:this.urls[uni.$u.random(0,this.urls.length-1)]})}}},[["render",function(v,w,h,j,f,b){const g=p(r("u-avatar"),u),_=p(r("u-cell"),c),x=p(r("u-list-item"),d),L=p(r("u-list"),n),S=m;return t(),i(S,{class:"u-page"},{default:e((()=>[s(L,{onScrolltolower:b.scrolltolower},{default:e((()=>[(t(!0),o(l,null,a(f.indexList,((u,o)=>(t(),i(x,{key:o},{default:e((()=>[s(_,{title:`列表长度-${o+1}`},{icon:e((()=>[s(g,{shape:"square",size:"35",src:u.url,customStyle:"margin: -3px 5px -3px 0"},null,8,["src"])])),_:2},1032,["title"])])),_:2},1024)))),128))])),_:1},8,["onScrolltolower"])])),_:1})}],["__scopeId","data-v-1307b045"]]);export{w as default};
