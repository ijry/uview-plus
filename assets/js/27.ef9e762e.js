(window.webpackJsonp=window.webpackJsonp||[]).push([[27,95],{290:function(t,e,a){"use strict";var i=a(291),s=a.n(i),r=a(73);let o={request:async(t,e)=>{let a=localStorage.getItem("userState");a&&(a=JSON.parse(a)),console.log("userState",a);let i="";"string"==typeof t?e.url=t:e=t,e.url.startsWith("/")&&(i="https://fastview.lingyun.net/api"+e.url);const r={"Content-Type":"application/json",Authorization:a?a.token:""};let o=(await s()(i,{method:e.method,data:e&&e.data?e.data:{},params:e&&e.params?e.params:{},headers:r})).data;if(401!=o.code)return o;alert("未登录")},formatTime:function(t,e){return o.timeFormat(t,e)},timeFormat:function(t,e){if(!t)return"";e||(e="yyyy-MM-dd HH:mm");let a="";if("object"==typeof t)a=t;else{if("number"!=typeof t)return t;a=new Date(1e3*t)}/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));let i={"M+":a.getMonth()+1,"d+":a.getDate(),"H+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds()};for(let t in i)if(new RegExp(`(${t})`).test(e)){let a=i[t]+"";e=e.replace(RegExp.$1,1===RegExp.$1.length?a:o.padLeftZero(a))}return e},padLeftZero:function(t){return("00"+t).substr(t.length)},showToast:function(t){Object(r.Message)(t.msg)}};e.a=o},324:function(t,e,a){"use strict";a.r(e);var i=a(290),s={props:{successUrl:String,tradeNo:String},data:()=>({showDialog:!1,timer:null,payResult:""}),methods:{toggleDialog(t){t?this.timer=setInterval(()=>{this.getPayResult()},3e3):clearInterval(this.timer),this.showDialog=t},successPay(){this.toggleDialog(!1),this.successUrl&&this.$router.push({path:this.successUrl})},hasProblem(){alert("请联系客服支持")},getPayResult:async function(){let t=await i.a.request({url:"/v1/pay/order/info",data:{tradeNo:this.tradeNo},method:"get"});200==t.code?t.data.info.payTime>0&&(clearInterval(this.timer),this.payResult="支付成功，即将跳转。",setTimeout(()=>{this.$router.push({path:this.successUrl})},1e3)):console.log(t)}},created(){this.router=this.$router}},r=a(6),o=Object(r.a)(s,(function(){var t=this,e=t._self._c;return e("el-dialog",{attrs:{title:"提示",width:"700px"},model:{value:t.showDialog,callback:function(e){t.showDialog=e},expression:"showDialog"}},[t._t("default",(function(){return[e("div",{staticClass:"lh-1-6"},[t._v("\n        请在新页面打开的支付网页进行付款，如果页面没有正常打开请检查浏览器地址栏右侧是否存在拦截弹窗图标。\n        如果您付款后没有正确获得订单信息，您可以联系客服进行解决。\n      ")])]})),t._v(" "),e("div",{staticClass:"tip text-center lh-2 m-t-sm m-b"},[t._v("\n      "+t._s(t.payResult)+"\n    ")]),t._v(" "),e("div",{staticClass:"flex justify-center"},[e("el-button",{attrs:{type:"danger",size:"default"},on:{click:t.hasProblem}},[t._v("遇到问题？")]),t._v(" "),e("el-button",{attrs:{type:"success",size:"default"},on:{click:t.successPay}},[t._v("支付成功")])],1)],2)}),[],!1,null,"33c658e8",null);e.default=o.exports},425:function(t,e,a){"use strict";a.r(e);var i=a(290),s={components:{payingComp:a(324).default},props:{vipTypeList:Array,productName:{type:String,default:""},paymentCycles:{type:Array,default:function(){return[1]}},successUrl:String},data:()=>({contactDialog:!1,myVipList:[],loadedMyVip:0,loadingMyVip:!1,realMoney:0,payTypeOpen:["alipay"],typeData:{},buyDialog:!1,currentVipItem:{},form:{amount:1,payType:""},orderData:{},buyType:0,tradeNo:"",buyLoading:!1,payingRef:null,orderSets:{}}),mounted(){this.loadVipType(),this.payTypeOpen.length>0&&(this.form.payType=this.payTypeOpen[0])},methods:{timeFormat:(t,e)=>i.a.timeFormat(t,e),loadVipType:async function(){let t=await i.a.request({url:"/v1/user_vip/type/lists/"+this.productName,method:"get",data:{paymentCycles:this.paymentCycles.join(",")}});"200"==t.code?(this.vipTypeList.splice(0,this.vipTypeList.length),this.vipTypeList.push(...t.data.dataList)):i.a.showToast({title:t.msg,icon:"loading",duration:3e3})},loadMyVip:async function(){this.loadingMyVip=!0;let t=await i.a.request({url:"/v1/user_vip/order/my?productName="+this.productName,method:"get"});if("200"==t.code){if(this.myVipList=t.data.dataList,this.myVipList.length)if(this.myVipList[0].paymentCycle==this.typeData.paymentCycle)99==this.myVipList[0].paymentCycle?alert("终身套餐无需续费"):this.myVipList[0].level==this.typeData.level?this.buyType=2:this.myVipList[0].level<this.typeData.level?(this.buyType=3,this.form.amount=this.myVipList[0].amount):this.myVipList[0].level>this.typeData.level&&(this.buyType=0,alert("不支持降级"));else switch(this.myVipList[0].paymentCycle){case 1:alert("请选择月费套餐进行续费或者升级");break;case 2:alert("请选择年费套餐进行续费或者升级");break;case 99:alert("终身套餐无需续费")}else this.buyType=1;this.loadedMyVip=1}else i.a.showToast({title:t.msg,icon:"loading",duration:3e3}),this.loadedMyVip=-1;this.loadingMyVip=!1},getPriceSum:async function(){switch(this.buyType){case 1:case 2:this.realMoney=(this.typeData.price*this.form.amount).toFixed(2);break;case 3:await this.countOrderMoney(),this.realMoney=this.orderSets.realMoney;break;default:this.realMoney=0}},buyVip:async function(t){this.currentVipItem=t,("0.00"!=this.currentVipItem.price||this.currentVipItem.needBy)&&(this.currentVipItem.price<0?this.contactDialog=!0:(this.buyDialog=!0,this.typeData=this.currentVipItem,this.loadedMyVip=0,await this.loadMyVip())),this.syncOrderData(),this.getPriceSum()},syncOrderData:function(){this.orderData={oneOrder:1,orderItems:[{spuId:this.currentVipItem.productName,skuId:this.currentVipItem.id,amount:this.form.amount,extra:{preVipRecordId:3==this.buyType?this.myVipList[0].id:0}}],extra:{buyType:this.buyType,module:"user_vip",service:"Order",payType:this.form.payType,payPlatform:"pc"}}},countOrderMoney:async function(){this.syncOrderData();let t=await i.a.request({url:"/v1/order/order/money",data:this.orderData,method:"post"});200==t.code?this.orderSets=t.data.orderSets:alert(t.msg)},onBuySubmit:async function(){this.syncOrderData(),this.buyLoading=!0;let t=await i.a.request({url:"/v1/order/order/submit",data:this.orderData,method:"post"});if(200!=t.code)return this.buyLoading=!1,void alert(t.msg);if(this.tradeNo=t.data.tradeNo,this.orderSets=t.data.orderSets,t.data.paySuccess)i.a.showToast({title:"支付成功",icon:"success",duration:2e3}),this.$router.push({path:this.successUrl});else if(t.data.isRedirect)this.payingRef.toggleDialog(!0),window.open(t.data.payString,"_blank");else{let e=new URLSearchParams;e.append("realMoney",this.orderSets.realMoney),e.append("payType",this.form.payType),e.append("tradeNo",this.tradeNo),e.append("payString",t.data.payString);let a=e.toString();location.href="/user/qrpay.html?"+a}},toggleDialog:function(t){this.buyDialog=t}},created(){this.router=this.$router}},r=a(6),o=Object(r.a)(s,(function(){var t=this,e=t._self._c;return e("div",[e("el-dialog",{attrs:{title:"联系客服",visible:t.contactDialog,width:"500px"},on:{"update:visible":function(e){t.contactDialog=e}},scopedSlots:t._u([{key:"footer",fn:function(){return[e("span",[e("el-button",{on:{click:function(e){t.contactDialog=!1}}},[t._v("关闭")])],1)]},proxy:!0}])},[e("h3",{staticClass:"ts-20"},[t._v("QQ: 598821125")])]),t._v(" "),e("el-dialog",{attrs:{title:"成为会员",visible:t.buyDialog,width:"700px"},on:{"update:visible":function(e){t.buyDialog=e}},scopedSlots:t._u([{key:"footer",fn:function(){},proxy:!0}])},[e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingMyVip,expression:"loadingMyVip"}]},[e("el-form",{ref:"buyForm",attrs:{"label-width":"100px",inline:!1,size:"large"}},[3==t.buyType?e("el-form-item",{attrs:{label:"原会员等级"}},[e("el-input",{attrs:{disabled:""},model:{value:t.myVipList[0].typeInfo.title,callback:function(e){t.$set(t.myVipList[0].typeInfo,"title",e)},expression:"myVipList[0].typeInfo.title"}})],1):t._e(),t._v(" "),e("el-form-item",{attrs:{label:3==t.buyType?"升级到":"会员等级"}},[e("el-input",{attrs:{disabled:""},model:{value:t.typeData.title,callback:function(e){t.$set(t.typeData,"title",e)},expression:"typeData.title"}})],1),t._v(" "),2==t.buyType||3==t.buyType?e("el-form-item",{attrs:{label:"到期时间"}},[t._v("\n          "+t._s(t.timeFormat(t.myVipList[0].expireTime))+"\n          "),2==t.buyType?e("span",{staticClass:"m-l-xs text-danger"},[t._v("续费时长将从到期时间往后累计")]):t._e()]):t._e(),t._v(" "),t.buyType<3?e("el-form-item",{scopedSlots:t._u([{key:"label",fn:function(){return[1==t.buyType?e("span",[t._v("购买")]):2==t.buyType?e("span",[t._v("续费")]):t._e(),t._v(" "),e("span",[t._v("时长")])]},proxy:!0}],null,!1,885116272)},[t._v(" "),99!=t.typeData.paymentCycle?[e("el-input-number",{attrs:{size:"normal",disabled:3==t.buyType,min:1,max:12,step:1,controls:!0,"controls-position":"both"},on:{change:t.getPriceSum},model:{value:t.form.amount,callback:function(e){t.$set(t.form,"amount",e)},expression:"form.amount"}})]:t._e(),t._v(" "),e("span",{staticClass:"m-l-xs"},[1==t.typeData.paymentCycle?e("span",[t._v("月")]):2==t.typeData.paymentCycle?e("span",[t._v("年")]):99==t.typeData.paymentCycle?e("span",[t._v("终身")]):t._e()])],2):t._e(),t._v(" "),e("el-form-item",{attrs:{label:"总价"}},[e("span",{staticClass:"text-danger ts-18"},[t._v("\n            ¥"+t._s(t.realMoney)+"元\n          ")])]),t._v(" "),e("el-form-item",[t.buyType>0?e("el-button",{staticClass:"w-40",attrs:{disabled:t.realMoney<=0||1!=t.loadedMyVip,size:"large",type:"danger"},on:{click:t.onBuySubmit}},[t._v("立即支付")]):t._e()],1),t._v(" "),-1==t.loadedMyVip?e("el-alert",{staticClass:"m-t-md",attrs:{title:"提示",type:"error",effect:"light","show-icon":"",closable:!1}},[t._v("\n          查询已开通会员出错\n        ")]):t._e()],1),t._v(" "),e("el-alert",{staticClass:"m-t-md",attrs:{title:"提示",type:"info",effect:"light","show-icon":"",closable:!1}},[t._v("\n        虚拟商品，一经购买不可退款，请谨慎购买。一个月统一以30天计算，一年统一以365天计算。\n      ")])],1)]),t._v(" "),e("payingComp",{ref:"payingRef",attrs:{tradeNo:t.tradeNo,successUrl:t.successUrl}})],1)}),[],!1,null,"48f9b800",null);e.default=o.exports}}]);