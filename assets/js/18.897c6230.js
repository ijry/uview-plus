(window.webpackJsonp=window.webpackJsonp||[]).push([[18,193],{414:function(t,e,n){"use strict";n.d(e,"c",(function(){return r})),n.d(e,"e",(function(){return o})),n.d(e,"f",(function(){return c})),n.d(e,"g",(function(){return l})),n.d(e,"a",(function(){return p})),n.d(e,"d",(function(){return f})),n.d(e,"i",(function(){return d})),n.d(e,"j",(function(){return h})),n.d(e,"b",(function(){return g})),n.d(e,"h",(function(){return m}));n(191),n(12),n(21),n(112),n(67);const r=/#.*$/,i=/\.(md|html)$/,a=/\/$/,s=/^[a-z]+:/i;function u(t){return decodeURI(t).replace(r,"").replace(i,"")}function o(t){return s.test(t)}function c(t){return/^mailto:/.test(t)}function l(t){return/^tel:/.test(t)}function p(t){if(o(t))return t;const e=t.match(r),n=e?e[0]:"",i=u(t);return a.test(i)?t:i+".html"+n}function f(t,e){const n=decodeURIComponent(t.hash),i=function(t){const e=t.match(r);if(e)return e[0]}(e);if(i&&n!==i)return!1;return u(t.path)===u(e)}function d(t,e,n){if(o(e))return{type:"external",path:e};n&&(e=function(t,e,n){const r=t.charAt(0);if("/"===r)return t;if("?"===r||"#"===r)return e+t;const i=e.split("/");n&&i[i.length-1]||i.pop();const a=t.replace(/^\//,"").split("/");for(let t=0;t<a.length;t++){const e=a[t];".."===e?i.pop():"."!==e&&i.push(e)}""!==i[0]&&i.unshift("");return i.join("/")}(e,n));const r=u(e);for(let e=0;e<t.length;e++)if(u(t[e].regularPath)===r)return Object.assign({},t[e],{type:"page",path:p(t[e].path)});return console.error(`[vuepress] No matching page found for sidebar item "${e}"`),{}}function h(t,e,n,r){const{pages:i,themeConfig:a}=n,s=r&&a.locales&&a.locales[r]||a;if("auto"===(t.frontmatter.sidebar||s.sidebar||a.sidebar))return b(t);const u=s.sidebar||a.sidebar;if(u){const{base:n,config:r}=function(t,e){if(Array.isArray(e))return{base:"/",config:e};for(const r in e)if(0===(n=t,/(\.html|\/)$/.test(n)?n:n+"/").indexOf(encodeURI(r)))return{base:r,config:e[r]};var n;return{}}(e,u);return"auto"===r?b(t):r?r.map(t=>function t(e,n,r,i=1){if("string"==typeof e)return d(n,e,r);if(Array.isArray(e))return Object.assign(d(n,e[0],r),{title:e[1]});{const a=e.children||[];return 0===a.length&&e.path?Object.assign(d(n,e.path,r),{title:e.title}):{type:"group",path:e.path,title:e.title,sidebarDepth:e.sidebarDepth,initialOpenGroupIndex:e.initialOpenGroupIndex,children:a.map(e=>t(e,n,r,i+1)),collapsable:!1!==e.collapsable}}}(t,i,n)):[]}return[]}function b(t){const e=g(t.headers||[]);return[{type:"group",collapsable:!1,title:t.title,path:null,children:e.map(e=>({type:"auto",title:e.title,basePath:t.path,path:t.path+"#"+e.slug,children:e.children||[]}))}]}function g(t){let e;return(t=t.map(t=>Object.assign({},t))).forEach(t=>{2===t.level?e=t:e&&(e.children||(e.children=[])).push(t)}),t.filter(t=>2===t.level)}function m(t){return Object.assign(t,{type:t.items&&t.items.length?"links":"link"})}},425:function(t,e,n){},439:function(t,e,n){"use strict";n(440)},440:function(t,e,n){"use strict";var r=n(13),i=n(68),a=n(9),s=n(2),u=n(36);r({target:"Iterator",proto:!0,real:!0},{find:function(t){s(this),a(t);var e=u(this),n=0;return i(e,(function(e,r){if(t(e,n++))return r(e)}),{IS_RECORD:!0,INTERRUPTED:!0}).result}})},441:function(t,e,n){"use strict";n(425)},446:function(t,e,n){"use strict";n.r(e);n(12),n(439),n(67),n(113);var r=n(414);function i(t,e,n,r,i){const a={props:{to:e,activeClass:"",exactActiveClass:""},class:{active:r,"sidebar-link":!0}};return i>2&&(a.style={"padding-left":i+"rem"}),t("RouterLink",a,n)}function a(t,e,n,s,u,o=1){return!e||o>u?null:t("ul",{class:"sidebar-sub-headers"},e.map(e=>{const c=Object(r.d)(s,n+"#"+e.slug);return t("li",{class:"sidebar-sub-header"},[i(t,n+"#"+e.slug,e.title,c,e.level-1),a(t,e.children,n,s,u,o+1)])}))}var s={functional:!0,props:["item","sidebarDepth"],render(t,{parent:{$page:e,$site:n,$route:s,$themeConfig:u,$themeLocaleConfig:o},props:{item:c,sidebarDepth:l}}){const p=Object(r.d)(s,c.path),f="auto"===c.type?p||c.children.some(t=>Object(r.d)(s,c.basePath+"#"+t.slug)):p,d="external"===c.type?function(t,e,n){return t("a",{attrs:{href:e,target:"_blank",rel:"noopener noreferrer"},class:{"sidebar-link":!0}},[n,t("OutboundLink")])}(t,c.path,c.title||c.path):i(t,c.path,c.title||c.path,f),h=[e.frontmatter.sidebarDepth,l,o.sidebarDepth,u.sidebarDepth,1].find(t=>void 0!==t),b=o.displayAllHeaders||u.displayAllHeaders;if("auto"===c.type)return[d,a(t,c.children,c.basePath,s,h)];if((f||b)&&c.headers&&!r.c.test(c.path)){return[d,a(t,Object(r.b)(c.headers),c.path,s,h)]}return d}},u=(n(441),n(18)),o=Object(u.a)(s,void 0,void 0,!1,null,null,null);e.default=o.exports}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZXByZXNzL3RoZW1lLWRlZmF1bHQvdXRpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZXByZXNzL2NvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lc25leHQuaXRlcmF0b3IuZmluZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQHZ1ZXByZXNzL2NvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5pdGVyYXRvci5maW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AdnVlcHJlc3MvdGhlbWUtZGVmYXVsdC9jb21wb25lbnRzL1NpZGViYXJMaW5rLnZ1ZT83NmYwIiwid2VicGFjazovLy9ub2RlX21vZHVsZXMvQHZ1ZXByZXNzL3RoZW1lLWRlZmF1bHQvY29tcG9uZW50cy9TaWRlYmFyTGluay52dWUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0B2dWVwcmVzcy90aGVtZS1kZWZhdWx0L2NvbXBvbmVudHMvU2lkZWJhckxpbmsudnVlPzM0MGUiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0B2dWVwcmVzcy90aGVtZS1kZWZhdWx0L2NvbXBvbmVudHMvU2lkZWJhckxpbmsudnVlIl0sIm5hbWVzIjpbImhhc2hSRSIsImV4dFJFIiwiZW5kaW5nU2xhc2hSRSIsIm91dGJvdW5kUkUiLCJub3JtYWxpemUiLCJwYXRoIiwiZGVjb2RlVVJJIiwicmVwbGFjZSIsImlzRXh0ZXJuYWwiLCJ0ZXN0IiwiaXNNYWlsdG8iLCJpc1RlbCIsImVuc3VyZUV4dCIsImhhc2hNYXRjaCIsIm1hdGNoIiwiaGFzaCIsIm5vcm1hbGl6ZWQiLCJpc0FjdGl2ZSIsInJvdXRlIiwicm91dGVIYXNoIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwibGlua0hhc2giLCJnZXRIYXNoIiwicmVzb2x2ZVBhZ2UiLCJwYWdlcyIsInJhd1BhdGgiLCJiYXNlIiwidHlwZSIsInJlbGF0aXZlIiwiYXBwZW5kIiwiZmlyc3RDaGFyIiwiY2hhckF0Iiwic3RhY2siLCJzcGxpdCIsImxlbmd0aCIsInBvcCIsInNlZ21lbnRzIiwiaSIsInNlZ21lbnQiLCJwdXNoIiwidW5zaGlmdCIsImpvaW4iLCJyZXNvbHZlUGF0aCIsInJlZ3VsYXJQYXRoIiwiT2JqZWN0IiwiYXNzaWduIiwiY29uc29sZSIsImVycm9yIiwicmVzb2x2ZVNpZGViYXJJdGVtcyIsInBhZ2UiLCJzaXRlIiwibG9jYWxlUGF0aCIsInRoZW1lQ29uZmlnIiwibG9jYWxlQ29uZmlnIiwibG9jYWxlcyIsImZyb250bWF0dGVyIiwic2lkZWJhciIsInJlc29sdmVIZWFkZXJzIiwic2lkZWJhckNvbmZpZyIsImNvbmZpZyIsIkFycmF5IiwiaXNBcnJheSIsImluZGV4T2YiLCJlbmNvZGVVUkkiLCJyZXNvbHZlTWF0Y2hpbmdDb25maWciLCJtYXAiLCJpdGVtIiwicmVzb2x2ZUl0ZW0iLCJncm91cERlcHRoIiwidGl0bGUiLCJjaGlsZHJlbiIsInNpZGViYXJEZXB0aCIsImluaXRpYWxPcGVuR3JvdXBJbmRleCIsImNoaWxkIiwiY29sbGFwc2FibGUiLCJoZWFkZXJzIiwiZ3JvdXBIZWFkZXJzIiwiaCIsImJhc2VQYXRoIiwic2x1ZyIsImxhc3RIMiIsImZvckVhY2giLCJsZXZlbCIsImZpbHRlciIsInJlc29sdmVOYXZMaW5rSXRlbSIsImxpbmtJdGVtIiwiaXRlbXMiLCIkIiwiaXRlcmF0ZSIsImFDYWxsYWJsZSIsImFuT2JqZWN0IiwiZ2V0SXRlcmF0b3JEaXJlY3QiLCJ0YXJnZXQiLCJwcm90byIsInJlYWwiLCJmaW5kIiwicHJlZGljYXRlIiwidGhpcyIsInJlY29yZCIsImNvdW50ZXIiLCJ2YWx1ZSIsInN0b3AiLCJJU19SRUNPUkQiLCJJTlRFUlJVUFRFRCIsInJlc3VsdCIsInJlbmRlckxpbmsiLCJ0byIsInRleHQiLCJhY3RpdmUiLCJjb21wb25lbnQiLCJwcm9wcyIsImFjdGl2ZUNsYXNzIiwiZXhhY3RBY3RpdmVDbGFzcyIsImNsYXNzIiwic3R5bGUiLCJyZW5kZXJDaGlsZHJlbiIsIm1heERlcHRoIiwiZGVwdGgiLCJjIiwiZnVuY3Rpb25hbCIsInJlbmRlciIsInBhcmVudCIsIiRwYWdlIiwiJHNpdGUiLCIkcm91dGUiLCIkdGhlbWVDb25maWciLCIkdGhlbWVMb2NhbGVDb25maWciLCJzZWxmQWN0aXZlIiwic29tZSIsImxpbmsiLCJhdHRycyIsImhyZWYiLCJyZWwiLCJyZW5kZXJFeHRlcm5hbCIsInVuZGVmaW5lZCIsImRpc3BsYXlBbGxIZWFkZXJzIiwic3RhdGljUmVuZGVyRm5zIl0sIm1hcHBpbmdzIjoibWRBQU8sTUFBTUEsRUFBUyxPQUNUQyxFQUFRLGVBQ1JDLEVBQWdCLE1BQ2hCQyxFQUFhLFlBRW5CLFNBQVNDLEVBQVdDLEdBQ3pCLE9BQU9DLFVBQVVELEdBQ2RFLFFBQVFQLEVBQVEsSUFDaEJPLFFBQVFOLEVBQU8sSUFVYixTQUFTTyxFQUFZSCxHQUMxQixPQUFPRixFQUFXTSxLQUFLSixHQUdsQixTQUFTSyxFQUFVTCxHQUN4QixNQUFPLFdBQVdJLEtBQUtKLEdBR2xCLFNBQVNNLEVBQU9OLEdBQ3JCLE1BQU8sUUFBUUksS0FBS0osR0FHZixTQUFTTyxFQUFXUCxHQUN6QixHQUFJRyxFQUFXSCxHQUNiLE9BQU9BLEVBRVQsTUFBTVEsRUFBWVIsRUFBS1MsTUFBTWQsR0FDdkJlLEVBQU9GLEVBQVlBLEVBQVUsR0FBSyxHQUNsQ0csRUFBYVosRUFBVUMsR0FFN0IsT0FBSUgsRUFBY08sS0FBS08sR0FDZFgsRUFFRlcsRUFBYSxRQUFVRCxFQUd6QixTQUFTRSxFQUFVQyxFQUFPYixHQUMvQixNQUFNYyxFQUFZQyxtQkFBbUJGLEVBQU1ILE1BQ3JDTSxFQW5DRCxTQUFrQmhCLEdBQ3ZCLE1BQU1TLEVBQVFULEVBQUtTLE1BQU1kLEdBQ3pCLEdBQUljLEVBQ0YsT0FBT0EsRUFBTSxHQWdDRVEsQ0FBUWpCLEdBQ3pCLEdBQUlnQixHQUFZRixJQUFjRSxFQUM1QixPQUFPLEVBSVQs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OTdjNjIzMC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBoYXNoUkUgPSAvIy4qJC9cbmV4cG9ydCBjb25zdCBleHRSRSA9IC9cXC4obWR8aHRtbCkkL1xuZXhwb3J0IGNvbnN0IGVuZGluZ1NsYXNoUkUgPSAvXFwvJC9cbmV4cG9ydCBjb25zdCBvdXRib3VuZFJFID0gL15bYS16XSs6L2lcblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZSAocGF0aCkge1xuICByZXR1cm4gZGVjb2RlVVJJKHBhdGgpXG4gICAgLnJlcGxhY2UoaGFzaFJFLCAnJylcbiAgICAucmVwbGFjZShleHRSRSwgJycpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIYXNoIChwYXRoKSB7XG4gIGNvbnN0IG1hdGNoID0gcGF0aC5tYXRjaChoYXNoUkUpXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBtYXRjaFswXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0V4dGVybmFsIChwYXRoKSB7XG4gIHJldHVybiBvdXRib3VuZFJFLnRlc3QocGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTWFpbHRvIChwYXRoKSB7XG4gIHJldHVybiAvXm1haWx0bzovLnRlc3QocGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVsIChwYXRoKSB7XG4gIHJldHVybiAvXnRlbDovLnRlc3QocGF0aClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUV4dCAocGF0aCkge1xuICBpZiAoaXNFeHRlcm5hbChwYXRoKSkge1xuICAgIHJldHVybiBwYXRoXG4gIH1cbiAgY29uc3QgaGFzaE1hdGNoID0gcGF0aC5tYXRjaChoYXNoUkUpXG4gIGNvbnN0IGhhc2ggPSBoYXNoTWF0Y2ggPyBoYXNoTWF0Y2hbMF0gOiAnJ1xuICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHBhdGgpXG5cbiAgaWYgKGVuZGluZ1NsYXNoUkUudGVzdChub3JtYWxpemVkKSkge1xuICAgIHJldHVybiBwYXRoXG4gIH1cbiAgcmV0dXJuIG5vcm1hbGl6ZWQgKyAnLmh0bWwnICsgaGFzaFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBY3RpdmUgKHJvdXRlLCBwYXRoKSB7XG4gIGNvbnN0IHJvdXRlSGFzaCA9IGRlY29kZVVSSUNvbXBvbmVudChyb3V0ZS5oYXNoKVxuICBjb25zdCBsaW5rSGFzaCA9IGdldEhhc2gocGF0aClcbiAgaWYgKGxpbmtIYXNoICYmIHJvdXRlSGFzaCAhPT0gbGlua0hhc2gpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCByb3V0ZVBhdGggPSBub3JtYWxpemUocm91dGUucGF0aClcbiAgY29uc3QgcGFnZVBhdGggPSBub3JtYWxpemUocGF0aClcbiAgcmV0dXJuIHJvdXRlUGF0aCA9PT0gcGFnZVBhdGhcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYWdlIChwYWdlcywgcmF3UGF0aCwgYmFzZSkge1xuICBpZiAoaXNFeHRlcm5hbChyYXdQYXRoKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZXh0ZXJuYWwnLFxuICAgICAgcGF0aDogcmF3UGF0aFxuICAgIH1cbiAgfVxuICBpZiAoYmFzZSkge1xuICAgIHJhd1BhdGggPSByZXNvbHZlUGF0aChyYXdQYXRoLCBiYXNlKVxuICB9XG4gIGNvbnN0IHBhdGggPSBub3JtYWxpemUocmF3UGF0aClcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChub3JtYWxpemUocGFnZXNbaV0ucmVndWxhclBhdGgpID09PSBwYXRoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcGFnZXNbaV0sIHtcbiAgICAgICAgdHlwZTogJ3BhZ2UnLFxuICAgICAgICBwYXRoOiBlbnN1cmVFeHQocGFnZXNbaV0ucGF0aClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGNvbnNvbGUuZXJyb3IoYFt2dWVwcmVzc10gTm8gbWF0Y2hpbmcgcGFnZSBmb3VuZCBmb3Igc2lkZWJhciBpdGVtIFwiJHtyYXdQYXRofVwiYClcbiAgcmV0dXJuIHt9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVQYXRoIChyZWxhdGl2ZSwgYmFzZSwgYXBwZW5kKSB7XG4gIGNvbnN0IGZpcnN0Q2hhciA9IHJlbGF0aXZlLmNoYXJBdCgwKVxuICBpZiAoZmlyc3RDaGFyID09PSAnLycpIHtcbiAgICByZXR1cm4gcmVsYXRpdmVcbiAgfVxuXG4gIGlmIChmaXJzdENoYXIgPT09ICc/JyB8fCBmaXJzdENoYXIgPT09ICcjJykge1xuICAgIHJldHVybiBiYXNlICsgcmVsYXRpdmVcbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gYmFzZS5zcGxpdCgnLycpXG5cbiAgLy8gcmVtb3ZlIHRyYWlsaW5nIHNlZ21lbnQgaWY6XG4gIC8vIC0gbm90IGFwcGVuZGluZ1xuICAvLyAtIGFwcGVuZGluZyB0byB0cmFpbGluZyBzbGFzaCAobGFzdCBzZWdtZW50IGlzIGVtcHR5KVxuICBpZiAoIWFwcGVuZCB8fCAhc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0pIHtcbiAgICBzdGFjay5wb3AoKVxuICB9XG5cbiAgLy8gcmVzb2x2ZSByZWxhdGl2ZSBwYXRoXG4gIGNvbnN0IHNlZ21lbnRzID0gcmVsYXRpdmUucmVwbGFjZSgvXlxcLy8sICcnKS5zcGxpdCgnLycpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VnbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV1cbiAgICBpZiAoc2VnbWVudCA9PT0gJy4uJykge1xuICAgICAgc3RhY2sucG9wKClcbiAgICB9IGVsc2UgaWYgKHNlZ21lbnQgIT09ICcuJykge1xuICAgICAgc3RhY2sucHVzaChzZWdtZW50KVxuICAgIH1cbiAgfVxuXG4gIC8vIGVuc3VyZSBsZWFkaW5nIHNsYXNoXG4gIGlmIChzdGFja1swXSAhPT0gJycpIHtcbiAgICBzdGFjay51bnNoaWZ0KCcnKVxuICB9XG5cbiAgcmV0dXJuIHN0YWNrLmpvaW4oJy8nKVxufVxuXG4vKipcbiAqIEBwYXJhbSB7IFBhZ2UgfSBwYWdlXG4gKiBAcGFyYW0geyBzdHJpbmcgfSByZWd1bGFyUGF0aFxuICogQHBhcmFtIHsgU2l0ZURhdGEgfSBzaXRlXG4gKiBAcGFyYW0geyBzdHJpbmcgfSBsb2NhbGVQYXRoXG4gKiBAcmV0dXJucyB7IFNpZGViYXJHcm91cCB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlU2lkZWJhckl0ZW1zIChwYWdlLCByZWd1bGFyUGF0aCwgc2l0ZSwgbG9jYWxlUGF0aCkge1xuICBjb25zdCB7IHBhZ2VzLCB0aGVtZUNvbmZpZyB9ID0gc2l0ZVxuXG4gIGNvbnN0IGxvY2FsZUNvbmZpZyA9IGxvY2FsZVBhdGggJiYgdGhlbWVDb25maWcubG9jYWxlc1xuICAgID8gdGhlbWVDb25maWcubG9jYWxlc1tsb2NhbGVQYXRoXSB8fCB0aGVtZUNvbmZpZ1xuICAgIDogdGhlbWVDb25maWdcblxuICBjb25zdCBwYWdlU2lkZWJhckNvbmZpZyA9IHBhZ2UuZnJvbnRtYXR0ZXIuc2lkZWJhciB8fCBsb2NhbGVDb25maWcuc2lkZWJhciB8fCB0aGVtZUNvbmZpZy5zaWRlYmFyXG4gIGlmIChwYWdlU2lkZWJhckNvbmZpZyA9PT0gJ2F1dG8nKSB7XG4gICAgcmV0dXJuIHJlc29sdmVIZWFkZXJzKHBhZ2UpXG4gIH1cblxuICBjb25zdCBzaWRlYmFyQ29uZmlnID0gbG9jYWxlQ29uZmlnLnNpZGViYXIgfHwgdGhlbWVDb25maWcuc2lkZWJhclxuICBpZiAoIXNpZGViYXJDb25maWcpIHtcbiAgICByZXR1cm4gW11cbiAgfSBlbHNlIHtcbiAgICBjb25zdCB7IGJhc2UsIGNvbmZpZyB9ID0gcmVzb2x2ZU1hdGNoaW5nQ29uZmlnKHJlZ3VsYXJQYXRoLCBzaWRlYmFyQ29uZmlnKVxuICAgIGlmIChjb25maWcgPT09ICdhdXRvJykge1xuICAgICAgcmV0dXJuIHJlc29sdmVIZWFkZXJzKHBhZ2UpXG4gICAgfVxuICAgIHJldHVybiBjb25maWdcbiAgICAgID8gY29uZmlnLm1hcChpdGVtID0+IHJlc29sdmVJdGVtKGl0ZW0sIHBhZ2VzLCBiYXNlKSlcbiAgICAgIDogW11cbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7IFBhZ2UgfSBwYWdlXG4gKiBAcmV0dXJucyB7IFNpZGViYXJHcm91cCB9XG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVIZWFkZXJzIChwYWdlKSB7XG4gIGNvbnN0IGhlYWRlcnMgPSBncm91cEhlYWRlcnMocGFnZS5oZWFkZXJzIHx8IFtdKVxuICByZXR1cm4gW3tcbiAgICB0eXBlOiAnZ3JvdXAnLFxuICAgIGNvbGxhcHNhYmxlOiBmYWxzZSxcbiAgICB0aXRsZTogcGFnZS50aXRsZSxcbiAgICBwYXRoOiBudWxsLFxuICAgIGNoaWxkcmVuOiBoZWFkZXJzLm1hcChoID0+ICh7XG4gICAgICB0eXBlOiAnYXV0bycsXG4gICAgICB0aXRsZTogaC50aXRsZSxcbiAgICAgIGJhc2VQYXRoOiBwYWdlLnBhdGgsXG4gICAgICBwYXRoOiBwYWdlLnBhdGggKyAnIycgKyBoLnNsdWcsXG4gICAgICBjaGlsZHJlbjogaC5jaGlsZHJlbiB8fCBbXVxuICAgIH0pKVxuICB9XVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBIZWFkZXJzIChoZWFkZXJzKSB7XG4gIC8vIGdyb3VwIGgzcyB1bmRlciBoMlxuICBoZWFkZXJzID0gaGVhZGVycy5tYXAoaCA9PiBPYmplY3QuYXNzaWduKHt9LCBoKSlcbiAgbGV0IGxhc3RIMlxuICBoZWFkZXJzLmZvckVhY2goaCA9PiB7XG4gICAgaWYgKGgubGV2ZWwgPT09IDIpIHtcbiAgICAgIGxhc3RIMiA9IGhcbiAgICB9IGVsc2UgaWYgKGxhc3RIMikge1xuICAgICAgKGxhc3RIMi5jaGlsZHJlbiB8fCAobGFzdEgyLmNoaWxkcmVuID0gW10pKS5wdXNoKGgpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVycy5maWx0ZXIoaCA9PiBoLmxldmVsID09PSAyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZU5hdkxpbmtJdGVtIChsaW5rSXRlbSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihsaW5rSXRlbSwge1xuICAgIHR5cGU6IGxpbmtJdGVtLml0ZW1zICYmIGxpbmtJdGVtLml0ZW1zLmxlbmd0aCA/ICdsaW5rcycgOiAnbGluaydcbiAgfSlcbn1cblxuLyoqXG4gKiBAcGFyYW0geyBSb3V0ZSB9IHJvdXRlXG4gKiBAcGFyYW0geyBBcnJheTxzdHJpbmd8c3RyaW5nW10+IHwgQXJyYXk8U2lkZWJhckdyb3VwPiB8IFtsaW5rOiBzdHJpbmddOiBTaWRlYmFyQ29uZmlnIH0gY29uZmlnXG4gKiBAcmV0dXJucyB7IGJhc2U6IHN0cmluZywgY29uZmlnOiBTaWRlYmFyQ29uZmlnIH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVNYXRjaGluZ0NvbmZpZyAocmVndWxhclBhdGgsIGNvbmZpZykge1xuICBpZiAoQXJyYXkuaXNBcnJheShjb25maWcpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhc2U6ICcvJyxcbiAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgfVxuICB9XG4gIGZvciAoY29uc3QgYmFzZSBpbiBjb25maWcpIHtcbiAgICBpZiAoZW5zdXJlRW5kaW5nU2xhc2gocmVndWxhclBhdGgpLmluZGV4T2YoZW5jb2RlVVJJKGJhc2UpKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmFzZSxcbiAgICAgICAgY29uZmlnOiBjb25maWdbYmFzZV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt9XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUVuZGluZ1NsYXNoIChwYXRoKSB7XG4gIHJldHVybiAvKFxcLmh0bWx8XFwvKSQvLnRlc3QocGF0aClcbiAgICA/IHBhdGhcbiAgICA6IHBhdGggKyAnLydcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUl0ZW0gKGl0ZW0sIHBhZ2VzLCBiYXNlLCBncm91cERlcHRoID0gMSkge1xuICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJlc29sdmVQYWdlKHBhZ2VzLCBpdGVtLCBiYXNlKVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihyZXNvbHZlUGFnZShwYWdlcywgaXRlbVswXSwgYmFzZSksIHtcbiAgICAgIHRpdGxlOiBpdGVtWzFdXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IGl0ZW0uY2hpbGRyZW4gfHwgW11cbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAwICYmIGl0ZW0ucGF0aCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocmVzb2x2ZVBhZ2UocGFnZXMsIGl0ZW0ucGF0aCwgYmFzZSksIHtcbiAgICAgICAgdGl0bGU6IGl0ZW0udGl0bGVcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgcGF0aDogaXRlbS5wYXRoLFxuICAgICAgdGl0bGU6IGl0ZW0udGl0bGUsXG4gICAgICBzaWRlYmFyRGVwdGg6IGl0ZW0uc2lkZWJhckRlcHRoLFxuICAgICAgaW5pdGlhbE9wZW5Hcm91cEluZGV4OiBpdGVtLmluaXRpYWxPcGVuR3JvdXBJbmRleCxcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbi5tYXAoY2hpbGQgPT4gcmVzb2x2ZUl0ZW0oY2hpbGQsIHBhZ2VzLCBiYXNlLCBncm91cERlcHRoICsgMSkpLFxuICAgICAgY29sbGFwc2FibGU6IGl0ZW0uY29sbGFwc2FibGUgIT09IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG4vLyBUT0RPOiBSZW1vdmUgZnJvbSBgY29yZS1qc0A0YFxucmVxdWlyZSgnLi4vbW9kdWxlcy9lcy5pdGVyYXRvci5maW5kJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpdGVyYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdGUnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGdldEl0ZXJhdG9yRGlyZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1kaXJlY3QnKTtcblxuLy8gYEl0ZXJhdG9yLnByb3RvdHlwZS5maW5kYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaXRlcmF0b3IucHJvdG90eXBlLmZpbmRcbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgZmluZDogZnVuY3Rpb24gZmluZChwcmVkaWNhdGUpIHtcbiAgICBhbk9iamVjdCh0aGlzKTtcbiAgICBhQ2FsbGFibGUocHJlZGljYXRlKTtcbiAgICB2YXIgcmVjb3JkID0gZ2V0SXRlcmF0b3JEaXJlY3QodGhpcyk7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHJldHVybiBpdGVyYXRlKHJlY29yZCwgZnVuY3Rpb24gKHZhbHVlLCBzdG9wKSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBjb3VudGVyKyspKSByZXR1cm4gc3RvcCh2YWx1ZSk7XG4gICAgfSwgeyBJU19SRUNPUkQ6IHRydWUsIElOVEVSUlVQVEVEOiB0cnVlIH0pLnJlc3VsdDtcbiAgfVxufSk7XG4iLCJleHBvcnQgKiBmcm9tIFwiLSEuLi8uLi8uLi9taW5pLWNzcy1leHRyYWN0LXBsdWdpbi9kaXN0L2xvYWRlci5qcyEuLi8uLi8uLi9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9yZWYtLTEzLW9uZU9mLTEtMSEuLi8uLi8uLi92dWUtbG9hZGVyL2xpYi9sb2FkZXJzL3N0eWxlUG9zdExvYWRlci5qcyEuLi8uLi8uLi9wb3N0Y3NzLWxvYWRlci9zcmMvaW5kZXguanM/P3JlZi0tMTMtb25lT2YtMS0yIS4uLy4uLy4uL3N0eWx1cy1sb2FkZXIvaW5kZXguanM/P3JlZi0tMTMtb25lT2YtMS0zIS4uLy4uLy4uL3Z1ZS1sb2FkZXIvbGliL2luZGV4LmpzPz92dWUtbG9hZGVyLW9wdGlvbnMhLi9TaWRlYmFyTGluay52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD03MmMwZDU0MiZwcm9kJmxhbmc9c3R5bHVzXCIiLCI8c2NyaXB0PlxuaW1wb3J0IHsgaXNBY3RpdmUsIGhhc2hSRSwgZ3JvdXBIZWFkZXJzIH0gZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQge1xuICBmdW5jdGlvbmFsOiB0cnVlLFxuXG4gIHByb3BzOiBbJ2l0ZW0nLCAnc2lkZWJhckRlcHRoJ10sXG5cbiAgcmVuZGVyIChoLFxuICAgIHtcbiAgICAgIHBhcmVudDoge1xuICAgICAgICAkcGFnZSxcbiAgICAgICAgJHNpdGUsXG4gICAgICAgICRyb3V0ZSxcbiAgICAgICAgJHRoZW1lQ29uZmlnLFxuICAgICAgICAkdGhlbWVMb2NhbGVDb25maWdcbiAgICAgIH0sXG4gICAgICBwcm9wczoge1xuICAgICAgICBpdGVtLFxuICAgICAgICBzaWRlYmFyRGVwdGhcbiAgICAgIH1cbiAgICB9KSB7XG4gICAgLy8gdXNlIGN1c3RvbSBhY3RpdmUgY2xhc3MgbWF0Y2hpbmcgbG9naWNcbiAgICAvLyBkdWUgdG8gZWRnZSBjYXNlIG9mIHBhdGhzIGVuZGluZyB3aXRoIC8gKyBoYXNoXG4gICAgY29uc3Qgc2VsZkFjdGl2ZSA9IGlzQWN0aXZlKCRyb3V0ZSwgaXRlbS5wYXRoKVxuICAgIC8vIGZvciBzaWRlYmFyOiBhdXRvIHBhZ2VzLCBhIGhhc2ggbGluayBzaG91bGQgYmUgYWN0aXZlIGlmIG9uZSBvZiBpdHMgY2hpbGRcbiAgICAvLyBtYXRjaGVzXG4gICAgY29uc3QgYWN0aXZlID0gaXRlbS50eXBlID09PSAnYXV0bydcbiAgICAgID8gc2VsZkFjdGl2ZSB8fCBpdGVtLmNoaWxkcmVuLnNvbWUoYyA9PiBpc0FjdGl2ZSgkcm91dGUsIGl0ZW0uYmFzZVBhdGggKyAnIycgKyBjLnNsdWcpKVxuICAgICAgOiBzZWxmQWN0aXZlXG4gICAgY29uc3QgbGluayA9IGl0ZW0udHlwZSA9PT0gJ2V4dGVybmFsJ1xuICAgICAgPyByZW5kZXJFeHRlcm5hbChoLCBpdGVtLnBhdGgsIGl0ZW0udGl0bGUgfHwgaXRlbS5wYXRoKVxuICAgICAgOiByZW5kZXJMaW5rKGgsIGl0ZW0ucGF0aCwgaXRlbS50aXRsZSB8fCBpdGVtLnBhdGgsIGFjdGl2ZSlcblxuICAgIGNvbnN0IG1heERlcHRoID0gW1xuICAgICAgJHBhZ2UuZnJvbnRtYXR0ZXIuc2lkZWJhckRlcHRoLFxuICAgICAgc2lkZWJhckRlcHRoLFxuICAgICAgJHRoZW1lTG9jYWxlQ29uZmlnLnNpZGViYXJEZXB0aCxcbiAgICAgICR0aGVtZUNvbmZpZy5zaWRlYmFyRGVwdGgsXG4gICAgICAxXG4gICAgXS5maW5kKGRlcHRoID0+IGRlcHRoICE9PSB1bmRlZmluZWQpXG5cbiAgICBjb25zdCBkaXNwbGF5QWxsSGVhZGVycyA9ICR0aGVtZUxvY2FsZUNvbmZpZy5kaXNwbGF5QWxsSGVhZGVyc1xuICAgICAgfHwgJHRoZW1lQ29uZmlnLmRpc3BsYXlBbGxIZWFkZXJzXG5cbiAgICBpZiAoaXRlbS50eXBlID09PSAnYXV0bycpIHtcbiAgICAgIHJldHVybiBbbGluaywgcmVuZGVyQ2hpbGRyZW4oaCwgaXRlbS5jaGlsZHJlbiwgaXRlbS5iYXNlUGF0aCwgJHJvdXRlLCBtYXhEZXB0aCldXG4gICAgfSBlbHNlIGlmICgoYWN0aXZlIHx8IGRpc3BsYXlBbGxIZWFkZXJzKSAmJiBpdGVtLmhlYWRlcnMgJiYgIWhhc2hSRS50ZXN0KGl0ZW0ucGF0aCkpIHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gZ3JvdXBIZWFkZXJzKGl0ZW0uaGVhZGVycylcbiAgICAgIHJldHVybiBbbGluaywgcmVuZGVyQ2hpbGRyZW4oaCwgY2hpbGRyZW4sIGl0ZW0ucGF0aCwgJHJvdXRlLCBtYXhEZXB0aCldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsaW5rXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlckxpbmsgKGgsIHRvLCB0ZXh0LCBhY3RpdmUsIGxldmVsKSB7XG4gIGNvbnN0IGNvbXBvbmVudCA9IHtcbiAgICBwcm9wczoge1xuICAgICAgdG8sXG4gICAgICBhY3RpdmVDbGFzczogJycsXG4gICAgICBleGFjdEFjdGl2ZUNsYXNzOiAnJ1xuICAgIH0sXG4gICAgY2xhc3M6IHtcbiAgICAgIGFjdGl2ZSxcbiAgICAgICdzaWRlYmFyLWxpbmsnOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgaWYgKGxldmVsID4gMikge1xuICAgIGNvbXBvbmVudC5zdHlsZSA9IHtcbiAgICAgICdwYWRkaW5nLWxlZnQnOiBsZXZlbCArICdyZW0nXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGgoJ1JvdXRlckxpbmsnLCBjb21wb25lbnQsIHRleHQpXG59XG5cbmZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuIChoLCBjaGlsZHJlbiwgcGF0aCwgcm91dGUsIG1heERlcHRoLCBkZXB0aCA9IDEpIHtcbiAgaWYgKCFjaGlsZHJlbiB8fCBkZXB0aCA+IG1heERlcHRoKSByZXR1cm4gbnVsbFxuICByZXR1cm4gaCgndWwnLCB7IGNsYXNzOiAnc2lkZWJhci1zdWItaGVhZGVycycgfSwgY2hpbGRyZW4ubWFwKGMgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZSA9IGlzQWN0aXZlKHJvdXRlLCBwYXRoICsgJyMnICsgYy5zbHVnKVxuICAgIHJldHVybiBoKCdsaScsIHsgY2xhc3M6ICdzaWRlYmFyLXN1Yi1oZWFkZXInIH0sIFtcbiAgICAgIHJlbmRlckxpbmsoaCwgcGF0aCArICcjJyArIGMuc2x1ZywgYy50aXRsZSwgYWN0aXZlLCBjLmxldmVsIC0gMSksXG4gICAgICByZW5kZXJDaGlsZHJlbihoLCBjLmNoaWxkcmVuLCBwYXRoLCByb3V0ZSwgbWF4RGVwdGgsIGRlcHRoICsgMSlcbiAgICBdKVxuICB9KSlcbn1cblxuZnVuY3Rpb24gcmVuZGVyRXh0ZXJuYWwgKGgsIHRvLCB0ZXh0KSB7XG4gIHJldHVybiBoKCdhJywge1xuICAgIGF0dHJzOiB7XG4gICAgICBocmVmOiB0byxcbiAgICAgIHRhcmdldDogJ19ibGFuaycsXG4gICAgICByZWw6ICdub29wZW5lciBub3JlZmVycmVyJ1xuICAgIH0sXG4gICAgY2xhc3M6IHtcbiAgICAgICdzaWRlYmFyLWxpbmsnOiB0cnVlXG4gICAgfVxuICB9LCBbdGV4dCwgaCgnT3V0Ym91bmRMaW5rJyldKVxufVxuPC9zY3JpcHQ+XG5cbjxzdHlsZSBsYW5nPVwic3R5bHVzXCI+XG4uc2lkZWJhciAuc2lkZWJhci1zdWItaGVhZGVyc1xuICBwYWRkaW5nLWxlZnQgMXJlbVxuICBmb250LXNpemUgMC45NWVtXG5cbmEuc2lkZWJhci1saW5rXG4gIGZvbnQtc2l6ZSAxZW1cbiAgZm9udC13ZWlnaHQgNDAwXG4gIGRpc3BsYXkgaW5saW5lLWJsb2NrXG4gIGNvbG9yICR0ZXh0Q29sb3JcbiAgYm9yZGVyLWxlZnQgMC4yNXJlbSBzb2xpZCB0cmFuc3BhcmVudFxuICBwYWRkaW5nIDAuMzVyZW0gMXJlbSAwLjM1cmVtIDEuMjVyZW1cbiAgbGluZS1oZWlnaHQgMS40XG4gIHdpZHRoOiAxMDAlXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3hcbiAgJjpob3ZlclxuICAgIGNvbG9yICRhY2NlbnRDb2xvclxuICAmLmFjdGl2ZVxuICAgIGZvbnQtd2VpZ2h0IDYwMFxuICAgIGNvbG9yICRhY2NlbnRDb2xvclxuICAgIGJvcmRlci1sZWZ0LWNvbG9yICRhY2NlbnRDb2xvclxuICAuc2lkZWJhci1ncm91cCAmXG4gICAgcGFkZGluZy1sZWZ0IDJyZW1cbiAgLnNpZGViYXItc3ViLWhlYWRlcnMgJlxuICAgIHBhZGRpbmctdG9wIDAuMjVyZW1cbiAgICBwYWRkaW5nLWJvdHRvbSAwLjI1cmVtXG4gICAgYm9yZGVyLWxlZnQgbm9uZVxuICAgICYuYWN0aXZlXG4gICAgICBmb250LXdlaWdodCA1MDBcbjwvc3R5bGU+XG4iLCJpbXBvcnQgbW9kIGZyb20gXCItIS4uLy4uLy4uL2NhY2hlLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS0zLTAhLi4vLi4vLi4vYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0zLTEhLi4vLi4vLi4vdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL1NpZGViYXJMaW5rLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiOyBleHBvcnQgZGVmYXVsdCBtb2Q7IGV4cG9ydCAqIGZyb20gXCItIS4uLy4uLy4uL2NhY2hlLWxvYWRlci9kaXN0L2Nqcy5qcz8/cmVmLS0zLTAhLi4vLi4vLi4vYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS0zLTEhLi4vLi4vLi4vdnVlLWxvYWRlci9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL1NpZGViYXJMaW5rLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiIiwidmFyIHJlbmRlciwgc3RhdGljUmVuZGVyRm5zXG5pbXBvcnQgc2NyaXB0IGZyb20gXCIuL1NpZGViYXJMaW5rLnZ1ZT92dWUmdHlwZT1zY3JpcHQmbGFuZz1qc1wiXG5leHBvcnQgKiBmcm9tIFwiLi9TaWRlYmFyTGluay52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anNcIlxuaW1wb3J0IHN0eWxlMCBmcm9tIFwiLi9TaWRlYmFyTGluay52dWU/dnVlJnR5cGU9c3R5bGUmaW5kZXg9MCZpZD03MmMwZDU0MiZwcm9kJmxhbmc9c3R5bHVzXCJcblxuXG4vKiBub3JtYWxpemUgY29tcG9uZW50ICovXG5pbXBvcnQgbm9ybWFsaXplciBmcm9tIFwiIS4uLy4uLy4uL3Z1ZS1sb2FkZXIvbGliL3J1bnRpbWUvY29tcG9uZW50Tm9ybWFsaXplci5qc1wiXG52YXIgY29tcG9uZW50ID0gbm9ybWFsaXplcihcbiAgc2NyaXB0LFxuICByZW5kZXIsXG4gIHN0YXRpY1JlbmRlckZucyxcbiAgZmFsc2UsXG4gIG51bGwsXG4gIG51bGwsXG4gIG51bGxcbiAgXG4pXG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvbmVudC5leHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==