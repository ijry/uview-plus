import{l as t,m as e,f as a,L as s,x as i,V as r,d as n,o as c,c as o,w as l,y as d,s as u,u as p,a as _,h,j as m,t as f,i as D,k as v,M as k}from"./index-140fc608.js";import{_ as C}from"./u-icon.f3757cb0.js";import{r as x}from"./uni-app.es.432a22c1.js";import{_ as y}from"./u-text.7886f2f8.js";import{_ as b}from"./_plugin-vue_export-helper.1b428a4d.js";import"./u-link.5d1ac0d4.js";const g=b({name:"u-steps-item",mixins:[e,a,{props:{title:{type:[String,Number],default:()=>t.stepsItem.title},desc:{type:[String,Number],default:()=>t.stepsItem.desc},iconSize:{type:[String,Number],default:()=>t.stepsItem.iconSize},error:{type:Boolean,default:()=>t.stepsItem.error}}}],data:()=>({index:0,childLength:0,showLine:!1,size:{height:0,width:0},parentData:{direction:"row",current:0,activeColor:"",inactiveColor:"",activeIcon:"",inactiveIcon:"",dot:!1}}),watch:{parentData(t,e){}},created(){this.init()},computed:{lineStyle(){var t,e;const a={};return"row"===this.parentData.direction?(a.width=this.size.width+"px",a.left=this.size.width/2+"px"):a.height=this.size.height+"px",a.backgroundColor=(null==(e=null==(t=this.parent.children)?void 0:t[this.index+1])?void 0:e.error)?s.error:this.index<this.parentData.current?this.parentData.activeColor:this.parentData.inactiveColor,a},statusClass(){const{index:t,error:e}=this,{current:a}=this.parentData;return a==t?!0===e?"error":"process":e?"error":a>t?"finish":"wait"},statusColor(){let t="";switch(this.statusClass){case"finish":t=this.parentData.activeColor;break;case"error":t=t.error;break;case"process":t=this.parentData.dot?this.parentData.activeColor:"transparent";break;default:t=this.parentData.inactiveColor}return t},contentStyle(){const t={};return"column"===this.parentData.direction?(t.marginLeft=this.parentData.dot?"2px":"6px",t.marginTop=this.parentData.dot?"0px":"6px"):(t.marginTop=this.parentData.dot?"2px":"6px",t.marginLeft=this.parentData.dot?"2px":"6px"),t}},mounted(){this.parent&&this.parent.updateFromChild(),i().then((()=>{this.getStepsItemRect()}))},methods:{init(){if(this.updateParentData(),!this.parent)return r();this.index=this.parent.children.indexOf(this),this.childLength=this.parent.children.length},updateParentData(){this.getParentData("u-steps")},updateFromParent(){this.init()},getStepsItemRect(){this.$uGetRect(".u-steps-item").then((t=>{this.size=t}))}}},[["render",function(t,e,a,s,i,r){const k=D,b=x(n("u-icon"),C),g=v,I=x(n("up-text"),y);return c(),o(k,{class:d(["u-steps-item",[`u-steps-item--${i.parentData.direction}`]]),ref:"u-steps-item"},{default:l((()=>[i.index+1<i.childLength?(c(),o(k,{key:0,class:d(["u-steps-item__line",[`u-steps-item__line--${i.parentData.direction}`]]),style:u([r.lineStyle])},null,8,["class","style"])):p("",!0),_(k,{class:d(["u-steps-item__wrapper",[`u-steps-item__wrapper--${i.parentData.direction}`,i.parentData.dot&&`u-steps-item__wrapper--${i.parentData.direction}--dot`]])},{default:l((()=>[h(t.$slots,"icon",{},(()=>[i.parentData.dot?(c(),o(k,{key:0,class:"u-steps-item__wrapper__dot",style:u({backgroundColor:r.statusColor})},null,8,["style"])):i.parentData.activeIcon||i.parentData.inactiveIcon?(c(),o(k,{key:1,class:"u-steps-item__wrapper__icon"},{default:l((()=>[_(b,{name:i.index<=i.parentData.current?i.parentData.activeIcon:i.parentData.inactiveIcon,size:t.iconSize,color:i.index<=i.parentData.current?i.parentData.activeColor:i.parentData.inactiveColor},null,8,["name","size","color"])])),_:1})):(c(),o(k,{key:2,style:u({backgroundColor:"process"===r.statusClass?i.parentData.activeColor:"transparent",borderColor:r.statusColor}),class:"u-steps-item__wrapper__circle"},{default:l((()=>["process"===r.statusClass||"wait"===r.statusClass?(c(),o(g,{key:0,class:"u-steps-item__wrapper__circle__text",style:u({color:i.index==i.parentData.current?"#ffffff":i.parentData.inactiveColor})},{default:l((()=>[m(f(i.index+1),1)])),_:1},8,["style"])):(c(),o(b,{key:1,color:"error"===r.statusClass?"error":i.parentData.activeColor,size:"12",name:"error"===r.statusClass?"close":"checkmark"},null,8,["color","name"]))])),_:1},8,["style"]))]),!0)])),_:3},8,["class"]),_(k,{class:d(["u-steps-item__content",[`u-steps-item__content--${i.parentData.direction}`]]),style:u([r.contentStyle])},{default:l((()=>[_(I,{text:t.title,type:i.parentData.current==i.index?"main":"content",lineHeight:"20px",size:i.parentData.current==i.index?14:13},null,8,["text","type","size"]),h(t.$slots,"desc",{},(()=>[_(I,{text:t.desc,type:"tips",size:"12"},null,8,["text"])]),!0)])),_:3},8,["class","style"])])),_:3},8,["class"])}],["__scopeId","data-v-31f65ecf"]]);const I=b({name:"u-steps",mixins:[e,a,{props:{direction:{type:String,default:()=>t.steps.direction},current:{type:[String,Number],default:()=>t.steps.current},activeColor:{type:String,default:()=>t.steps.activeColor},inactiveColor:{type:String,default:()=>t.steps.inactiveColor},activeIcon:{type:String,default:()=>t.steps.activeIcon},inactiveIcon:{type:String,default:()=>t.steps.inactiveIcon},dot:{type:Boolean,default:()=>t.steps.dot}}}],data:()=>({}),watch:{children(){this.updateChildData()},parentData(){this.updateChildData()}},computed:{parentData(){return[this.current,this.direction,this.activeColor,this.inactiveColor,this.activeIcon,this.inactiveIcon,this.dot]}},methods:{updateChildData(){this.children.map((t=>{k.func((t||{}).updateFromParent())&&t.updateFromParent()}))},updateFromChild(){this.updateChildData()}},created(){this.children=[]}},[["render",function(t,e,a,s,i,r){const n=D;return c(),o(n,{class:d(["u-steps",[`u-steps--${t.direction}`]])},{default:l((()=>[h(t.$slots,"default",{},void 0,!0)])),_:3},8,["class"])}],["__scopeId","data-v-28dde210"]]);const w=b({data:()=>({current1:1}),onLoad(){}},[["render",function(t,e,a,s,i,r){const d=v,u=x(n("up-steps-item"),g),p=x(n("up-steps"),I),h=D;return c(),o(h,{class:"u-page"},{default:l((()=>[_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("基础演示")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:i.current1},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1},8,["current"])])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("显示点类型")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1,dot:""},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1}),_(p,{current:1,dot:"",direction:"column"},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("错误状态")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{error:"",title:"仓库着火",desc:"10:35"}),_(u,{title:"破产清算",desc:"11:40"})])),_:1})])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("自定义图标")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1,activeIcon:"checkmark",inactiveIcon:"arrow-right"},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("自定义插槽")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"},{icon:l((()=>[_(d,{class:"slot-icon"},{default:l((()=>[m("运")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("自定义颜色")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1,activeColor:"#3c9cff"},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1}),_(h,{class:"u-demo-block"},{default:l((()=>[_(d,{class:"u-demo-block__title"},{default:l((()=>[m("竖向展示")])),_:1}),_(h,{class:"u-demo-block__content"},{default:l((()=>[_(p,{current:1,direction:"column"},{default:l((()=>[_(u,{title:"已下单",desc:"10:30"}),_(u,{title:"已出库",desc:"10:35"}),_(u,{title:"运输中",desc:"11:40"})])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-a2ead52a"]]);export{w as default};
