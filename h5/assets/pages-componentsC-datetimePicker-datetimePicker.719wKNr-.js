import{_ as e,r as o,a as n,c as l,w as a,E as t,aA as i,ax as c,aD as s,ay as u,i as r,b as m,d,o as h,g as C,h as w,j as f,F as p,m as v,k as g}from"./index-Bme5D8O8.js";const k=e({data(){const e=new Date;return e.getFullYear(),uni.$u.padZero(e.getMonth()+1),e.getDate(),{current:0,value1:Number(new Date),value2:Number(new Date),value3:Number(new Date),value4:"05:28",value5:Number(new Date),value6:Number(new Date),value7:Number(new Date),show1:!1,show2:!1,show3:!1,show4:!1,show5:!1,show6:!1,show7:!1,list:[{title:"完整日期时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/6.png"},{title:"年月日",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/4.png"},{title:"年月",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/3.png"},{title:"时间",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/5.png"},{title:"过滤器(保留偶数年)",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/2.png"},{title:"格式化",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/1.png"},{title:"限制最大最小值",iconUrl:"https://cdn.uviewui.com/uview/demo/datetime-picker/7.png"}]}},methods:{close(){this[`show${this.current}`]=!1},cancel(){this[`show${this.current}`]=!1},confirm(e){this[`show${this.current}`]=!1,this.result(e.value,e.mode)},change(e){},navigateBack(){uni.navigateBack()},filter:(e,o)=>"year"===e?o.filter((e=>e%2==0)):o,showDatetimePicker(e){this.current=e+1,this[`show${e+1}`]=!0},result(e,o){const n=uni.$u.timeFormat,l=uni.$u.toast;switch(o){case"datetime":return l(n(e,"yyyy-mm-dd hh:MM"));case"date":return l(n(e,"yyyy-mm-dd"));case"year-month":return l(n(e,"yyyy-mm"));case"time":return l(e);default:return""}},formatter:(e,o)=>"year"===e?`${o}年`:"month"===e?`${o}月`:"day"===e?`${o}日`:o}},[["render",function(e,k,y,V,b,U){const _=o(n("up-navbar"),t),O=o(n("up-input"),i),D=o(n("up-form-item"),c),$=o(n("up-datetime-picker"),s),x=o(n("up-form"),u),N=r,B=g,F=o(n("up-cell"),m),I=o(n("up-cell-group"),d);return h(),l(N,{class:"u-page"},{default:a((()=>[C(_,{title:"datetimePicker 时间日期选择器",onLeftClick:U.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),C(N,{class:"u-demo-block__content",style:{padding:"0 15px"}},{default:a((()=>[C(x,{class:"u-demo-block__content",labelPosition:"left",ref:"form1"},{default:a((()=>[C(D,{label:"姓名",prop:"userInfo.name",borderBottom:"",ref:"item1"},{default:a((()=>[C(O)])),_:1},512),C(D,{borderBottom:"",label:"日期"},{default:a((()=>[C($,{hasInput:"",placeholder:"请选择日期",mode:"datetime",modelValue:1714266792e3})])),_:1})])),_:1},512)])),_:1}),C(I,null,{default:a((()=>[(h(!0),w(p,null,f(b.list,((e,o)=>(h(),l(F,{onClick:e=>U.showDatetimePicker(o),title:e.title,key:o,isLink:""},{icon:a((()=>[C(B,{class:"u-cell-icon",src:e.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),C($,{show:b.show1,modelValue:b.value1,"onUpdate:modelValue":k[0]||(k[0]=e=>b.value1=e),mode:"datetime",closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},{"toolbar-right":a((()=>[v(" 右侧 ")])),_:1},8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show2,modelValue:b.value2,"onUpdate:modelValue":k[1]||(k[1]=e=>b.value2=e),mode:"date",closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show3,modelValue:b.value3,"onUpdate:modelValue":k[2]||(k[2]=e=>b.value3=e),mode:"year-month",closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show4,modelValue:b.value4,"onUpdate:modelValue":k[3]||(k[3]=e=>b.value4=e),mode:"time",closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show5,modelValue:b.value5,"onUpdate:modelValue":k[4]||(k[4]=e=>b.value5=e),filter:U.filter,mode:"date",closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","filter","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show6,modelValue:b.value6,"onUpdate:modelValue":k[5]||(k[5]=e=>b.value6=e),mode:"date",formatter:U.formatter,closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","formatter","onConfirm","onCancel","onChange","onClose"]),C($,{show:b.show7,modelValue:b.value7,"onUpdate:modelValue":k[6]||(k[6]=e=>b.value7=e),mode:"datetime",minDate:875635200,maxDate:1786778555e3,closeOnClickOverlay:"",onConfirm:U.confirm,onCancel:U.cancel,onChange:U.change,onClose:U.close},null,8,["show","modelValue","onConfirm","onCancel","onChange","onClose"])])),_:1})}],["__scopeId","data-v-7c51cab7"]]);export{k as default};
