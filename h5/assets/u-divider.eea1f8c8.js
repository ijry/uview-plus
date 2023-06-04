import{_ as e}from"./u-line.e68cb869.js";import{j as t,m as i,k as d,d as l,o,c as r,w as s,a,f as n,q as u,t as c,n as h,g as y,i as f}from"./index.639d3d9d.js";import{r as x}from"./uni-app.es.f87317fd.js";import{_ as p}from"./plugin-vue_export-helper.21dcd24c.js";var m=p({name:"u-divider",mixins:[i,d,{props:{dashed:{type:Boolean,default:t.divider.dashed},hairline:{type:Boolean,default:t.divider.hairline},dot:{type:Boolean,default:t.divider.dot},textPosition:{type:String,default:t.divider.textPosition},text:{type:[String,Number],default:t.divider.text},textSize:{type:[String,Number],default:t.divider.textSize},textColor:{type:String,default:t.divider.textColor},lineColor:{type:String,default:t.divider.lineColor}}}],computed:{textStyle(){const e={};return e.fontSize=uni.$u.addUnit(this.textSize),e.color=this.textColor,e},leftLineStyle(){const e={};return"left"===this.textPosition?e.width="80rpx":e.flex=1,e},rightLineStyle(){const e={};return"right"===this.textPosition?e.width="80rpx":e.flex=1,e}},methods:{click(){this.$emit("click")}}},[["render",function(t,i,d,p,m,S){const v=x(l("u-line"),e),_=y,g=f;return o(),r(g,{class:"u-divider",style:u([t.$u.addStyle(t.customStyle)]),onClick:S.click},{default:s((()=>[a(v,{color:t.lineColor,customStyle:S.leftLineStyle,hairline:t.hairline,dashed:t.dashed},null,8,["color","customStyle","hairline","dashed"]),t.dot?(o(),r(_,{key:0,class:"u-divider__dot"},{default:s((()=>[n("●")])),_:1})):t.text?(o(),r(_,{key:1,class:"u-divider__text",style:u([S.textStyle])},{default:s((()=>[n(c(t.text),1)])),_:1},8,["style"])):h("",!0),a(v,{color:t.lineColor,customStyle:S.rightLineStyle,hairline:t.hairline,dashed:t.dashed},null,8,["color","customStyle","hairline","dashed"])])),_:1},8,["style","onClick"])}],["__scopeId","data-v-5e06dcee"]]);export{m as _};
