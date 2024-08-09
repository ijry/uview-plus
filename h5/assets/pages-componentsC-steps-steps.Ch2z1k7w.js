import{l as t,n as e,m as a,f as s,M as i,y as r,W as n,r as l,o as c,c as o,w as d,z as u,u as p,v as _,a as h,h as m,j as f,t as D,i as v,k as y,N as k}from"./index-BAqlIHr8.js";import{_ as C}from"./u-icon.BsarszR_.js";import{r as x}from"./uni-app.es.DN0kabVh.js";import{_ as b}from"./u-text.BgsoITjC.js";import{_ as g}from"./_plugin-vue_export-helper.BCo6x5W8.js";import"./u-link.DKGiheSy.js";const I=g({name:"u-steps-item",mixins:[a,s,t({props:{title:{type:[String,Number],default:()=>e.stepsItem.title},desc:{type:[String,Number],default:()=>e.stepsItem.desc},iconSize:{type:[String,Number],default:()=>e.stepsItem.iconSize},error:{type:Boolean,default:()=>e.stepsItem.error},itemStyle:{type:[Object],default:{}}}})],data:()=>({index:0,childLength:0,showLine:!1,size:{height:0,width:0},parentData:{direction:"row",current:0,activeColor:"",inactiveColor:"",activeIcon:"",inactiveIcon:"",dot:!1}}),watch:{parentData(t,e){}},created(){this.init()},computed:{lineStyle(){var t,e;const a={};return"row"===this.parentData.direction?(a.width=this.size.width+"px",a.left=this.size.width/2+"px"):a.height=this.size.height+"px",a.backgroundColor=(null==(e=null==(t=this.parent.children)?void 0:t[this.index+1])?void 0:e.error)?i.error:this.index<this.parentData.current?this.parentData.activeColor:this.parentData.inactiveColor,a},itemStyleInner(){return{...this.itemStyle}},statusClass(){const{index:t,error:e}=this,{current:a}=this.parentData;return a==t?!0===e?"error":"process":e?"error":a>t?"finish":"wait"},statusColor(){let t="";switch(this.statusClass){case"finish":t=this.parentData.activeColor;break;case"error":t=i.error;break;case"process":t=this.parentData.dot?this.parentData.activeColor:"transparent";break;default:t=this.parentData.inactiveColor}return t},contentStyle(){const t={};return"column"===this.parentData.direction?(t.marginLeft=this.parentData.dot?"2px":"6px",t.marginTop=this.parentData.dot?"0px":"6px"):(t.marginTop=this.parentData.dot?"2px":"6px",t.marginLeft=this.parentData.dot?"2px":"6px"),t}},mounted(){this.parent&&this.parent.updateFromChild(),r().then((()=>{this.getStepsItemRect()}))},methods:{init(){if(this.updateParentData(),!this.parent)return n();this.index=this.parent.children.indexOf(this),this.childLength=this.parent.children.length},updateParentData(){this.getParentData("u-steps")},updateFromParent(){this.init()},getStepsItemRect(){this.$uGetRect(".u-steps-item").then((t=>{this.size=t}))}}},[["render",function(t,e,a,s,i,r){const n=v,k=x(l("u-icon"),C),g=y,I=x(l("up-text"),b);return c(),o(n,{class:u(["u-steps-item",[`u-steps-item--${i.parentData.direction}`]]),ref:"u-steps-item"},{default:d((()=>[i.index+1<i.childLength?(c(),o(n,{key:0,class:u(["u-steps-item__line",[`u-steps-item__line--${i.parentData.direction}`]]),style:p([r.lineStyle])},null,8,["class","style"])):_("",!0),h(n,{class:u(["u-steps-item__wrapper",[`u-steps-item__wrapper--${i.parentData.direction}`,i.parentData.dot&&`u-steps-item__wrapper--${i.parentData.direction}--dot`]]),style:p([r.itemStyleInner])},{default:d((()=>[m(t.$slots,"icon",{},(()=>[i.parentData.dot?(c(),o(n,{key:0,class:"u-steps-item__wrapper__dot",style:p({backgroundColor:r.statusColor})},null,8,["style"])):i.parentData.activeIcon||i.parentData.inactiveIcon?(c(),o(n,{key:1,class:"u-steps-item__wrapper__icon"},{default:d((()=>[h(k,{name:i.index<=i.parentData.current?i.parentData.activeIcon:i.parentData.inactiveIcon,size:t.iconSize,color:i.index<=i.parentData.current?i.parentData.activeColor:i.parentData.inactiveColor},null,8,["name","size","color"])])),_:1})):(c(),o(n,{key:2,style:p({backgroundColor:"process"===r.statusClass?i.parentData.activeColor:"transparent",borderColor:r.statusColor}),class:"u-steps-item__wrapper__circle"},{default:d((()=>["process"===r.statusClass||"wait"===r.statusClass?(c(),o(g,{key:0,class:"u-steps-item__wrapper__circle__text",style:p({color:i.index==i.parentData.current?"#ffffff":i.parentData.inactiveColor})},{default:d((()=>[f(D(i.index+1),1)])),_:1},8,["style"])):(c(),o(k,{key:1,color:"error"===r.statusClass?"error":i.parentData.activeColor,size:"12",name:"error"===r.statusClass?"close":"checkmark"},null,8,["color","name"]))])),_:1},8,["style"]))]),!0)])),_:3},8,["class","style"]),h(n,{class:u(["u-steps-item__content",[`u-steps-item__content--${i.parentData.direction}`]]),style:p([r.contentStyle])},{default:d((()=>[h(I,{text:t.title,type:i.parentData.current==i.index?"main":"content",lineHeight:"20px",size:i.parentData.current==i.index?14:13},null,8,["text","type","size"]),m(t.$slots,"desc",{},(()=>[h(I,{text:t.desc,type:"tips",size:"12"},null,8,["text"])]),!0)])),_:3},8,["class","style"])])),_:3},8,["class"])}],["__scopeId","data-v-b1b96d22"]]);const S=g({name:"u-steps",mixins:[a,s,t({props:{direction:{type:String,default:()=>e.steps.direction},current:{type:[String,Number],default:()=>e.steps.current},activeColor:{type:String,default:()=>e.steps.activeColor},inactiveColor:{type:String,default:()=>e.steps.inactiveColor},activeIcon:{type:String,default:()=>e.steps.activeIcon},inactiveIcon:{type:String,default:()=>e.steps.inactiveIcon},dot:{type:Boolean,default:()=>e.steps.dot}}})],data:()=>({}),watch:{children(){this.updateChildData()},parentData(){this.updateChildData()}},computed:{parentData(){return[this.current,this.direction,this.activeColor,this.inactiveColor,this.activeIcon,this.inactiveIcon,this.dot]}},methods:{updateChildData(){this.children.map((t=>{k.func((t||{}).updateFromParent())&&t.updateFromParent()}))},updateFromChild(){this.updateChildData()}},created(){this.children=[]},options:{virtualHost:!1}},[["render",function(t,e,a,s,i,r){const n=v;return c(),o(n,{class:u(["u-steps",[`u-steps--${t.direction}`]])},{default:d((()=>[m(t.$slots,"default",{},void 0,!0)])),_:3},8,["class"])}],["__scopeId","data-v-90d76c6f"]]);const w=g({data:()=>({current1:1}),onLoad(){}},[["render",function(t,e,a,s,i,r){const n=y,u=x(l("up-steps-item"),I),p=x(l("up-steps"),S),_=v;return c(),o(_,{class:"u-page"},{default:d((()=>[h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("基础演示")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:i.current1},{default:d((()=>[h(u,{title:"已下单",desc:"10:30",itemStyle:{backgroundColor:"#eee"}}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1},8,["current"])])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("显示点类型")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1,dot:""},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1}),h(p,{current:1,dot:"",direction:"column"},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("错误状态")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{error:"",title:"仓库着火",desc:"10:35"}),h(u,{title:"破产清算",desc:"11:40"})])),_:1})])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("自定义图标")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1,activeIcon:"checkmark",inactiveIcon:"arrow-right"},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("自定义插槽")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"},{icon:d((()=>[h(n,{class:"slot-icon"},{default:d((()=>[f("运")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("自定义颜色")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1,activeColor:"#3c9cff"},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),h(_,{class:"u-demo-block"},{default:d((()=>[h(n,{class:"u-demo-block__title"},{default:d((()=>[f("竖向展示")])),_:1}),h(_,{class:"u-demo-block__content"},{default:d((()=>[h(p,{current:1,direction:"column"},{default:d((()=>[h(u,{title:"已下单",desc:"10:30"}),h(u,{title:"已出库",desc:"10:35"}),h(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-8fffced7"]]);export{w as default};