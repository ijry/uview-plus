import{_ as e,c as l,w as a,i as c,r as o,V as t,a as d,W as n,q as u,o as s,g as m,m as b,n as _,h as k,F as h,j as i,t as x}from"./index-BRmPopP0.js";const f=e({data:()=>({checkboxList1:[{name:"苹果",disabled:!1},{name:"香蕉",disabled:!1},{name:"橙子",disabled:!1}],aloneChecked:!1,checkboxValue1:["苹果","橙子"],checkboxList2:[{name:"西游记",disabled:!1},{name:"红楼梦",disabled:!1},{name:"三国演义",disabled:!1},{name:"水浒传",disabled:!1}],checkboxValue2:["西游记","红楼梦","三国演义","水浒传"],checkboxList3:[{name:"冬瓜",disabled:!1},{name:"西瓜",disabled:!1},{name:"黄瓜",disabled:!1},{name:"傻瓜",disabled:!1}],checkboxValue3:["傻瓜"],checkboxList4:[{name:"黄庭坚",disabled:!1},{name:"欧阳修",disabled:!1},{name:"苏小宝",disabled:!1},{name:"王安石",disabled:!1}],checkboxValue4:["黄庭坚","欧阳修","王安石"],checkboxList5:[{name:"红色",disabled:!1},{name:"黄色",disabled:!1},{name:"绿色",disabled:!1},{name:"蓝色",disabled:!1}],checkboxValue5:["绿色"],checkboxList6:[{name:"小鸟",disabled:!1},{name:"游艇",disabled:!1},{name:"轮船",disabled:!1},{name:"飞机",disabled:!1}],checkboxValue6:["游艇","轮船"],checkboxList7:[{name:"汽车",disabled:!1},{name:"蒸汽机",disabled:!1},{name:"猪肉",disabled:!1},{name:"抄手",disabled:!1}],checkboxValue7:["汽车","蒸汽机"]}),watch:{checkboxValue1(e,l){}},methods:{checkboxChange(e){},changeAloneChecked(){this.aloneChecked=!this.aloneChecked}}},[["render",function(e,f,g,V,p,C){const r=b,y=o(d("up-checkbox"),t),L=o(d("up-checkbox-group"),n),B=c,S=o(d("up-button"),u);return s(),l(B,{class:"u-page"},{default:a((()=>[m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("基本案例")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("苹果、香蕉和橙子哪个最甜？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue1,"onUpdate:modelValue":f[0]||(f[0]=e=>p.checkboxValue1=e),placement:"column",onChange:C.checkboxChange},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList1,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"8px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("单独使用checkbox")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("是否同意用户协议？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(y,{customStyle:{marginBottom:"8px"},label:"同意用户协议与隐私条款",name:"agree",usedAlone:"",checked:p.aloneChecked,"onUpdate:checked":f[1]||(f[1]=e=>p.aloneChecked=e)},null,8,["checked"]),m(S,{type:"primary",size:"small",style:{width:"120px"},onClick:C.changeAloneChecked,text:"切换"},{default:a((()=>[_(x(p.aloneChecked),1)])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("自定义形状")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("中国四大名著是？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue2,"onUpdate:modelValue":f[2]||(f[2]=e=>p.checkboxValue2=e),placement:"column",onChange:C.checkboxChange,shape:"square"},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList2,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"8px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("是否禁用")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("下面什么东西不能吃？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue3,"onUpdate:modelValue":f[3]||(f[3]=e=>p.checkboxValue3=e),placement:"column",onChange:C.checkboxChange},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList3,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"8px"},key:a,label:e.name,name:e.name,disabled:0===a},null,8,["label","name","disabled"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("是否禁止点击提示语选中复选框")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("北宋四大家是谁？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue4,"onUpdate:modelValue":f[4]||(f[4]=e=>p.checkboxValue4=e),placement:"column",onChange:C.checkboxChange,labelDisabled:!0},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList4,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"8px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("自定义颜色")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("哪个颜色最好看？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue5,"onUpdate:modelValue":f[5]||(f[5]=e=>p.checkboxValue5=e),placement:"column",onChange:C.checkboxChange,activeColor:"#19be6b"},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList5,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"8px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("横向排列形式")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("什么东西不能飞？")])),_:1}),m(B,{class:"u-demo-block__content"},{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue6,"onUpdate:modelValue":f[6]||(f[6]=e=>p.checkboxValue6=e),onChange:C.checkboxChange},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList6,((e,a)=>(s(),l(y,{customStyle:{marginRight:"16px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1}),m(B,{class:"u-demo-block"},{default:a((()=>[m(r,{class:"u-demo-block__title"},{default:a((()=>[_("横向两端排列形式")])),_:1}),m(r,{class:"u-block__title"},{default:a((()=>[_("什么东西不能吃？")])),_:1}),m(B,null,{default:a((()=>[m(B,{class:"u-page__checkbox-item"},{default:a((()=>[m(L,{modelValue:p.checkboxValue7,"onUpdate:modelValue":f[7]||(f[7]=e=>p.checkboxValue7=e),onChange:C.checkboxChange,borderBottom:!0,placement:"column",iconPlacement:"right"},{default:a((()=>[(s(!0),k(h,null,i(p.checkboxList7,((e,a)=>(s(),l(y,{customStyle:{marginBottom:"16px"},key:a,label:e.name,name:e.name},null,8,["label","name"])))),128))])),_:1},8,["modelValue","onChange"])])),_:1})])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-940b0bb5"]]);export{f as default};
