import{_ as e,r as t,u as l,a,o as i,f as s,w as n,i as m,h as u,j as c,F as o,g as p,m as d,t as r,L as k,K as L,k as f}from"./index-DYX2crL2.js";const g=e({data:()=>({commentList:[]}),onLoad(){this.getComment()},methods:{toAllReply(){uni.navigateTo({url:"/pages/template/comment/reply"})},getLike(e){this.commentList[e].isLike=!this.commentList[e].isLike,1==this.commentList[e].isLike?this.commentList[e].likeNum++:this.commentList[e].likeNum--},getComment(){this.commentList=[{id:1,name:"叶轻眉",date:"12-25 18:58",contentText:"我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的",url:"https://cdn.uviewui.com/uview/template/SmilingDog.jpg",allReply:12,likeNum:33,isLike:!1,replyList:[{name:"uview",contentStr:"uview是基于uniapp的一个UI框架，代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！"},{name:"粘粘",contentStr:"今天吃什么，明天吃什么，晚上吃什么，我只是一只小猫咪为什么要烦恼这么多"}]},{id:2,name:"叶轻眉1",date:"01-25 13:58",contentText:"我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的",allReply:0,likeNum:11,isLike:!1,url:"https://cdn.uviewui.com/uview/template/niannian.jpg"},{id:3,name:"叶轻眉2",date:"03-25 13:58",contentText:"我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的",allReply:0,likeNum:21,isLike:!1,allReply:2,url:"../../../static/logo.png",replyList:[{name:"uview",contentStr:"uview是基于uniapp的一个UI框架，代码优美简洁，宇宙超级无敌彩虹旋转好用，用它！"},{name:"豆包",contentStr:"想吃冰糖葫芦粘豆包，但没钱5555........."}]},{id:4,name:"叶轻眉3",date:"06-20 13:58",contentText:"我不信伊朗会没有后续反应，美国肯定会为今天的事情付出代价的",url:"https://cdn.uviewui.com/uview/template/SmilingDog.jpg",allReply:0,likeNum:150,isLike:!1}]}}},[["render",function(e,g,y,h,_,v){const w=f,x=m,C=t(a("up-icon"),l);return i(),s(x,null,{default:n((()=>[(i(!0),u(o,null,c(_.commentList,((e,t)=>(i(),s(x,{class:"comment",key:e.id},{default:n((()=>[p(x,{class:"left"},{default:n((()=>[p(w,{src:e.url,mode:"aspectFill"},null,8,["src"])])),_:2},1024),p(x,{class:"right"},{default:n((()=>[p(x,{class:"top"},{default:n((()=>[p(x,{class:"name"},{default:n((()=>[d(r(e.name),1)])),_:2},1024),p(x,{class:k(["like",{highlight:e.isLike}])},{default:n((()=>[p(x,{class:"num"},{default:n((()=>[d(r(e.likeNum),1)])),_:2},1024),e.isLike?L("",!0):(i(),s(C,{key:0,name:"thumb-up",size:30,color:"#9a9a9a",onClick:e=>v.getLike(t)},null,8,["onClick"])),e.isLike?(i(),s(C,{key:1,name:"thumb-up-fill",size:30,onClick:e=>v.getLike(t)},null,8,["onClick"])):L("",!0)])),_:2},1032,["class"])])),_:2},1024),p(x,{class:"content"},{default:n((()=>[d(r(e.contentText),1)])),_:2},1024),p(x,{class:"reply-box"},{default:n((()=>[(i(!0),u(o,null,c(e.replyList,((e,t)=>(i(),s(x,{class:"item",key:e.index},{default:n((()=>[p(x,{class:"username"},{default:n((()=>[d(r(e.name),1)])),_:2},1024),p(x,{class:"text"},{default:n((()=>[d(r(e.contentStr),1)])),_:2},1024)])),_:2},1024)))),128)),null!=e.replyList?(i(),s(x,{key:0,class:"all-reply",onClick:v.toAllReply},{default:n((()=>[d(" 共"+r(e.allReply)+"条回复 ",1),p(C,{class:"more",name:"arrow-right",size:26})])),_:2},1032,["onClick"])):L("",!0)])),_:2},1024),p(x,{class:"bottom"},{default:n((()=>[d(r(e.date)+" ",1),p(x,{class:"reply"},{default:n((()=>[d("回复")])),_:1})])),_:2},1024)])),_:2},1024)])),_:2},1024)))),128))])),_:1})}],["__scopeId","data-v-57f29e03"]]);export{g as default};
