import{l as e,m as i,f as t,n as r,o as a,c as s,w as l,y as n,s as o,a as u,u as p,b as c,F as d,r as g,i as w,q as m,M as y,d as _,j as h,t as v,h as f,e as k,Z as b,k as I,S,E as C}from"./index-140fc608.js";import{_ as j}from"./u-loading-icon.842fa7a3.js";import{r as M}from"./uni-app.es.432a22c1.js";import{_ as x}from"./_plugin-vue_export-helper.1b428a4d.js";import{_ as N}from"./u-gap.5d13bee3.js";const U=x({name:"u-swiper-indicator",mixins:[i,t,{props:{length:{type:[String,Number],default:()=>e.swiperIndicator.length},current:{type:[String,Number],default:()=>e.swiperIndicator.current},indicatorActiveColor:{type:String,default:()=>e.swiperIndicator.indicatorActiveColor},indicatorInactiveColor:{type:String,default:()=>e.swiperIndicator.indicatorInactiveColor},indicatorMode:{type:String,default:()=>e.swiperIndicator.indicatorMode}}}],data:()=>({lineWidth:22}),computed:{lineStyle(){let e={};return e.width=r(this.lineWidth),e.transform=`translateX(${r(this.current*this.lineWidth)})`,e.backgroundColor=this.indicatorActiveColor,e},dotStyle(){return e=>{let i={};return i.backgroundColor=e===this.current?this.indicatorActiveColor:this.indicatorInactiveColor,i}}},methods:{addUnit:r}},[["render",function(e,i,t,r,m,y){const _=w;return a(),s(_,{class:"u-swiper-indicator"},{default:l((()=>["line"===e.indicatorMode?(a(),s(_,{key:0,class:n(["u-swiper-indicator__wrapper",[`u-swiper-indicator__wrapper--${e.indicatorMode}`]]),style:o({width:y.addUnit(m.lineWidth*e.length),backgroundColor:e.indicatorInactiveColor})},{default:l((()=>[u(_,{class:"u-swiper-indicator__wrapper--line__bar",style:o([y.lineStyle])},null,8,["style"])])),_:1},8,["class","style"])):p("",!0),"dot"===e.indicatorMode?(a(),s(_,{key:1,class:"u-swiper-indicator__wrapper"},{default:l((()=>[(a(!0),c(d,null,g(e.length,((i,t)=>(a(),s(_,{class:n(["u-swiper-indicator__wrapper__dot",[t===e.current&&"u-swiper-indicator__wrapper__dot--active"]]),key:t,style:o([y.dotStyle(t)])},null,8,["class","style"])))),128))])),_:1})):p("",!0)])),_:1})}],["__scopeId","data-v-2916d719"]]);const A=x({name:"u-swiper",mixins:[i,t,{props:{list:{type:Array,default:()=>e.swiper.list},indicator:{type:Boolean,default:()=>e.swiper.indicator},indicatorActiveColor:{type:String,default:()=>e.swiper.indicatorActiveColor},indicatorInactiveColor:{type:String,default:()=>e.swiper.indicatorInactiveColor},indicatorStyle:{type:[String,Object],default:()=>e.swiper.indicatorStyle},indicatorMode:{type:String,default:()=>e.swiper.indicatorMode},autoplay:{type:Boolean,default:()=>e.swiper.autoplay},current:{type:[String,Number],default:()=>e.swiper.current},currentItemId:{type:String,default:()=>e.swiper.currentItemId},interval:{type:[String,Number],default:()=>e.swiper.interval},duration:{type:[String,Number],default:()=>e.swiper.duration},circular:{type:Boolean,default:()=>e.swiper.circular},previousMargin:{type:[String,Number],default:()=>e.swiper.previousMargin},nextMargin:{type:[String,Number],default:()=>e.swiper.nextMargin},acceleration:{type:Boolean,default:()=>e.swiper.acceleration},displayMultipleItems:{type:Number,default:()=>e.swiper.displayMultipleItems},easingFunction:{type:String,default:()=>e.swiper.easingFunction},keyName:{type:String,default:()=>e.swiper.keyName},imgMode:{type:String,default:()=>e.swiper.imgMode},height:{type:[String,Number],default:()=>e.swiper.height},bgColor:{type:String,default:()=>e.swiper.bgColor},radius:{type:[String,Number],default:()=>e.swiper.radius},loading:{type:Boolean,default:()=>e.swiper.loading},showTitle:{type:Boolean,default:()=>e.swiper.showTitle}}}],data:()=>({currentIndex:0}),watch:{current(e,i){e!==i&&(this.currentIndex=e)}},emits:["click","change"],computed:{itemStyle(){return e=>{const i={};return this.nextMargin&&this.previousMargin&&(i.borderRadius=r(this.radius),e!==this.currentIndex&&(i.transform="scale(0.92)")),i}}},methods:{addStyle:m,addUnit:r,testObject:y.object,testImage:y.image,getItemType(e){return"string"==typeof e?y.video(this.getSource(e))?"video":"image":"object"==typeof e&&this.keyName?e.type?"image"===e.type?"image":"video"===e.type?"video":"image":y.video(this.getSource(e))?"video":"image":void 0},getSource(e){return"string"==typeof e?e:"object"==typeof e&&this.keyName?e[this.keyName]:""},change(e){const{current:i}=e.detail;this.pauseVideo(this.currentIndex),this.currentIndex=i,this.$emit("change",e.detail)},pauseVideo(e){const i=this.getSource(this.list[e]);if(y.video(i)){uni.createVideoContext(`video-${e}`,this).pause()}},getPoster:e=>"object"==typeof e&&e.poster?e.poster:"",clickHandler(e){this.$emit("click",e)}}},[["render",function(e,i,t,r,n,m){const y=M(_("u-loading-icon"),j),x=w,N=k,A=b,T=I,$=S,B=C,F=M(_("u-swiper-indicator"),U);return a(),s(x,{class:"u-swiper",style:o({backgroundColor:e.bgColor,height:m.addUnit(e.height),borderRadius:m.addUnit(e.radius)})},{default:l((()=>[e.loading?(a(),s(x,{key:0,class:"u-swiper__loading"},{default:l((()=>[u(y,{mode:"circle"})])),_:1})):(a(),s(B,{key:1,class:"u-swiper__wrapper",style:o({flex:"1",height:m.addUnit(e.height)}),onChange:m.change,circular:e.circular,interval:e.interval,duration:e.duration,autoplay:e.autoplay,current:e.current,currentItemId:e.currentItemId,previousMargin:m.addUnit(e.previousMargin),nextMargin:m.addUnit(e.nextMargin),acceleration:e.acceleration,displayMultipleItems:e.displayMultipleItems,easingFunction:e.easingFunction},{default:l((()=>[(a(!0),c(d,null,g(e.list,((i,t)=>(a(),s($,{class:"u-swiper__wrapper__item",key:t},{default:l((()=>[u(x,{class:"u-swiper__wrapper__item__wrapper",style:o([m.itemStyle(t)])},{default:l((()=>["image"===m.getItemType(i)?(a(),s(N,{key:0,class:"u-swiper__wrapper__item__wrapper__image",src:m.getSource(i),mode:e.imgMode,onClick:e=>m.clickHandler(t),style:o({height:m.addUnit(e.height),borderRadius:m.addUnit(e.radius)})},null,8,["src","mode","onClick","style"])):p("",!0),"video"===m.getItemType(i)?(a(),s(A,{key:1,class:"u-swiper__wrapper__item__wrapper__video",id:`video-${t}`,"enable-progress-gesture":!1,src:m.getSource(i),poster:m.getPoster(i),title:e.showTitle&&m.testObject(i)&&i.title?i.title:"",style:o({height:m.addUnit(e.height)}),controls:"",onClick:e=>m.clickHandler(t)},null,8,["id","src","poster","title","style","onClick"])):p("",!0),e.showTitle&&m.testObject(i)&&i.title&&m.testImage(m.getSource(i))?(a(),s(T,{key:2,class:"u-swiper__wrapper__item__wrapper__title u-line-1"},{default:l((()=>[h(v(i.title),1)])),_:2},1024)):p("",!0)])),_:2},1032,["style"])])),_:2},1024)))),128))])),_:1},8,["style","onChange","circular","interval","duration","autoplay","current","currentItemId","previousMargin","nextMargin","acceleration","displayMultipleItems","easingFunction"])),u(x,{class:"u-swiper__indicator",style:o([m.addStyle(e.indicatorStyle)])},{default:l((()=>[f(e.$slots,"indicator",{},(()=>[e.loading||!e.indicator||e.showTitle?p("",!0):(a(),s(F,{key:0,indicatorActiveColor:e.indicatorActiveColor,indicatorInactiveColor:e.indicatorInactiveColor,length:e.list.length,current:n.currentIndex,indicatorMode:e.indicatorMode},null,8,["indicatorActiveColor","indicatorInactiveColor","length","current","indicatorMode"]))]),!0)])),_:3},8,["style"])])),_:3},8,["style"])}],["__scopeId","data-v-04f2fc4f"]]);const T=x({data:()=>({current:0,currentNum:0,list:[{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png",title:"昨夜星辰昨夜风，画楼西畔桂堂东",poster:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list1:["https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png"],list2:[{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"昨夜星辰昨夜风，画楼西畔桂堂东",type:"image"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{image:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list3:["https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"],list4:[{url:"https://uview-plus.jiangruyi.com/uview/resources/video.mp4",title:"昨夜星辰昨夜风，画楼西畔桂堂东",poster:"https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"},{url:"https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png",title:"身无彩凤双飞翼，心有灵犀一点通"},{url:"https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png",title:"谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳"}],list5:["https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"],list6:["https://uview-plus.jiangruyi.com/uview/swiper/swiper2.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper3.png","https://uview-plus.jiangruyi.com/uview/swiper/swiper1.png"]}),methods:{change(e){},click(e){console.log("click",e)}}},[["render",function(e,i,t,r,o,p){const m=I,y=M(_("up-swiper"),A),f=w,k=M(_("up-gap"),N);return a(),s(f,{class:"u-page"},{default:l((()=>[u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("基础功能")])),_:1}),u(y,{list:o.list1,onChange:p.change,onClick:p.click},null,8,["list","onChange","onClick"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("带标题")])),_:1}),u(y,{list:o.list2,keyName:"image",showTitle:"",autoplay:!1,circular:""},null,8,["list"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("带指示器")])),_:1}),u(y,{list:o.list3,indicator:"",indicatorMode:"line",circular:""},null,8,["list"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("加载中")])),_:1}),u(y,{list:o.list3,loading:""},null,8,["list"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("嵌入视频")])),_:1}),u(y,{list:o.list4,keyName:"url",autoplay:!1},null,8,["list"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("自定义指示器")])),_:1}),u(y,{list:o.list5,onChange:i[0]||(i[0]=e=>o.current=e.current),autoplay:!1},{default:l((()=>[u(f,{slot:"indicator",class:"indicator"},{default:l((()=>[(a(!0),c(d,null,g(o.list5,((e,i)=>(a(),s(f,{class:n(["indicator__dot",[i===o.current&&"indicator__dot--active"]]),key:i},null,8,["class"])))),128))])),_:1})])),_:1},8,["list"]),u(k,{bgColor:"transparent",height:"15"}),u(y,{list:o.list6,onChange:i[1]||(i[1]=e=>o.currentNum=e.current),autoplay:!1,indicatorStyle:"right: 20px"},{default:l((()=>[u(f,{slot:"indicator",class:"indicator-num"},{default:l((()=>[u(m,{class:"indicator-num__text"},{default:l((()=>[h(v(o.currentNum+1)+"/"+v(o.list6.length),1)])),_:1})])),_:1})])),_:1},8,["list"])])),_:1}),u(f,{class:"u-demo-block"},{default:l((()=>[u(m,{class:"u-demo-block__title"},{default:l((()=>[h("卡片式")])),_:1}),u(y,{list:o.list3,previousMargin:"30",nextMargin:"30",circular:"",autoplay:!1,radius:"5",bgColor:"#ffffff"},null,8,["list"])])),_:1})])),_:1})}],["__scopeId","data-v-3d7dee01"]]);export{T as default};
