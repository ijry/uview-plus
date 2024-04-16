import{l as e,m as t,f as a,A as l,q as o,n as s,x as c,B as i,C as u,d as n,o as d,c as _,w as r,a as m,D as f,b as h,F as v,r as p,y as g,s as b,u as k,i as I,j as y,k as C}from"./index-140fc608.js";import{_ as V}from"./u-icon.f3757cb0.js";import{r as x}from"./uni-app.es.432a22c1.js";import{_ as z}from"./_plugin-vue_export-helper.1b428a4d.js";const w=z({name:"u-rate",mixins:[t,a,{props:{modelValue:{type:[String,Number],default:()=>e.rate.value},count:{type:[String,Number],default:()=>e.rate.count},disabled:{type:Boolean,default:()=>e.rate.disabled},readonly:{type:Boolean,default:()=>e.rate.readonly},size:{type:[String,Number],default:()=>e.rate.size},inactiveColor:{type:String,default:()=>e.rate.inactiveColor},activeColor:{type:String,default:()=>e.rate.activeColor},gutter:{type:[String,Number],default:()=>e.rate.gutter},minCount:{type:[String,Number],default:()=>e.rate.minCount},allowHalf:{type:Boolean,default:()=>e.rate.allowHalf},activeIcon:{type:String,default:()=>e.rate.activeIcon},inactiveIcon:{type:String,default:()=>e.rate.inactiveIcon},touchable:{type:Boolean,default:()=>e.rate.touchable}}}],data(){return{elId:l(),elClass:l(),rateBoxLeft:0,activeIndex:this.modelValue,rateWidth:0,moving:!1}},watch:{modelValue(e){this.activeIndex=e},activeIndex:"emitEvent"},emits:["update:modelValue","change"],methods:{addStyle:o,addUnit:s,init(){c().then((()=>{this.getRateItemRect(),this.getRateIconWrapRect()}))},async getRateItemRect(){await c(),this.$uGetRect("#"+this.elId).then((e=>{this.rateBoxLeft=e.left}))},getRateIconWrapRect(){this.$uGetRect("."+this.elClass).then((e=>{this.rateWidth=e.width}))},touchMove(e){if(!this.touchable)return;this.preventEvent(e);const t=e.changedTouches[0].pageX;this.getActiveIndex(t)},touchEnd(e){if(!this.touchable)return;this.preventEvent(e);const t=e.changedTouches[0].pageX;this.getActiveIndex(t)},clickHandler(e,t){if("ios"===i()&&this.moving)return;this.preventEvent(e);let a=0;a=e.changedTouches[0].pageX,this.getActiveIndex(a,!0)},emitEvent(){this.$emit("change",this.activeIndex),this.$emit("update:modelValue",this.activeIndex)},getActiveIndex(e,t=!1){if(this.disabled||this.readonly)return;const a=this.rateWidth*this.count+this.rateBoxLeft,l=e=u(this.rateBoxLeft,a,e)-this.rateBoxLeft;let o;if(this.allowHalf){o=Math.floor(l/this.rateWidth);const e=l%this.rateWidth;e<=this.rateWidth/2&&e>0?o+=.5:e>this.rateWidth/2&&o++}else{o=Math.floor(l/this.rateWidth);const e=l%this.rateWidth;t?e>0&&o++:e>this.rateWidth/2&&o++}this.activeIndex=Math.min(o,this.count),this.activeIndex<this.minCount&&(this.activeIndex=this.minCount),setTimeout((()=>{this.moving=!0}),10),setTimeout((()=>{this.moving=!1}),10)}},mounted(){this.init()}},[["render",function(e,t,a,l,o,s){const c=x(n("u-icon"),V),i=I;return d(),_(i,{class:"u-rate",id:o.elId,ref:"u-rate",style:b([s.addStyle(e.customStyle)])},{default:r((()=>[m(i,{class:"u-rate__content",onTouchmove:f(s.touchMove,["stop"]),onTouchend:f(s.touchEnd,["stop"])},{default:r((()=>[(d(!0),h(v,null,p(Number(e.count),((t,a)=>(d(),_(i,{class:g(["u-rate__content__item cursor-pointer",[o.elClass]]),key:a},{default:r((()=>[m(i,{class:"u-rate__content__item__icon-wrap",ref_for:!0,ref:"u-rate__content__item__icon-wrap",onClick:f((e=>s.clickHandler(e,a+1)),["stop"])},{default:r((()=>[m(c,{name:Math.floor(o.activeIndex)>a?e.activeIcon:e.inactiveIcon,color:e.disabled?"#c8c9cc":Math.floor(o.activeIndex)>a?e.activeColor:e.inactiveColor,"custom-style":{padding:`0 ${s.addUnit(e.gutter/2)}`},size:e.size},null,8,["name","color","custom-style","size"])])),_:2},1032,["onClick"]),e.allowHalf?(d(),_(i,{key:0,onClick:f((e=>s.clickHandler(e,a+1)),["stop"]),class:"u-rate__content__item__icon-wrap u-rate__content__item__icon-wrap--half",style:b([{width:s.addUnit(o.rateWidth/2)}]),ref_for:!0,ref:"u-rate__content__item__icon-wrap"},{default:r((()=>[m(c,{name:Math.ceil(o.activeIndex)>a?e.activeIcon:e.inactiveIcon,color:e.disabled?"#c8c9cc":Math.ceil(o.activeIndex)>a?e.activeColor:e.inactiveColor,"custom-style":{padding:`0 ${s.addUnit(e.gutter/2)}`},size:e.size},null,8,["name","color","custom-style","size"])])),_:2},1032,["onClick","style"])):k("",!0)])),_:2},1032,["class"])))),128))])),_:1},8,["onTouchmove","onTouchend"])])),_:1},8,["id","style"])}],["__scopeId","data-v-16f5f663"]]);const W=z({data:()=>({value:3,value1:2,activeColorValue:3,HalfValue:3.5,activeIconValue:3}),watch:{value(e,t){}},methods:{change(e){}}},[["render",function(e,t,a,l,o,s){const c=C,i=x(n("up-rate"),w),u=I;return d(),_(u,{class:"u-page"},{default:r((()=>[m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("基本案例")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__tag-item"},{default:r((()=>[m(i,{size:"20"})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("自定义选中星星数量")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__tag-item flex"},{default:r((()=>[m(i,{size:"20",modelValue:o.value,"onUpdate:modelValue":t[0]||(t[0]=e=>o.value=e),onChange:s.change},null,8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("自定义星星大小")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__tag-item"},{default:r((()=>[m(i,{size:"30",count:"4"})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("是否禁用评分")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",disabled:""})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("是否只读评分")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",readonly:""})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("自定义选中星星颜色")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",modelValue:o.activeColorValue,"onUpdate:modelValue":t[1]||(t[1]=e=>o.activeColorValue=e),activeColor:"#2979ff"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("自定义未选中星星颜色")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",modelValue:o.value1,"onUpdate:modelValue":t[2]||(t[2]=e=>o.value1=e),inactiveColor:"#2979ff"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("禁止触摸选择")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",touchable:!1})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("允许触摸选择")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",touchable:!0})])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("是否允许半星")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",modelValue:o.HalfValue,"onUpdate:modelValue":t[3]||(t[3]=e=>o.HalfValue=e),allowHalf:!0,onChange:s.change},null,8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(u,{class:"u-demo-block"},{default:r((()=>[m(c,{class:"u-demo-block__title"},{default:r((()=>[y("自定义选中的图标")])),_:1}),m(u,{class:"u-demo-block__content"},{default:r((()=>[m(u,{class:"u-page__rate-item"},{default:r((()=>[m(i,{size:"20",modelValue:o.activeIconValue,"onUpdate:modelValue":t[4]||(t[4]=e=>o.activeIconValue=e),inactiveIcon:"heart",activeIcon:"heart-fill"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-7031a09d"]]);export{W as default};
