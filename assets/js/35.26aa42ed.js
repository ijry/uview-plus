(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{409:function(t,e,a){},514:function(t,e,a){"use strict";a(409)},545:function(t,e,a){"use strict";a.r(e);var i=a(291),l=a.n(i),r={name:"giteeContributionList",props:{owner:{type:String,default:"umicro"},repo:{type:String,default:"uview-plus"},type:{type:String,default:"authors"}},data:()=>({tableData:[]}),created(){l.a.get(`https://gitee.com/api/v5/repos/${this.owner}/${this.repo}/contributors?type=${this.type}`).then(t=>{this.tableData=t.data})}},n=(a(514),a(6)),o=Object(n.a)(r,(function(){var t=this._self._c;return t("el-table",{style:{maxWidth:"630px"},attrs:{data:this.tableData,"max-height":"550",border:!1,stripe:""}},[t("el-table-column",{attrs:{prop:"name",label:"姓名",width:"180"}}),this._v(" "),t("el-table-column",{attrs:{prop:"email",label:"邮箱",width:"350"}}),this._v(" "),t("el-table-column",{attrs:{prop:"contributions",label:"贡献次数",width:"100"}})],1)}),[],!1,null,null,null);e.default=o.exports}}]);