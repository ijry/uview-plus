import{_ as e}from"./u-icon.8fecb8b7.js";import{j as t,m as a,k as i,d as l,o,c,w as r,a as s,l as n,p as h,u as d,q as u,f as p,t as b,i as k,g as C}from"./index.639d3d9d.js";import{r as m}from"./uni-app.es.f87317fd.js";import{_ as f}from"./plugin-vue_export-helper.21dcd24c.js";var S=f({name:"u-checkbox",mixins:[a,i,{props:{name:{type:[String,Number,Boolean],default:t.checkbox.name},shape:{type:String,default:t.checkbox.shape},size:{type:[String,Number],default:t.checkbox.size},checked:{type:Boolean,default:t.checkbox.checked},disabled:{type:[String,Boolean],default:t.checkbox.disabled},activeColor:{type:String,default:t.checkbox.activeColor},inactiveColor:{type:String,default:t.checkbox.inactiveColor},iconSize:{type:[String,Number],default:t.checkbox.iconSize},iconColor:{type:String,default:t.checkbox.iconColor},label:{type:[String,Number],default:t.checkbox.label},labelSize:{type:[String,Number],default:t.checkbox.labelSize},labelColor:{type:String,default:t.checkbox.labelColor},labelDisabled:{type:[String,Boolean],default:t.checkbox.labelDisabled}}}],data:()=>({isChecked:!1,parentData:{iconSize:12,labelDisabled:null,disabled:null,shape:"square",activeColor:null,inactiveColor:null,size:18,modelValue:null,iconColor:null,placement:"row",borderBottom:!1,iconPlacement:"left"}}),computed:{elDisabled(){return""!==this.disabled?this.disabled:null!==this.parentData.disabled&&this.parentData.disabled},elLabelDisabled(){return""!==this.labelDisabled?this.labelDisabled:null!==this.parentData.labelDisabled&&this.parentData.labelDisabled},elSize(){return this.size?this.size:this.parentData.size?this.parentData.size:21},elIconSize(){return this.iconSize?this.iconSize:this.parentData.iconSize?this.parentData.iconSize:12},elActiveColor(){return this.activeColor?this.activeColor:this.parentData.activeColor?this.parentData.activeColor:"#2979ff"},elInactiveColor(){return this.inactiveColor?this.inactiveColor:this.parentData.inactiveColor?this.parentData.inactiveColor:"#c8c9cc"},elLabelColor(){return this.labelColor?this.labelColor:this.parentData.labelColor?this.parentData.labelColor:"#606266"},elShape(){return this.shape?this.shape:this.parentData.shape?this.parentData.shape:"circle"},elLabelSize(){return uni.$u.addUnit(this.labelSize?this.labelSize:this.parentData.labelSize?this.parentData.labelSize:"15")},elIconColor(){const e=this.iconColor?this.iconColor:this.parentData.iconColor?this.parentData.iconColor:"#ffffff";return this.elDisabled?this.isChecked?this.elInactiveColor:"transparent":this.isChecked?e:"transparent"},iconClasses(){let e=[];return e.push("u-checkbox__icon-wrap--"+this.elShape),this.elDisabled&&e.push("u-checkbox__icon-wrap--disabled"),this.isChecked&&this.elDisabled&&e.push("u-checkbox__icon-wrap--disabled--checked"),e},iconWrapStyle(){const e={};return e.backgroundColor=this.isChecked&&!this.elDisabled?this.elActiveColor:"#ffffff",e.borderColor=this.isChecked&&!this.elDisabled?this.elActiveColor:this.elInactiveColor,e.width=uni.$u.addUnit(this.elSize),e.height=uni.$u.addUnit(this.elSize),"right"===this.parentData.iconPlacement&&(e.marginRight=0),e},checkboxStyle(){const e={};return this.parentData.borderBottom&&"row"===this.parentData.placement&&uni.$u.error("检测到您将borderBottom设置为true，需要同时将u-checkbox-group的placement设置为column才有效"),this.parentData.borderBottom&&"column"===this.parentData.placement&&(e.paddingBottom="8px"),uni.$u.deepMerge(e,uni.$u.addStyle(this.customStyle))}},mounted(){this.init()},methods:{init(){this.updateParentData(),this.parent||uni.$u.error("u-checkbox必须搭配u-checkbox-group组件使用");const e=this.parentData.modelValue;this.checked?this.isChecked=!0:uni.$u.test.array(e)&&(this.isChecked=e.some((e=>e===this.name)))},updateParentData(){this.getParentData("u-checkbox-group")},wrapperClickHandler(e){"right"===this.parentData.iconPlacement&&this.iconClickHandler(e)},iconClickHandler(e){this.preventEvent(e),this.elDisabled||this.setRadioCheckedStatus()},labelClickHandler(e){this.preventEvent(e),this.elLabelDisabled||this.elDisabled||this.setRadioCheckedStatus()},emitEvent(){this.$emit("change",this.isChecked),this.$nextTick((()=>{uni.$u.formValidate(this,"change")}))},setRadioCheckedStatus(){this.isChecked=!this.isChecked,this.emitEvent(),"function"==typeof this.parent.unCheckedOther&&this.parent.unCheckedOther(this)}},watch:{checked(){this.isChecked=this.checked}}},[["render",function(t,a,i,f,S,D){const x=m(l("u-icon"),e),g=k,y=C;return o(),c(g,{class:h(["u-checkbox",[`u-checkbox-label--${S.parentData.iconPlacement}`,S.parentData.borderBottom&&"column"===S.parentData.placement&&"u-border-bottom"]]),style:u([D.checkboxStyle]),onClick:d(D.wrapperClickHandler,["stop"])},{default:r((()=>[s(g,{class:h(["u-checkbox__icon-wrap",D.iconClasses]),onClick:d(D.iconClickHandler,["stop"]),style:u([D.iconWrapStyle])},{default:r((()=>[n(t.$slots,"icon",{},(()=>[s(x,{class:"u-checkbox__icon-wrap__icon",name:"checkbox-mark",size:D.elIconSize,color:D.elIconColor},null,8,["size","color"])]),!0)])),_:3},8,["onClick","class","style"]),s(y,{onClick:d(D.labelClickHandler,["stop"]),style:u({color:D.elDisabled?D.elInactiveColor:D.elLabelColor,fontSize:D.elLabelSize,lineHeight:D.elLabelSize})},{default:r((()=>[p(b(t.label),1)])),_:1},8,["onClick","style"])])),_:3},8,["style","onClick","class"])}],["__scopeId","data-v-2da0c341"]]);var D=f({name:"u-checkbox-group",mixins:[a,i,{props:{name:{type:String,default:t.checkboxGroup.name},modelValue:{type:Array,default:t.checkboxGroup.value},shape:{type:String,default:t.checkboxGroup.shape},disabled:{type:Boolean,default:t.checkboxGroup.disabled},activeColor:{type:String,default:t.checkboxGroup.activeColor},inactiveColor:{type:String,default:t.checkboxGroup.inactiveColor},size:{type:[String,Number],default:t.checkboxGroup.size},placement:{type:String,default:t.checkboxGroup.placement},labelSize:{type:[String,Number],default:t.checkboxGroup.labelSize},labelColor:{type:[String],default:t.checkboxGroup.labelColor},labelDisabled:{type:Boolean,default:t.checkboxGroup.labelDisabled},iconColor:{type:String,default:t.checkboxGroup.iconColor},iconSize:{type:[String,Number],default:t.checkboxGroup.iconSize},iconPlacement:{type:String,default:t.checkboxGroup.iconPlacement},borderBottom:{type:Boolean,default:t.checkboxGroup.borderBottom}}}],computed:{parentData(){return[this.modelValue,this.disabled,this.inactiveColor,this.activeColor,this.size,this.labelDisabled,this.shape,this.iconSize,this.borderBottom,this.placement]},bemClass(){return this.bem("checkbox-group",["placement"])}},watch:{parentData:{handler(){this.children.length&&this.children.map((e=>{"function"==typeof e.init&&e.init()}))},deep:!0}},data:()=>({}),created(){this.children=[]},emits:["update:modelValue","change"],methods:{unCheckedOther(e){const t=[];this.children.map((e=>{e.isChecked&&t.push(e.name)})),this.$emit("change",t),this.$emit("update:modelValue",t)}}},[["render",function(e,t,a,i,l,s){const d=k;return o(),c(d,{class:h(["u-checkbox-group",s.bemClass])},{default:r((()=>[n(e.$slots,"default",{},void 0,!0)])),_:3},8,["class"])}],["__scopeId","data-v-2467fdaa"]]);export{S as _,D as a};
