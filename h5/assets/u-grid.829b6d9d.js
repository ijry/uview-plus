import{j as t,m as e,k as i,o as a,c as s,w as r,l as n,p as d,q as l,i as o}from"./index.639d3d9d.js";import{_ as h}from"./plugin-vue_export-helper.21dcd24c.js";var c=h({name:"u-grid-item",mixins:[e,i,{props:{name:{type:[String,Number,null],default:t.gridItem.name},bgColor:{type:String,default:t.gridItem.bgColor}}}],data:()=>({parentData:{col:3,border:!0},classes:[]}),mounted(){this.init()},emits:["click"],options:{virtualHost:!0},computed:{width(){return 100/Number(this.parentData.col)+"%"},itemStyle(){const t={background:this.bgColor,width:this.width};return uni.$u.deepMerge(t,uni.$u.addStyle(this.customStyle))}},methods:{init(){uni.$on("$uGridItem",(()=>{this.gridItemClasses()})),this.updateParentData(),uni.$emit("$uGridItem"),this.gridItemClasses()},updateParentData(){this.getParentData("u-grid")},clickHandler(){var t;let e=this.name;const i=null==(t=this.parent)?void 0:t.children;i&&null===this.name&&(e=i.findIndex((t=>t===this))),this.parent&&this.parent.childClick(e),this.$emit("click",e)},async getItemWidth(){let t=0;if(this.parent){t=await this.getParentWidth()/Number(this.parentData.col)+"px"}this.width=t},getParentWidth(){},gridItemClasses(){if(this.parentData.border){let t=[];this.parent.children.map(((e,i)=>{if(this===e){const e=this.parent.children.length;(i+1)%this.parentData.col!=0&&i+1!==e&&t.push("u-border-right");i<e-(e%this.parentData.col==0?this.parentData.col:e%this.parentData.col)&&t.push("u-border-bottom")}})),this.classes=t}}},beforeDestroy(){uni.$off("$uGridItem")}},[["render",function(t,e,i,h,c,u){const p=o;return a(),s(p,{class:d(["u-grid-item",c.classes]),"hover-class":"u-grid-item--hover-class","hover-stay-time":200,onClick:u.clickHandler,style:l([u.itemStyle])},{default:r((()=>[n(t.$slots,"default",{},void 0,!0)])),_:3},8,["onClick","class","style"])}],["__scopeId","data-v-357f4f32"]]);var u=h({name:"u-grid",mixins:[e,i,{props:{col:{type:[String,Number],default:t.grid.col},border:{type:Boolean,default:t.grid.border},align:{type:String,default:t.grid.align}}}],data:()=>({index:0,width:0}),watch:{parentData(){this.children.length&&this.children.map((t=>{"function"==typeof t.updateParentData&&t.updateParentData()}))}},created(){this.children=[]},computed:{parentData(){return[this.hoverClass,this.col,this.size,this.border]},gridStyle(){let t={};switch(this.align){case"left":default:t.justifyContent="flex-start";break;case"center":t.justifyContent="center";break;case"right":t.justifyContent="flex-end"}return uni.$u.deepMerge(t,uni.$u.addStyle(this.customStyle))}},methods:{childClick(t){this.$emit("click",t)}}},[["render",function(t,e,i,d,h,c){const u=o;return a(),s(u,{class:"u-grid",ref:"u-grid",style:l([c.gridStyle])},{default:r((()=>[n(t.$slots,"default",{},void 0,!0)])),_:3},8,["style"])}],["__scopeId","data-v-902145f8"]]);export{c as _,u as a};
