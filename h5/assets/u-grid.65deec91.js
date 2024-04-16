import{l as t,m as e,f as a,p as i,q as s,o as r,c as n,w as l,h as d,y as o,s as c,u as h,i as u}from"./index-140fc608.js";import{_ as m}from"./_plugin-vue_export-helper.1b428a4d.js";const p=m({name:"u-grid-item",mixins:[e,a,{props:{name:{type:[String,Number,null],default:()=>t.gridItem.name},bgColor:{type:String,default:()=>t.gridItem.bgColor}}}],data:()=>({parentData:{col:0,border:!0},classes:[]}),mounted(){this.init()},emits:["click"],computed:{width(){return this.parentData.col>0?100/Number(this.parentData.col)+"%":0},itemStyle(){const t={background:this.bgColor,width:this.width};return i(t,s(this.customStyle))}},methods:{init(){uni.$on("$uGridItem",(()=>{this.gridItemClasses()})),this.updateParentData(),uni.$emit("$uGridItem"),this.gridItemClasses()},updateParentData(){this.getParentData("u-grid")},clickHandler(){var t;let e=this.name;const a=null==(t=this.parent)?void 0:t.children;a&&null===this.name&&(e=a.findIndex((t=>t===this))),this.parent&&this.parent.childClick(e),this.$emit("click",e)},async getItemWidth(){let t=0;if(this.parent){t=await this.getParentWidth()/Number(this.parentData.col)+"px"}this.width=t},getParentWidth(){},gridItemClasses(){if(this.parentData.border){let t=[];this.parent.children.map(((e,a)=>{if(this===e){const e=this.parent.children.length;(a+1)%this.parentData.col!=0&&a+1!==e&&t.push("u-border-right");a<e-(e%this.parentData.col==0?this.parentData.col:e%this.parentData.col)&&t.push("u-border-bottom")}})),this.classes=t}}},beforeUnmount(){uni.$off("$uGridItem")}},[["render",function(t,e,a,i,s,m){const p=u;return s.parentData.col>0?(r(),n(p,{key:0,class:o(["u-grid-item",s.classes]),"hover-class":"u-grid-item--hover-class","hover-stay-time":200,onClick:m.clickHandler,style:c([m.itemStyle])},{default:l((()=>[d(t.$slots,"default",{},void 0,!0)])),_:3},8,["onClick","class","style"])):h("",!0)}],["__scopeId","data-v-6c2942cb"]]);const g=m({name:"u-grid",mixins:[e,a,{props:{col:{type:[String,Number],default:()=>t.grid.col},border:{type:Boolean,default:()=>t.grid.border},align:{type:String,default:()=>t.grid.align}}}],data:()=>({index:0,width:0}),watch:{parentData(){this.children.length&&this.children.map((t=>{"function"==typeof t.updateParentData&&t.updateParentData()}))}},created(){this.children=[]},computed:{parentData(){return[this.hoverClass,this.col,this.size,this.border]},gridStyle(){let t={};switch(this.align){case"left":default:t.justifyContent="flex-start";break;case"center":t.justifyContent="center";break;case"right":t.justifyContent="flex-end"}return i(t,s(this.customStyle))}},emits:["click"],methods:{childClick(t){this.$emit("click",t)}}},[["render",function(t,e,a,i,s,o){const h=u;return r(),n(h,{class:"u-grid",ref:"u-grid",style:c([o.gridStyle])},{default:l((()=>[d(t.$slots,"default",{},void 0,!0)])),_:3},8,["style"])}],["__scopeId","data-v-0f846af8"]]);export{p as _,g as a};
