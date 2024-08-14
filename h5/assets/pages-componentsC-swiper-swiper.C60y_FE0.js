import{l as e,n as i,m as t,f as r,p as a,o as s,c as l,w as n,z as o,u,a as c,v as p,b as d,F as g,d as w,i as m,s as y,N as _,r as h,h as v,G as f,j as k,t as b,e as I,a0 as C,k as S,S as j}from"./index-DXb5--8b.js";import{_ as M}from"./u-loading-icon.CuWhVVhE.js";import{r as x}from"./uni-app.es.BeX3dk0a.js";import{_ as N}from"./_plugin-vue_export-helper.BCo6x5W8.js";import{_ as U}from"./u-gap.BszcnvSx.js";const A=N({name:"u-swiper-indicator",mixins:[t,r,e({props:{length:{type:[String,Number],default:()=>i.swiperIndicator.length},current:{type:[String,Number],default:()=>i.swiperIndicator.current},indicatorActiveColor:{type:String,default:()=>i.swiperIndicator.indicatorActiveColor},indicatorInactiveColor:{type:String,default:()=>i.swiperIndicator.indicatorInactiveColor},indicatorMode:{type:String,default:()=>i.swiperIndicator.indicatorMode}}})],data:()=>({lineWidth:22}),computed:{lineStyle(){let e={};return e.width=a(this.lineWidth),e.transform=`translateX(${a(this.current*this.lineWidth)})`,e.backgroundColor=this.indicatorActiveColor,e},dotStyle(){return e=>{let i={};return i.backgroundColor=e===this.current?this.indicatorActiveColor:this.indicatorInactiveColor,i}}},methods:{addUnit:a}},[["render",function(e,i,t,r,a,y){const _=m;return s(),l(_,{class:"u-swiper-indicator"},{default:n((()=>["line"===e.indicatorMode?(s(),l(_,{key:0,class:o(["u-swiper-indicator__wrapper",[`u-swiper-indicator__wrapper--${e.indicatorMode}`]]),style:u({width:y.addUnit(a.lineWidth*e.length),backgroundColor:e.indicatorInactiveColor})},{default:n((()=>[c(_,{class:"u-swiper-indicator__wrapper--line__bar",style:u([y.lineStyle])},null,8,["style"])])),_:1},8,["class","style"])):p("",!0),"dot"===e.indicatorMode?(s(),l(_,{key:1,class:"u-swiper-indicator__wrapper"},{default:n((()=>[(s(!0),d(g,null,w(e.length,((i,t)=>(s(),l(_,{class:o(["u-swiper-indicator__wrapper__dot",[t===e.current&&"u-swiper-indicator__wrapper__dot--active"]]),key:t,style:u([y.dotStyle(t)])},null,8,["class","style"])))),128))])),_:1})):p("",!0)])),_:1})}],["__scopeId","data-v-468e1395"]]);const T=N({name:"u-swiper",mixins:[t,r,e({props:{list:{type:Array,default:()=>i.swiper.list},indicator:{type:Boolean,default:()=>i.swiper.indicator},indicatorActiveColor:{type:String,default:()=>i.swiper.indicatorActiveColor},indicatorInactiveColor:{type:String,default:()=>i.swiper.indicatorInactiveColor},indicatorStyle:{type:[String,Object],default:()=>i.swiper.indicatorStyle},indicatorMode:{type:String,default:()=>i.swiper.indicatorMode},autoplay:{type:Boolean,default:()=>i.swiper.autoplay},current:{type:[String,Number],default:()=>i.swiper.current},currentItemId:{type:String,default:()=>i.swiper.currentItemId},interval:{type:[String,Number],default:()=>i.swiper.interval},duration:{type:[String,Number],default:()=>i.swiper.duration},circular:{type:Boolean,default:()=>i.swiper.circular},previousMargin:{type:[String,Number],default:()=>i.swiper.previousMargin},nextMargin:{type:[String,Number],default:()=>i.swiper.nextMargin},acceleration:{type:Boolean,default:()=>i.swiper.acceleration},displayMultipleItems:{type:Number,default:()=>i.swiper.displayMultipleItems},easingFunction:{type:String,default:()=>i.swiper.easingFunction},keyName:{type:String,default:()=>i.swiper.keyName},imgMode:{type:String,default:()=>i.swiper.imgMode},height:{type:[String,Number],default:()=>i.swiper.height},bgColor:{type:String,default:()=>i.swiper.bgColor},radius:{type:[String,Number],default:()=>i.swiper.radius},loading:{type:Boolean,default:()=>i.swiper.loading},showTitle:{type:Boolean,default:()=>i.swiper.showTitle}}})],data:()=>({currentIndex:0}),watch:{current(e,i){e!==i&&(this.currentIndex=e)}},emits:["click","change"],computed:{itemStyle(){return e=>{const i={};return this.nextMargin&&this.previousMargin&&(i.borderRadius=a(this.radius),e!==this.currentIndex&&(i.transform="scale(0.92)")),i}}},methods:{addStyle:y,addUnit:a,testObject:_.object,testImage:_.image,getItemType(e){return"string"==typeof e?_.video(this.getSource(e))?"video":"image":"object"==typeof e&&this.keyName?e.type?"image"===e.type?"image":"video"===e.type?"video":"image":_.video(this.getSource(e))?"video":"image":void 0},getSource(e){return"string"==typeof e?e:"object"==typeof e&&this.keyName?e[this.keyName]:""},change(e){const{current:i}=e.detail;this.pauseVideo(this.currentIndex),this.currentIndex=i,this.$emit("change",e.detail)},pauseVideo(e){const i=this.getSource(this.list[e]);if(_.video(i)){uni.createVideoContext(`video-${e}`,this).pause()}},getPoster:e=>"object"==typeof e&&e.poster?e.poster:"",clickHandler(e){this.$emit("click",e)}}},[["render",function(e,i,t,r,a,o){const y=x(h("up-loading-icon"),M),_=m,N=I,U=C,T=S,$=j,B=f,F=x(h("up-swiper-indicator"),A);return s(),l(_,{class:"u-swiper",style:u({backgroundColor:e.bgColor,height:o.addUnit(e.height),borderRadius:o.addUnit(e.radius)})},{default:n((()=>[e.loading?(s(),l(_,{key:0,class:"u-swiper__loading"},{default:n((()=>[c(y,{mode:"circle"})])),_:1})):(s(),l(B,{key:1,class:"u-swiper__wrapper",style:u({flex:"1",height:o.addUnit(e.height)}),onChange:o.change,circular:e.circular,interval:e.interval,duration:e.duration,autoplay:e.autoplay,current:e.current,currentItemId:e.currentItemId,previousMargin:o.addUnit(e.previousMargin),nextMargin:o.addUnit(e.nextMargin),acceleration:e.acceleration,displayMultipleItems:e.displayMultipleItems,easingFunction:e.easingFunction},{default:n((()=>[(s(!0),d(g,null,w(e.list,((i,t)=>(s(),l($,{class:"u-swiper__wrapper__item",key:t},{default:n((()=>[v(e.$slots,"default",{item:i,index:t},(()=>[c(_,{class:"u-swiper__wrapper__item__wrapper",style:u([o.itemStyle(t)])},{default:n((()=>["image"===o.getItemType(i)?(s(),l(N,{key:0,class:"u-swiper__wrapper__item__wrapper__image",src:o.getSource(i),mode:e.imgMode,onClick:e=>o.clickHandler(t),style:u({height:o.addUnit(e.height),borderRadius:o.addUnit(e.radius)})},null,8,["src","mode","onClick","style"])):p("",!0),"video"===o.getItemType(i)?(s(),l(U,{key:1,class:"u-swiper__wrapper__item__wrapper__video",id:`video-${t}`,"enable-progress-gesture":!1,src:o.getSource(i),poster:o.getPoster(i),title:e.showTitle&&o.testObject(i)&&i.title?i.title:"",style:u({height:o.addUnit(e.height)}),controls:"",onClick:e=>o.clickHandler(t)},null,8,["id","src","poster","title","style","onClick"])):p("",!0),e.showTitle&&o.testObject(i)&&i.title&&o.testImage(o.getSource(i))?(s(),l(_,{key:2,class:"u-swiper__wrapper__item__wrapper__title"},{default:n((()=>[c(T,{class:"u-line-1"},{default:n((()=>[k(b(i.title),1)])),_:2},1024)])),_:2},1024)):p("",!0)])),_:2},1032,["style"])]),!0)])),_:2},1024)))),128))])),_:3},8,["style","onChange","circular","interval","duration","autoplay","current","currentItemId","previousMargin","nextMargin","acceleration","displayMultipleItems","easingFunction"])),c(_,{class:"u-swiper__indicator",style:u([o.addStyle(e.indicatorStyle)])},{default:n((()=>[v(e.$slots,"indicator",{},(()=>[e.loading||!e.indicator||e.showTitle?p("",!0):(s(),l(F,{key:0,indicatorActiveColor:e.indicatorActiveColor,indicatorInactiveColor:e.indicatorInactiveColor,length:e.list.length,current:a.currentIndex,indicatorMode:e.indicatorMode},null,8,["indicatorActiveColor","indicatorInactiveColor","length","current","indicatorMode"]))]),!0)])),_:3},8,["style"])])),_:3},8,["style"])}],["__scopeId","data-v-76f28bee"]]);const $=N({data:()=>({current:0,currentNum:0,list:[{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png",title:"昨夜星辰昨夜风，画楼西畔桂堂东",poster:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list1:["https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png"],list2:[{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"昨夜星辰昨夜风，画楼西畔桂堂东",type:"image"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list3:["https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"],list4:[{url:"https://uview-plus.jiangruyi.com/uview/resources/video.mp4",title:"昨夜星辰昨夜风，画楼西畔桂堂东",poster:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"},{url:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{url:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list5:["https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"],list6:["https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"]}),methods:{change(e){},click(e){console.log("click",e)}}},[["render",function(e,i,t,r,a,u){const p=S,y=x(h("up-swiper"),T),_=m,v=I,f=x(h("up-gap"),U);return s(),l(_,{class:"u-page"},{default:n((()=>[c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("基础功能")])),_:1}),c(y,{list:a.list1,onChange:u.change,onClick:u.click},null,8,["list","onChange","onClick"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("带标题")])),_:1}),c(y,{list:a.list2,keyName:"image",showTitle:"",autoplay:!1,circular:""},null,8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("带指示器")])),_:1}),c(y,{list:a.list3,indicator:"",indicatorMode:"line",circular:""},null,8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("加载中")])),_:1}),c(y,{list:a.list3,loading:""},null,8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("嵌入视频")])),_:1}),c(y,{list:a.list4,keyName:"url",autoplay:!1},null,8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("自定义内容")])),_:1}),c(y,{list:a.list2,keyName:"image",showTitle:"",autoplay:!1,circular:""},{default:n((e=>[c(v,{src:e.item.image},null,8,["src"])])),_:1},8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("自定义指示器")])),_:1}),c(y,{list:a.list5,onChange:i[0]||(i[0]=e=>a.current=e.current),autoplay:!1},{indicator:n((()=>[c(_,{class:"indicator"},{default:n((()=>[(s(!0),d(g,null,w(a.list5,((e,i)=>(s(),l(_,{class:o(["indicator__dot",[i===a.current&&"indicator__dot--active"]]),key:i},null,8,["class"])))),128))])),_:1})])),_:1},8,["list"]),c(f,{bgColor:"transparent",height:"15"}),c(y,{list:a.list6,onChange:i[1]||(i[1]=e=>a.currentNum=e.current),autoplay:!1,indicatorStyle:"right: 20px"},{indicator:n((()=>[c(_,{class:"indicator-num"},{default:n((()=>[c(p,{class:"indicator-num__text"},{default:n((()=>[k(b(a.currentNum+1)+"/"+b(a.list6.length),1)])),_:1})])),_:1})])),_:1},8,["list"])])),_:1}),c(_,{class:"u-demo-block"},{default:n((()=>[c(p,{class:"u-demo-block__title"},{default:n((()=>[k("卡片式")])),_:1}),c(y,{list:a.list3,previousMargin:"30",nextMargin:"30",circular:"",autoplay:!1,radius:"5",bgColor:"#ffffff"},null,8,["list"])])),_:1})])),_:1})}],["__scopeId","data-v-49c60baa"]]);export{$ as default};