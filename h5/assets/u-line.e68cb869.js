import{j as e,m as t,k as i,o as r,c as n,q as d,i as l}from"./index.639d3d9d.js";import{_ as a}from"./plugin-vue_export-helper.21dcd24c.js";var o=a({name:"u-line",mixins:[t,i,{props:{color:{type:String,default:e.line.color},length:{type:[String,Number],default:e.line.length},direction:{type:String,default:e.line.direction},hairline:{type:Boolean,default:e.line.hairline},margin:{type:[String,Number],default:e.line.margin},dashed:{type:Boolean,default:e.line.dashed}}}],computed:{lineStyle(){const e={};return e.margin=this.margin,"row"===this.direction?(e.borderBottomWidth="1px",e.borderBottomStyle=this.dashed?"dashed":"solid",e.width=uni.$u.addUnit(this.length),this.hairline&&(e.transform="scaleY(0.5)")):(e.borderLeftWidth="1px",e.borderLeftStyle=this.dashed?"dashed":"solid",e.height=uni.$u.addUnit(this.length),this.hairline&&(e.transform="scaleX(0.5)")),e.borderColor=this.color,uni.$u.deepMerge(e,uni.$u.addStyle(this.customStyle))}}},[["render",function(e,t,i,a,o,s){const h=l;return r(),n(h,{class:"u-line",style:d([s.lineStyle])},null,8,["style"])}],["__scopeId","data-v-263a3494"]]);export{o as _};
