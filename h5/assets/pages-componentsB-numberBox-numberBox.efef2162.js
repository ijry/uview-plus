import{l as e,m as t,f as l,v as n,n as o,d as u,o as s,c as a,w as i,D as r,h,y as d,s as m,a as c,u as p,i as g,a3 as b,j as f,t as y,k as C}from"./index-48e3ba0a.js";import{_ as v}from"./u-icon.16cc2813.js";import{r as V}from"./uni-app.es.7ebb87b3.js";import{_ as x}from"./_plugin-vue_export-helper.1b428a4d.js";import{_}from"./u-cell.e0878c45.js";import{_ as S}from"./u-cell-group.de17ec2e.js";import"./u-line.0c5aecfe.js";const T=x({name:"u-number-box",mixins:[t,l,{props:{name:{type:[String,Number],default:()=>e.numberBox.name},modelValue:{type:[String,Number],default:()=>e.numberBox.value},min:{type:[String,Number],default:()=>e.numberBox.min},max:{type:[String,Number],default:()=>e.numberBox.max},step:{type:[String,Number],default:()=>e.numberBox.step},integer:{type:Boolean,default:()=>e.numberBox.integer},disabled:{type:Boolean,default:()=>e.numberBox.disabled},disabledInput:{type:Boolean,default:()=>e.numberBox.disabledInput},asyncChange:{type:Boolean,default:()=>e.numberBox.asyncChange},inputWidth:{type:[String,Number],default:()=>e.numberBox.inputWidth},showMinus:{type:Boolean,default:()=>e.numberBox.showMinus},showPlus:{type:Boolean,default:()=>e.numberBox.showPlus},decimalLength:{type:[String,Number,null],default:()=>e.numberBox.decimalLength},longPress:{type:Boolean,default:()=>e.numberBox.longPress},color:{type:String,default:()=>e.numberBox.color},buttonSize:{type:[String,Number],default:()=>e.numberBox.buttonSize},bgColor:{type:String,default:()=>e.numberBox.bgColor},cursorSpacing:{type:[String,Number],default:()=>e.numberBox.cursorSpacing},disablePlus:{type:Boolean,default:()=>e.numberBox.disablePlus},disableMinus:{type:Boolean,default:()=>e.numberBox.disableMinus},iconStyle:{type:[Object,String],default:()=>e.numberBox.iconStyle}}}],data:()=>({currentValue:"",longPressTimer:null}),watch:{watchChange(e){this.check()},modelValue:{handler:function(e,t){e!==this.currentValue&&(this.currentValue=this.format(this.modelValue))},immediate:!0}},computed:{getCursorSpacing(){return n(this.cursorSpacing)},buttonStyle(){return e=>{const t={backgroundColor:this.bgColor,height:o(this.buttonSize),color:this.color};return this.isDisabled(e)&&(t.backgroundColor="#f7f8fa"),t}},inputStyle(){this.disabled||this.disabledInput;return{color:this.color,backgroundColor:this.bgColor,height:o(this.buttonSize),width:o(this.inputWidth)}},watchChange(){return[this.integer,this.decimalLength,this.min,this.max]},isDisabled(){return e=>"plus"===e?this.disabled||this.disablePlus||this.currentValue>=this.max:this.disabled||this.disableMinus||this.currentValue<=this.min}},mounted(){this.init()},emits:["update:modelValue","focus","blur","overlimit","change","plus","minus"],methods:{init(){this.currentValue=this.format(this.modelValue)},format(e){return e=""===(e=this.filter(e))?0:+e,e=Math.max(Math.min(this.max,e),this.min),null!==this.decimalLength&&(e=e.toFixed(this.decimalLength)),e},filter(e){return e=String(e).replace(/[^0-9.-]/g,""),this.integer&&-1!==e.indexOf(".")&&(e=e.split(".")[0]),e},check(){const e=this.format(this.currentValue);e!==this.currentValue&&(this.currentValue=e)},onFocus(e){this.$emit("focus",{...e.detail,name:this.name})},onBlur(e){this.format(e.detail.value),this.$emit("blur",{...e.detail,name:this.name})},onInput(e){const{value:t=""}=e.detail||{};if(""===t)return;let l=this.filter(t);if(null!==this.decimalLength&&-1!==l.indexOf(".")){const e=l.split(".");l=`${e[0]}.${e[1].slice(0,this.decimalLength)}`}l=this.format(l),this.emitChange(l)},emitChange(e){this.asyncChange||this.$nextTick((()=>{this.$emit("update:modelValue",e),this.currentValue=e,this.$forceUpdate()})),this.$emit("change",{value:e,name:this.name})},onChange(){const{type:e}=this;if(this.isDisabled(e))return this.$emit("overlimit",e);const t="minus"===e?-this.step:+this.step,l=this.format(this.add(+this.currentValue,t));this.emitChange(l),this.$emit(e)},add(e,t){const l=Math.pow(10,10);return Math.round((e+t)*l)/l},clickHandler(e){this.type=e,this.onChange()},longPressStep(){this.clearTimeout(),this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),250)},onTouchStart(e){this.longPress&&(this.clearTimeout(),this.type=e,this.longPressTimer=setTimeout((()=>{this.onChange(),this.longPressStep()}),600))},onTouchEnd(){this.longPress&&this.clearTimeout()},clearTimeout(){clearTimeout(this.longPressTimer),this.longPressTimer=null}}},[["render",function(e,t,l,n,o,f){const y=g,C=V(u("u-icon"),v),x=b;return s(),a(y,{class:"u-number-box"},{default:i((()=>[e.showMinus&&e.$slots.minus?(s(),a(y,{key:0,class:"u-number-box__slot cursor-pointer",onClick:t[0]||(t[0]=r((e=>f.clickHandler("minus")),["stop"])),onTouchstart:t[1]||(t[1]=e=>f.onTouchStart("minus")),onTouchend:r(f.clearTimeout,["stop"])},{default:i((()=>[h(e.$slots,"minus",{},void 0,!0)])),_:3},8,["onTouchend"])):e.showMinus?(s(),a(y,{key:1,class:d(["u-number-box__minus cursor-pointer",{"u-number-box__minus--disabled":f.isDisabled("minus")}]),onClick:t[2]||(t[2]=r((e=>f.clickHandler("minus")),["stop"])),onTouchstart:t[3]||(t[3]=e=>f.onTouchStart("minus")),onTouchend:r(f.clearTimeout,["stop"]),"hover-class":"u-number-box__minus--hover","hover-stay-time":"150",style:m([f.buttonStyle("minus")])},{default:i((()=>[c(C,{name:"minus",color:f.isDisabled("minus")?"#c8c9cc":"#323233",size:"15",bold:"",customStyle:e.iconStyle},null,8,["color","customStyle"])])),_:1},8,["onTouchend","class","style"])):p("",!0),h(e.$slots,"input",{},(()=>[c(x,{disabled:e.disabledInput||e.disabled,"cursor-spacing":f.getCursorSpacing,class:d([{"u-number-box__input--disabled":e.disabled||e.disabledInput},"u-number-box__input"]),modelValue:o.currentValue,"onUpdate:modelValue":t[4]||(t[4]=e=>o.currentValue=e),onBlur:f.onBlur,onFocus:f.onFocus,onInput:f.onInput,type:"number",style:m([f.inputStyle])},null,8,["disabled","cursor-spacing","class","modelValue","onBlur","onFocus","onInput","style"])]),!0),e.showPlus&&e.$slots.plus?(s(),a(y,{key:2,class:"u-number-box__slot cursor-pointer",onClick:t[5]||(t[5]=r((e=>f.clickHandler("plus")),["stop"])),onTouchstart:t[6]||(t[6]=e=>f.onTouchStart("plus")),onTouchend:r(f.clearTimeout,["stop"])},{default:i((()=>[h(e.$slots,"plus",{},void 0,!0)])),_:3},8,["onTouchend"])):e.showPlus?(s(),a(y,{key:3,class:d(["u-number-box__plus cursor-pointer",{"u-number-box__minus--disabled":f.isDisabled("plus")}]),onClick:t[7]||(t[7]=r((e=>f.clickHandler("plus")),["stop"])),onTouchstart:t[8]||(t[8]=e=>f.onTouchStart("plus")),onTouchend:r(f.clearTimeout,["stop"]),"hover-class":"u-number-box__plus--hover","hover-stay-time":"150",style:m([f.buttonStyle("plus")])},{default:i((()=>[c(C,{name:"plus",color:f.isDisabled("plus")?"#c8c9cc":"#323233",size:"15",bold:"",customStyle:e.iconStyle},null,8,["color","customStyle"])])),_:1},8,["onTouchend","class","style"])):p("",!0)])),_:3})}],["__scopeId","data-v-58f97dff"]]);const B=x({data:()=>({value1:3,value2:3,value3:3,value4:3,value5:3,value6:3,value7:3,value8:3.1,value9:3,value10:3,value11:3,step1:2,min1:5,max1:8,asyncChange:!0,color:"#FFFFFF",buttonSize:36,bgColor:"#2979ff"}),methods:{change(e){console.log("change",e)},myAsyncChange(e){this.asyncChange=!1,uni.showLoading({title:"正在加载"}),setTimeout((()=>{uni.hideLoading(),this.value9=e,this.asyncChange=!0}),3e3)}}},[["render",function(e,t,l,n,o,r){const h=V(u("up-number-box"),T),d=V(u("up-cell"),_),m=V(u("up-icon"),v),p=g,b=C,x=V(u("up-cell-group"),S);return s(),a(p,{class:""},{default:i((()=>[c(x,{border:!0},{default:i((()=>[c(d,{border:!0,title:"基础用法"},{"right-icon":i((()=>[c(h,{modelValue:o.value1,"onUpdate:modelValue":t[0]||(t[0]=e=>o.value1=e),step:"1",onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"步长设置"},{"right-icon":i((()=>[c(h,{modelValue:o.value2,"onUpdate:modelValue":t[1]||(t[1]=e=>o.value2=e),step:o.step1,onChange:r.change},null,8,["modelValue","step","onChange"])])),_:1}),c(d,{border:!0,title:"限制输入范围"},{"right-icon":i((()=>[c(h,{modelValue:o.value3,"onUpdate:modelValue":t[2]||(t[2]=e=>o.value3=e),step:"1",min:o.min1,max:o.max1,onChange:r.change},null,8,["modelValue","min","max","onChange"])])),_:1}),c(d,{border:!0,title:"限制输入整数"},{"right-icon":i((()=>[c(h,{modelValue:o.value4,"onUpdate:modelValue":t[3]||(t[3]=e=>o.value4=e),step:"1",integer:"",onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"禁用状态"},{"right-icon":i((()=>[c(h,{modelValue:o.value5,"onUpdate:modelValue":t[4]||(t[4]=e=>o.value5=e),step:"1",disabled:!0,onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"禁用输入框"},{"right-icon":i((()=>[c(h,{modelValue:o.value6,"onUpdate:modelValue":t[5]||(t[5]=e=>o.value6=e),step:"1",disabledInput:!0,onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"禁用长按"},{"right-icon":i((()=>[c(h,{modelValue:o.value7,"onUpdate:modelValue":t[6]||(t[6]=e=>o.value7=e),step:"1",longPress:!1,onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"固定小数位数"},{"right-icon":i((()=>[c(h,{modelValue:o.value8,"onUpdate:modelValue":t[7]||(t[7]=e=>o.value8=e),step:"0.2",decimalLength:"1",onChange:r.change},null,8,["modelValue","onChange"])])),_:1}),c(d,{border:!0,title:"异步变更"},{"right-icon":i((()=>[c(h,{modelValue:o.value9,"onUpdate:modelValue":t[8]||(t[8]=e=>o.value9=e),step:"1",asyncChange:o.asyncChange,onChange:r.myAsyncChange},null,8,["modelValue","asyncChange","onChange"])])),_:1}),c(d,{border:!0,title:"自定义大小颜色样式"},{"right-icon":i((()=>[c(h,{modelValue:o.value10,"onUpdate:modelValue":t[9]||(t[9]=e=>o.value10=e),step:"1",color:o.color,buttonSize:o.buttonSize,bgColor:o.bgColor,onChange:r.change,iconStyle:"color: #fff"},null,8,["modelValue","color","buttonSize","bgColor","onChange"])])),_:1}),c(d,{border:!0,title:"自定义(为0时减少按钮会消失)"},{"right-icon":i((()=>[c(h,{modelValue:o.value11,"onUpdate:modelValue":t[10]||(t[10]=e=>o.value11=e),step:"1",min:0,showMinus:o.value11>0},{minus:i((()=>[c(p,{class:"minus"},{default:i((()=>[c(m,{name:"minus",size:"12"})])),_:1})])),input:i((()=>[c(b,{style:{width:"50px","text-align":"center"},class:"input"},{default:i((()=>[f(y(o.value11),1)])),_:1})])),plus:i((()=>[c(p,{class:"plus"},{default:i((()=>[c(m,{name:"plus",color:"#FFFFFF",size:"12"})])),_:1})])),_:1},8,["modelValue","showMinus"])])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-b6668e87"]]);export{B as default};