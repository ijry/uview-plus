import{l as e,n as l,m as t,f as o,p as a,x as u,o as d,c as n,w as s,b as i,d as c,F as r,a as m,u as p,i as h,a5 as _,j as f,t as b,v as g,k as y,r as V}from"./index-BAqlIHr8.js";import{_ as x}from"./_plugin-vue_export-helper.BCo6x5W8.js";import{r as v}from"./uni-app.es.DN0kabVh.js";const k=x({name:"u-code-input",mixins:[t,o,e({props:{adjustPosition:{type:Boolean,default:()=>l.codeInput.adjustPosition},maxlength:{type:[String,Number],default:()=>l.codeInput.maxlength},dot:{type:Boolean,default:()=>l.codeInput.dot},mode:{type:String,default:()=>l.codeInput.mode},hairline:{type:Boolean,default:()=>l.codeInput.hairline},space:{type:[String,Number],default:()=>l.codeInput.space},modelValue:{type:[String,Number],default:()=>l.codeInput.value},focus:{type:Boolean,default:()=>l.codeInput.focus},bold:{type:Boolean,default:()=>l.codeInput.bold},color:{type:String,default:()=>l.codeInput.color},fontSize:{type:[String,Number],default:()=>l.codeInput.fontSize},size:{type:[String,Number],default:()=>l.codeInput.size},disabledKeyboard:{type:Boolean,default:()=>l.codeInput.disabledKeyboard},borderColor:{type:String,default:()=>l.codeInput.borderColor},disabledDot:{type:Boolean,default:()=>l.codeInput.disabledDot}}})],data(){return{inputValue:"",isFocus:this.focus,timer:null,opacity:1}},watch:{modelValue:{immediate:!0,handler(e){this.inputValue=String(e).substring(0,this.maxlength)}},isFocus:{handler(e){}}},created(){},beforeUnmount(){},computed:{codeLength(){return new Array(Number(this.maxlength))},itemStyle(){return e=>{const l={width:a(this.size),height:a(this.size)};return"box"===this.mode&&(l.border=`${this.hairline?.5:1}px solid ${this.borderColor}`,0===u(this.space)&&(0===e&&(l.borderTopLeftRadius="3px",l.borderBottomLeftRadius="3px"),e===this.codeLength.length-1&&(l.borderTopRightRadius="3px",l.borderBottomRightRadius="3px"),e!==this.codeLength.length-1&&(l.borderRight="none"))),e!==this.codeLength.length-1?l.marginRight=a(this.space):l.marginRight=0,l}},codeArray(){return String(this.inputValue).split("")},lineStyle(){const e={};return e.height=this.hairline?"2px":"4px",e.width=a(this.size),e.backgroundColor=this.borderColor,e}},emits:["change","finish","update:modelValue"],methods:{addUnit:a,inputHandler(e){const l=e.detail.value;this.inputValue=l,this.disabledDot&&this.$nextTick((()=>{this.inputValue=l.replace(".","")})),this.$emit("change",l),this.$emit("update:modelValue",l),String(l).length>=Number(this.maxlength)&&this.$emit("finish",l)}}},[["render",function(e,l,t,o,a,u){const V=h,x=y,v=_;return d(),n(V,{class:"u-code-input"},{default:s((()=>[(d(!0),i(r,null,c(u.codeLength,((l,t)=>(d(),n(V,{class:"u-code-input__item",style:p([u.itemStyle(t)]),key:t},{default:s((()=>[e.dot&&u.codeArray.length>t?(d(),n(V,{key:0,class:"u-code-input__item__dot"})):(d(),n(x,{key:1,style:p({fontSize:u.addUnit(e.fontSize),fontWeight:e.bold?"bold":"normal",color:e.color})},{default:s((()=>[f(b(u.codeArray[t]),1)])),_:2},1032,["style"])),"line"===e.mode?(d(),n(V,{key:2,class:"u-code-input__item__line",style:p([u.lineStyle])},null,8,["style"])):g("",!0),a.isFocus&&u.codeArray.length===t?(d(),n(V,{key:3,style:p({backgroundColor:e.color}),class:"u-code-input__item__cursor"},null,8,["style"])):g("",!0)])),_:2},1032,["style"])))),128)),m(v,{disabled:e.disabledKeyboard,type:"number",focus:e.focus,value:a.inputValue,maxlength:e.maxlength,adjustPosition:e.adjustPosition,class:"u-code-input__input",onInput:u.inputHandler,style:p({height:u.addUnit(e.size)}),onFocus:l[0]||(l[0]=e=>a.isFocus=!0),onBlur:l[1]||(l[1]=e=>a.isFocus=!1)},null,8,["disabled","focus","value","maxlength","adjustPosition","onInput","style"])])),_:1})}],["__scopeId","data-v-0f60dd4b"]]);const S=x({data:()=>({value1:"",value2:"",value3:"",value4:"",value5:"",value6:"",value7:"",value8:"",value9:"123",value10:"34"}),methods:{change(e){console.log("change",e)},finish(e){console.log("finish",e)}}},[["render",function(e,l,t,o,a,u){const i=y,c=v(V("up-code-input"),k),r=h;return d(),n(r,{class:"u-page"},{default:s((()=>[m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("基础使用")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value1,"onUpdate:modelValue":l[0]||(l[0]=e=>a.value1=e),maxlength:4,onChange:u.change,onFinish:u.finish},null,8,["modelValue","onChange","onFinish"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("横线模式")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value2,"onUpdate:modelValue":l[1]||(l[1]=e=>a.value2=e),mode:"line",maxlength:4,bold:!0},null,8,["modelValue"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("设置长度")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value3,"onUpdate:modelValue":l[2]||(l[2]=e=>a.value3=e),maxlength:6},null,8,["modelValue"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("设置间距")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value4,"onUpdate:modelValue":l[3]||(l[3]=e=>a.value4=e),mode:"box",space:0,maxlength:4},null,8,["modelValue"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("细边框")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value5,"onUpdate:modelValue":l[4]||(l[4]=e=>a.value5=e),mode:"box",space:0,maxlength:4,hairline:""},null,8,["modelValue"])])),_:1}),m(r,{class:"u-demo-block__content",style:{"margin-top":"10px"}},{default:s((()=>[m(c,{modelValue:a.value6,"onUpdate:modelValue":l[5]||(l[5]=e=>a.value6=e),mode:"line",space:10,maxlength:4,hairline:""},null,8,["modelValue"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("调整颜色")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value7,"onUpdate:modelValue":l[6]||(l[6]=e=>a.value7=e),mode:"box",space:0,maxlength:4,hairline:"",color:"#f56c6c",borderColor:"#f56c6c"},null,8,["modelValue"]),m(r,{class:"u-demo-block__content",style:{"margin-top":"10px"}},{default:s((()=>[m(c,{modelValue:a.value10,"onUpdate:modelValue":l[7]||(l[7]=e=>a.value10=e),mode:"line",size:"30",maxlength:4,hairline:"",color:"#3c9cff",borderColor:"#3c9cff"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("点模式")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value8,"onUpdate:modelValue":l[8]||(l[8]=e=>a.value8=e),mode:"box",dot:"",space:0,maxlength:4,hairline:""},null,8,["modelValue"])])),_:1})])),_:1}),m(r,{class:"u-demo-block"},{default:s((()=>[m(i,{class:"u-demo-block__title"},{default:s((()=>[f("预置内容")])),_:1}),m(r,{class:"u-demo-block__content"},{default:s((()=>[m(c,{modelValue:a.value9,"onUpdate:modelValue":l[9]||(l[9]=e=>a.value9=e),mode:"box",space:0,maxlength:4,hairline:"",fontSize:"17"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1})}]]);export{S as default};