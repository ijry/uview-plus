import{_ as n}from"./u-navbar.e3194188.js";import{o,c as e,w as l,a as c,b as i,r as s,F as a,d as u,i as t,e as r}from"./index.639d3d9d.js";import{r as m}from"./uni-app.es.f87317fd.js";import{_ as h}from"./u-cell.572d7e8b.js";import{_ as d}from"./u-cell-group.faa24020.js";import{_ as p}from"./u-picker.937eb35f.js";import{_ as f}from"./plugin-vue_export-helper.21dcd24c.js";import"./u-status-bar.83380ec3.js";import"./u-icon.8fecb8b7.js";import"./u-line.e68cb869.js";import"./u-loading-icon.1043df4a.js";import"./u-popup.7f98a8f1.js";import"./u-overlay.d6cc6c6f.js";import"./u-transition.bbe9f451.js";import"./u-safe-bottom.457b576f.js";var C=f({data:()=>({index:0,loading:!1,columnData:[["深圳","厦门","上海","拉萨"],["得州","华盛顿","纽约","阿拉斯加"]],columns1:[["中国","美国","日本"]],columns2:[["中国","美国","日本"]],columns3:[["中国","美国"],["深圳","厦门","上海","拉萨"]],columns4:[["中国","美国"],["深圳","厦门","上海","拉萨"]],columns5:[["中国","美国","日本"]],columns6:[["中国","美国","日本"]],columns7:[[{label:"苹果",value:1},{label:"橘子",value:2},{label:"香蕉",value:3}]],show1:!1,show2:!1,show3:!1,show4:!1,show5:!1,show6:!1,list:[{title:"基础使用",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/2.png"},{title:"设置默认项",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/5.png"},{title:"多列联动",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/1.png"},{title:"加载中状态(切换第一列)",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/3.png"},{title:"设置标题",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/4.png"},{title:"允许点击遮罩关闭",iconUrl:"https://cdn.uviewui.com/uview/demo/picker/6.png"}]}),methods:{changeHandler1(n){this.change(n);const{columnIndex:o,value:e,values:l,index:c,picker:i=this.$refs.uPicker3}=n;0===o&&i.setColumnValues(1,this.columnData[c])},changeHandler2(n){this.change(n);const{columnIndex:o,value:e,values:l,index:c,picker:i=this.$refs.uPicker4}=n;0===o&&(this.loading=!0,uni.$u.sleep(1500).then((()=>{i.setColumnValues(1,this.columnData[c]),this.loading=!1})))},navigateBack(){uni.navigateBack()},change(n){},showPicker(n){this.index=n+1,this[`show${n+1}`]=!0},close(){this[`show${this.index}`]=!1},confirm(n){this[`show${this.index}`]=!1},cancel(){this[`show${this.index}`]=!1}}},[["render",function(f,C,g,w,v,k){const b=m(u("u-navbar"),n),j=r,x=m(u("u-cell"),h),_=m(u("u-cell-group"),d),U=m(u("u-picker"),p),$=t;return o(),e($,{class:"u-page",ref:"page"},{default:l((()=>[c(b,{title:"选择器",onLeftClick:k.navigateBack,safeAreaInsetTop:"",fixed:"",placeholder:""},null,8,["onLeftClick"]),c(_,null,{default:l((()=>[(o(!0),i(a,null,s(v.list,((n,i)=>(o(),e(x,{onClick:n=>k.showPicker(i),title:n.title,key:i,isLink:""},{default:l((()=>[c(j,{slot:"icon",class:"u-cell-icon",src:n.iconUrl,mode:"widthFix"},null,8,["src"])])),_:2},1032,["onClick","title"])))),128))])),_:1}),c(U,{show:v.show1,columns:v.columns1,onChange:k.change,onCancel:k.cancel,onConfirm:k.confirm},null,8,["show","columns","onChange","onCancel","onConfirm"]),c(U,{show:v.show2,columns:v.columns2,defaultIndex:[1],onCancel:k.cancel,onConfirm:k.confirm,onChange:k.change},null,8,["show","columns","onCancel","onConfirm","onChange"]),c(U,{show:v.show3,columns:v.columns3,ref:"uPicker3",onCancel:k.cancel,onConfirm:k.confirm,onChange:k.changeHandler1},null,8,["show","columns","onCancel","onConfirm","onChange"]),c(U,{show:v.show4,columns:v.columns4,onCancel:k.cancel,onConfirm:k.confirm,loading:v.loading,onChange:k.changeHandler2,ref:"uPicker4"},null,8,["show","columns","onCancel","onConfirm","loading","onChange"]),c(U,{show:v.show5,columns:v.columns5,title:"标题太长就会显示省略号",onCancel:k.cancel,onConfirm:k.confirm,onChange:k.change},null,8,["show","columns","onCancel","onConfirm","onChange"]),c(U,{show:v.show6,columns:v.columns6,closeOnClickOverlay:"",onCancel:k.cancel,onConfirm:k.confirm,onClose:k.close,onChange:k.change},null,8,["show","columns","onCancel","onConfirm","onClose","onChange"])])),_:1},512)}],["__scopeId","data-v-445c94b4"]]);export{C as default};
