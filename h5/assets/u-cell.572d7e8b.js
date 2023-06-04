import{_ as e}from"./u-icon.8fecb8b7.js";import{j as l,m as t,k as a,d as s,o as c,c as i,w as r,a as o,l as u,n,p as d,q as y,f as p,t as _,i as f,g as b}from"./index.639d3d9d.js";import{r as m}from"./uni-app.es.f87317fd.js";import{_ as g}from"./u-line.e68cb869.js";import{_ as S}from"./plugin-vue_export-helper.21dcd24c.js";var k=S({name:"u-cell",data:()=>({}),mixins:[t,a,{props:{title:{type:[String,Number],default:l.cell.title},label:{type:[String,Number],default:l.cell.label},value:{type:[String,Number],default:l.cell.value},icon:{type:String,default:l.cell.icon},disabled:{type:Boolean,default:l.cell.disabled},border:{type:Boolean,default:l.cell.border},center:{type:Boolean,default:l.cell.center},url:{type:String,default:l.cell.url},linkType:{type:String,default:l.cell.linkType},clickable:{type:Boolean,default:l.cell.clickable},isLink:{type:Boolean,default:l.cell.isLink},required:{type:Boolean,default:l.cell.required},rightIcon:{type:String,default:l.cell.rightIcon},arrowDirection:{type:String,default:l.cell.arrowDirection},iconStyle:{type:[Object,String],default:()=>uni.$u.props.cell.iconStyle},rightIconStyle:{type:[Object,String],default:()=>uni.$u.props.cell.rightIconStyle},titleStyle:{type:[Object,String],default:()=>uni.$u.props.cell.titleStyle},size:{type:String,default:l.cell.size},stop:{type:Boolean,default:l.cell.stop},name:{type:[Number,String],default:l.cell.name}}}],computed:{titleTextStyle(){return uni.$u.addStyle(this.titleStyle)}},emits:["click"],methods:{clickHandler(e){this.disabled||(this.$emit("click",{name:this.name}),this.openPage(),this.stop&&this.preventEvent(e))}}},[["render",function(l,t,a,S,k,h){const v=m(s("u-icon"),e),$=f,z=b,j=m(s("u-line"),g);return c(),i($,{class:d(["u-cell",[l.customClass]]),style:y([l.$u.addStyle(l.customStyle)]),"hover-class":l.disabled||!l.clickable&&!l.isLink?"":"u-cell--clickable","hover-stay-time":250,onClick:h.clickHandler},{default:r((()=>[o($,{class:d(["u-cell__body",[l.center&&"u-cell--center","large"===l.size&&"u-cell__body--large"]])},{default:r((()=>[o($,{class:"u-cell__body__content"},{default:r((()=>[o($,{class:"u-cell__left-icon-wrap"},{default:r((()=>[u(l.$slots,"icon",{},(()=>[l.icon?(c(),i(v,{key:0,name:l.icon,"custom-style":l.iconStyle,size:"large"===l.size?22:18},null,8,["name","custom-style","size"])):n("",!0)]),!0)])),_:3}),o($,{class:"u-cell__title"},{default:r((()=>[u(l.$slots,"title",{},(()=>[l.title?(c(),i(z,{key:0,class:d(["u-cell__title-text",[l.disabled&&"u-cell--disabled","large"===l.size&&"u-cell__title-text--large"]]),style:y([h.titleTextStyle])},{default:r((()=>[p(_(l.title),1)])),_:1},8,["style","class"])):n("",!0)]),!0),u(l.$slots,"label",{},(()=>[l.label?(c(),i(z,{key:0,class:d(["u-cell__label",[l.disabled&&"u-cell--disabled","large"===l.size&&"u-cell__label--large"]])},{default:r((()=>[p(_(l.label),1)])),_:1},8,["class"])):n("",!0)]),!0)])),_:3})])),_:3}),u(l.$slots,"value",{},(()=>[l.$u.test.empty(l.value)?n("",!0):(c(),i(z,{key:0,class:d(["u-cell__value",[l.disabled&&"u-cell--disabled","large"===l.size&&"u-cell__value--large"]])},{default:r((()=>[p(_(l.value),1)])),_:1},8,["class"]))]),!0),o($,{class:d(["u-cell__right-icon-wrap",[`u-cell__right-icon-wrap--${l.arrowDirection}`]])},{default:r((()=>[u(l.$slots,"right-icon",{},(()=>[l.isLink?(c(),i(v,{key:0,name:l.rightIcon,"custom-style":l.rightIconStyle,color:l.disabled?"#c8c9cc":"info",size:"large"===l.size?18:16},null,8,["name","custom-style","color","size"])):n("",!0)]),!0)])),_:3},8,["class"])])),_:3},8,["class"]),l.border?(c(),i(j,{key:0})):n("",!0)])),_:3},8,["class","style","hover-class","onClick"])}],["__scopeId","data-v-6ce2058c"]]);export{k as _};
