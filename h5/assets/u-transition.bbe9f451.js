var t=Object.defineProperty,e=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,n=(e,i,s)=>i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s,a=(t,a)=>{for(var r in a||(a={}))i.call(a,r)&&n(t,r,a[r]);if(e)for(var r of e(a))s.call(a,r)&&n(t,r,a[r]);return t};import{j as r,m as o,k as l,o as d,c as u,w as c,l as h,p as m,q as v,n as p,i as y}from"./index.639d3d9d.js";import{_ as f}from"./plugin-vue_export-helper.21dcd24c.js";var $={props:{show:{type:Boolean,default:r.transition.show},mode:{type:String,default:r.transition.mode},duration:{type:[String,Number],default:r.transition.duration},timingFunction:{type:String,default:r.transition.timingFunction}}};const E=t=>({enter:`u-${t}-enter u-${t}-enter-active`,"enter-to":`u-${t}-enter-to u-${t}-enter-active`,leave:`u-${t}-leave u-${t}-leave-active`,"leave-to":`u-${t}-leave-to u-${t}-leave-active`});var b=f({name:"u-transition",data:()=>({inited:!1,viewStyle:{},status:"",transitionEnded:!1,display:!1,classes:""}),computed:{mergeStyle(){const{viewStyle:t,customStyle:e}=this;return a(a({transitionDuration:`${this.duration}ms`,transitionTimingFunction:this.timingFunction},uni.$u.addStyle(e)),t)}},mixins:[o,l,{methods:{clickHandler(){this.$emit("click")},vueEnter(){const t=E(this.mode);this.status="enter",this.$emit("beforeEnter"),this.inited=!0,this.display=!0,this.classes=t.enter,this.$nextTick((async()=>{await uni.$u.sleep(20),this.$emit("enter"),this.transitionEnded=!1,this.$emit("afterEnter"),this.classes=t["enter-to"]}))},vueLeave(){if(!this.display)return;const t=E(this.mode);this.status="leave",this.$emit("beforeLeave"),this.classes=t.leave,this.$nextTick((()=>{this.transitionEnded=!1,this.$emit("leave"),setTimeout(this.onTransitionEnd,this.duration),this.classes=t["leave-to"]}))},onTransitionEnd(){this.transitionEnded||(this.transitionEnded=!0,this.$emit("leave"===this.status?"afterLeave":"afterEnter"),!this.show&&this.display&&(this.display=!1,this.inited=!1))}}},$],watch:{show:{handler(t){t?this.vueEnter():this.vueLeave()},immediate:!0}}},[["render",function(t,e,i,s,n,a){const r=y;return n.inited?(d(),u(r,{key:0,class:m(["u-transition",n.classes]),ref:"u-transition",onClick:t.clickHandler,style:v([a.mergeStyle]),onTouchmove:t.noop},{default:c((()=>[h(t.$slots,"default",{},void 0,!0)])),_:3},8,["onClick","class","style","onTouchmove"])):p("",!0)}],["__scopeId","data-v-98682a22"]]);export{b as _};
