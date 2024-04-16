import{l as e,m as l,f as a,q as t,n as o,d as c,o as u,c as s,w as n,a as d,s as i,h as r,j as _,t as h,u as m,y as f,D as p,k as g,i as b,a3 as k}from"./index-140fc608.js";import{_ as y}from"./u-icon.f3757cb0.js";import{r as v}from"./uni-app.es.432a22c1.js";import{_ as V}from"./_plugin-vue_export-helper.1b428a4d.js";const w=V({name:"u-search",mixins:[l,a,{props:{shape:{type:String,default:()=>e.search.shape},bgColor:{type:String,default:()=>e.search.bgColor},placeholder:{type:String,default:()=>e.search.placeholder},clearabled:{type:Boolean,default:()=>e.search.clearabled},focus:{type:Boolean,default:()=>e.search.focus},showAction:{type:Boolean,default:()=>e.search.showAction},actionStyle:{type:Object,default:()=>e.search.actionStyle},actionText:{type:String,default:()=>e.search.actionText},inputAlign:{type:String,default:()=>e.search.inputAlign},inputStyle:{type:Object,default:()=>e.search.inputStyle},disabled:{type:Boolean,default:()=>e.search.disabled},borderColor:{type:String,default:()=>e.search.borderColor},searchIconColor:{type:String,default:()=>e.search.searchIconColor},color:{type:String,default:()=>e.search.color},placeholderColor:{type:String,default:()=>e.search.placeholderColor},searchIcon:{type:String,default:()=>e.search.searchIcon},searchIconSize:{type:[Number,String],default:()=>e.search.searchIconSize},margin:{type:String,default:()=>e.search.margin},animation:{type:Boolean,default:()=>e.search.animation},modelValue:{type:String,default:()=>e.search.value},value:{type:String,default:()=>e.search.value},maxlength:{type:[String,Number],default:()=>e.search.maxlength},height:{type:[String,Number],default:()=>e.search.height},label:{type:[String,Number,null],default:()=>e.search.label}}}],data(){return{keyword:"",showClear:!1,show:!1,focused:this.focus}},watch:{keyword(e){this.$emit("update:modelValue",e),this.$emit("change",e)},modelValue:{immediate:!0,handler(e){this.keyword=e}}},computed:{showActionBtn(){return!this.animation&&this.showAction}},emits:["clear","search","custom","focus","blur","click","clickIcon","update:modelValue","change"],methods:{addStyle:t,addUnit:o,inputChange(e){this.keyword=e.detail.value},clear(){this.keyword="",this.$nextTick((()=>{this.$emit("clear")}))},search(e){this.$emit("search",e.detail.value);try{uni.hideKeyboard()}catch(l){}},custom(){this.$emit("custom",this.keyword);try{uni.hideKeyboard()}catch(e){}},getFocus(){this.focused=!0,this.animation&&this.showAction&&(this.show=!0),this.$emit("focus",this.keyword)},blur(){setTimeout((()=>{this.focused=!1}),100),this.show=!1,this.$emit("blur",this.keyword)},clickHandler(){this.disabled&&this.$emit("click")},clickIcon(e){this.$emit("clickIcon",this.keyword);try{uni.hideKeyboard()}catch(l){}}}},[["render",function(e,l,a,t,o,V){const w=g,C=v(c("u-icon"),y),S=b,I=k;return u(),s(S,{class:"u-search",onClick:V.clickHandler,style:i([{margin:e.margin},V.addStyle(e.customStyle)])},{default:n((()=>[d(S,{class:"u-search__content",style:i({backgroundColor:e.bgColor,borderRadius:"round"==e.shape?"100px":"4px",borderColor:e.borderColor})},{default:n((()=>[e.$slots.label||null!==e.label?r(e.$slots,"label",{key:0},(()=>[d(w,{class:"u-search__content__label"},{default:n((()=>[_(h(e.label),1)])),_:1})]),!0):m("",!0),d(S,{class:"u-search__content__icon"},{default:n((()=>[d(C,{onClick:V.clickIcon,size:e.searchIconSize,name:e.searchIcon,color:e.searchIconColor?e.searchIconColor:e.color},null,8,["onClick","size","name","color"])])),_:1}),d(I,{"confirm-type":"search",onBlur:V.blur,value:o.keyword,onConfirm:V.search,onInput:V.inputChange,disabled:e.disabled,onFocus:V.getFocus,focus:e.focus,maxlength:e.maxlength,"placeholder-class":"u-search__content__input--placeholder",placeholder:e.placeholder,"placeholder-style":`color: ${e.placeholderColor}`,class:"u-search__content__input",type:"text",style:i([{textAlign:e.inputAlign,color:e.color,backgroundColor:e.bgColor,height:V.addUnit(e.height)},e.inputStyle])},null,8,["onBlur","value","onConfirm","onInput","disabled","onFocus","focus","maxlength","placeholder","placeholder-style","style"]),o.keyword&&e.clearabled&&o.focused?(u(),s(S,{key:1,class:"u-search__content__icon u-search__content__close",onClick:V.clear},{default:n((()=>[d(C,{name:"close",size:"11",color:"#ffffff",customStyle:"line-height: 12px"})])),_:1},8,["onClick"])):m("",!0)])),_:3},8,["style"]),d(w,{style:i([e.actionStyle]),class:f(["u-search__action",[(V.showActionBtn||o.show)&&"u-search__action--active"]]),onClick:p(V.custom,["stop","prevent"])},{default:n((()=>[_(h(e.actionText),1)])),_:1},8,["style","class","onClick"])])),_:3},8,["onClick","style"])}],["__scopeId","data-v-f0112455"]]);const C=V({data:()=>({value1:"",value2:"天山雪莲",value3:"",value4:"",value5:"",value6:"",value7:"",value8:"",value9:"",value10:"",value11:"",value12:"",value13:"",value14:"",value15:""}),watch:{value1(e,l){}},methods:{change(e){console.log(e)},clickIcon(){uni.$u.toast("点击了左侧图标")}}},[["render",function(e,l,a,t,o,i){const r=g,m=v(c("up-search"),w),f=b;return u(),s(f,{class:"u-page"},{default:n((()=>[d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("基础功能")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value1,"onUpdate:modelValue":l[0]||(l[0]=e=>o.value1=e),"show-action":!1,onChange:i.change},null,8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("设置初始值")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value2,"onUpdate:modelValue":l[1]||(l[1]=e=>o.value2=e),"show-action":!1},null,8,["modelValue"]),_(" "+h(o.value2),1)])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("搜索框形状")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value3,"onUpdate:modelValue":l[2]||(l[2]=e=>o.value3=e),"show-action":!1,shape:"round"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value4,"onUpdate:modelValue":l[3]||(l[3]=e=>o.value4=e),"show-action":!1,shape:"square"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("右侧控件")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value5,"onUpdate:modelValue":l[4]||(l[4]=e=>o.value5=e)},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("禁用输入框")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{placeholder:"输入框被禁用,可以监听点击事件进行跳转",disabled:"","show-action":!1})])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("点击左侧图标")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value6,"onUpdate:modelValue":l[5]||(l[5]=e=>o.value6=e),"show-action":!1,onClickIcon:i.clickIcon},null,8,["modelValue","onClickIcon"])])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("搜索框内容水平对齐")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value7,"onUpdate:modelValue":l[6]||(l[6]=e=>o.value7=e),"show-action":!1,"input-align":"left"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value8,"onUpdate:modelValue":l[7]||(l[7]=e=>o.value8=e),"show-action":!1,"input-align":"center"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value9,"onUpdate:modelValue":l[8]||(l[8]=e=>o.value9=e),"show-action":!1,"input-align":"right"},null,8,["modelValue"])])),_:1})])),_:1})])),_:1}),d(f,{class:"u-demo-block"},{default:n((()=>[d(r,{class:"u-demo-block__title"},{default:n((()=>[_("自定义")])),_:1}),d(f,{class:"u-demo-block__content"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value10,"onUpdate:modelValue":l[9]||(l[9]=e=>o.value10=e),"show-action":!1,borderColor:"rgb(230, 230, 230)",bgColor:"#fff"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value11,"onUpdate:modelValue":l[10]||(l[10]=e=>o.value11=e),"show-action":!1,"search-icon-color":"#FF0000"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value12,"onUpdate:modelValue":l[11]||(l[11]=e=>o.value12=e),"show-action":!1,"placeholder-color":"#FF0000"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value13,"onUpdate:modelValue":l[12]||(l[12]=e=>o.value13=e),"show-action":!1,color:"#FF0000"},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value14,"onUpdate:modelValue":l[13]||(l[13]=e=>o.value14=e),label:"手机","show-action":!1},null,8,["modelValue"])])),_:1})])),_:1}),d(f,{class:"u-demo-block__content m-t-10"},{default:n((()=>[d(f,{class:"u-page__tag-item"},{default:n((()=>[d(m,{modelValue:o.value15,"onUpdate:modelValue":l[14]||(l[14]=e=>o.value15=e),"search-icon":"scan","show-action":!1},null,8,["modelValue"])])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-39c71f3f"]]);export{C as default};
