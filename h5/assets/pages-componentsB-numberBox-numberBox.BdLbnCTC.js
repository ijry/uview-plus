import{_ as e,r as l,a,c as n,w as o,ai as u,b as t,y as d,i,d as s,o as g,g as h,m as r,t as m,n as c}from"./index-Bme5D8O8.js";const p=e({data:()=>({value1:3,value2:3,value3:3,value4:3,value5:3,value6:3,value7:3,value8:3.1,value9:3,value10:3,value11:3,step1:2,min1:5,max1:8,asyncChange:!0,color:"#FFFFFF",buttonSize:36,bgColor:"#2979ff"}),methods:{change(e){console.log("change",e)},myAsyncChange(e){this.asyncChange=!1,uni.showLoading({title:"正在加载"}),setTimeout((()=>{uni.hideLoading(),this.value9=e,this.asyncChange=!0}),3e3)}}},[["render",function(e,p,v,V,C,b){const _=l(a("up-number-box"),u),f=l(a("up-cell"),t),y=l(a("up-icon"),d),F=i,U=c,x=l(a("up-cell-group"),s);return g(),n(F,{class:""},{default:o((()=>[h(x,{border:!0},{default:o((()=>[h(f,{border:!0,title:"基础用法"},{"right-icon":o((()=>[h(_,{modelValue:C.value1,"onUpdate:modelValue":p[0]||(p[0]=e=>C.value1=e),step:"1",onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"步长设置"},{"right-icon":o((()=>[h(_,{modelValue:C.value2,"onUpdate:modelValue":p[1]||(p[1]=e=>C.value2=e),step:C.step1,onChange:b.change},null,8,["modelValue","step","onChange"])])),_:1}),h(f,{border:!0,title:"限制输入范围"},{"right-icon":o((()=>[h(_,{modelValue:C.value3,"onUpdate:modelValue":p[2]||(p[2]=e=>C.value3=e),step:"1",min:C.min1,max:C.max1,onChange:b.change},null,8,["modelValue","min","max","onChange"])])),_:1}),h(f,{border:!0,title:"限制输入整数"},{"right-icon":o((()=>[h(_,{modelValue:C.value4,"onUpdate:modelValue":p[3]||(p[3]=e=>C.value4=e),step:"1",integer:"",onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"禁用状态"},{"right-icon":o((()=>[h(_,{modelValue:C.value5,"onUpdate:modelValue":p[4]||(p[4]=e=>C.value5=e),step:"1",disabled:!0,onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"禁用输入框"},{"right-icon":o((()=>[h(_,{modelValue:C.value6,"onUpdate:modelValue":p[5]||(p[5]=e=>C.value6=e),step:"1",disabledInput:!0,onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"禁用长按"},{"right-icon":o((()=>[h(_,{modelValue:C.value7,"onUpdate:modelValue":p[6]||(p[6]=e=>C.value7=e),step:"1",longPress:!1,onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"固定小数位数"},{"right-icon":o((()=>[h(_,{modelValue:C.value8,"onUpdate:modelValue":p[7]||(p[7]=e=>C.value8=e),step:"0.2",decimalLength:"1",onChange:b.change},null,8,["modelValue","onChange"])])),_:1}),h(f,{border:!0,title:"异步变更"},{"right-icon":o((()=>[h(_,{modelValue:C.value9,"onUpdate:modelValue":p[8]||(p[8]=e=>C.value9=e),step:"1",asyncChange:C.asyncChange,onChange:b.myAsyncChange},null,8,["modelValue","asyncChange","onChange"])])),_:1}),h(f,{border:!0,title:"自定义大小颜色样式"},{"right-icon":o((()=>[h(_,{modelValue:C.value10,"onUpdate:modelValue":p[9]||(p[9]=e=>C.value10=e),step:"1",color:C.color,buttonSize:C.buttonSize,bgColor:C.bgColor,onChange:b.change,iconStyle:"color: #fff"},null,8,["modelValue","color","buttonSize","bgColor","onChange"])])),_:1}),h(f,{border:!0,title:"自定义(为0时减少按钮会消失)"},{"right-icon":o((()=>[h(_,{modelValue:C.value11,"onUpdate:modelValue":p[10]||(p[10]=e=>C.value11=e),step:"1",min:0,showMinus:C.value11>0},{minus:o((()=>[h(F,{class:"minus"},{default:o((()=>[h(y,{name:"minus",size:"12"})])),_:1})])),input:o((()=>[h(U,{style:{width:"50px","text-align":"center"},class:"input"},{default:o((()=>[r(m(C.value11),1)])),_:1})])),plus:o((()=>[h(F,{class:"plus"},{default:o((()=>[h(y,{name:"plus",color:"#FFFFFF",size:"12"})])),_:1})])),_:1},8,["modelValue","showMinus"])])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-b6668e87"]]);export{p as default};
