import{o as t,c as e,w as a,h as n,j as s,i as o,a as i,k as u,d as l}from"./index-96750431.js";import{_ as c}from"./_plugin-vue_export-helper.1b428a4d.js";import{r}from"./uni-app.es.e741ebf3.js";import{_ as p}from"./u-button.a3f9a953.js";import"./u-loading-icon.87c868c3.js";import"./u-icon.8df015ac.js";const _=c({name:"xy-copy",props:{content:{type:String,default:""},alertStyle:{type:String,default:"toast"},notice:{type:String,default:"复制成功"}},emits:["success"],methods:{handleClick(){let t=this.content;if(!t)return uni.showToast({title:"暂无",icon:"none",duration:2e3}),!1;t="string"==typeof t?t:t.toString();let e=this;uni.setClipboardData({data:t,success:function(){"modal"==e.alertStyle?uni.showModal({title:"提示",content:e.notice}):uni.showToast({title:e.notice,icon:"none"}),e.$emit("success")},fail:function(){uni.showToast({title:"复制失败",icon:"none",duration:3e3})}})}}},[["render",function(i,u,l,c,r,p){const _=o;return t(),e(_,{onClick:p.handleClick},{default:a((()=>[n(i.$slots,"default",{},(()=>[s("复制")]))])),_:3},8,["onClick"])}]]);const d=c({},[["render",function(n,c){const d=u,f=r(l("up-copy"),_),m=o,g=r(l("up-button"),p);return t(),e(m,{class:"u-page"},{default:a((()=>[i(m,{class:"u-page__item"},{default:a((()=>[i(d,{class:"u-page__item__title",style:{"margin-top":"0"}},{default:a((()=>[s("点击文字复制")])),_:1}),i(m,{class:"u-page__item__content"},{default:a((()=>[i(f,{content:"uview-plus is great !"},{default:a((()=>[i(d,null,{default:a((()=>[s("点击复制")])),_:1})])),_:1})])),_:1})])),_:1}),i(m,{class:"u-page__item"},{default:a((()=>[i(d,{class:"u-page__item__title",style:{"margin-top":"0"}},{default:a((()=>[s("点击按钮复制")])),_:1}),i(m,{class:"u-page__item__content"},{default:a((()=>[i(f,{content:"uview-plus is great !"},{default:a((()=>[i(g,{type:"primary"},{default:a((()=>[s("点击复制")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}]]);export{d as default};