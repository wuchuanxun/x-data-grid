(function(e){function t(t){for(var o,a,l=t[0],s=t[1],c=t[2],d=0,p=[];d<l.length;d++)a=l[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&p.push(i[a][0]),i[a]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);u&&u(t);while(p.length)p.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],o=!0,l=1;l<n.length;l++){var s=n[l];0!==i[s]&&(o=!1)}o&&(r.splice(t--,1),e=a(a.s=n[0]))}return e}var o={},i={index:0},r=[];function a(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=o,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/x-data-grid/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var u=s;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("a1ec")},7560:function(e,t,n){},a1ec:function(e,t,n){"use strict";n.r(t);var o=n("2b0e"),i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("x-data-grid",{attrs:{height:"calc(100vh - 200px)",editable:!0,source:e.data,columns:e.columns,"page-size":50,"page-index":0,"click-expand":!0},on:{selectChanged:e.showId},scopedSlots:e._u([{key:"operation",fn:function(t,o){return[n("button",{on:{click:function(t){return e.deleteRow(o)}}},[e._v(" 删除 ")])]}},{key:"expandedRowRender",fn:function(t,o){return n("p",{},[e._v(" 展开行数据下标为: "+e._s(o)+" ")])}}])},[n("template",{slot:"_action"},[e._v(" 导出 ")])],2)],1)},r=[],a={name:"App",data(){return{columns:[{type:"_check",width:40,align:"center",fixed:"left"},{title:"名称",key:"name",type:"text",adjustable:!0,filterable:!0,width:100,ellipsis:!0,sortable:!0},{title:"数量",key:"num",sortable:!0,sortFn:null,adjustable:!0,filterable:!0,type:"number",align:"center"},{title:"单价",adjustable:!0,key:"unitPrice.value",width:800},{title:"操作",key:"none",width:100,scopedSlots:"operation",fixed:"right"}],data:[]}},created(){const e=[];for(let t=0;t<1e4;t++)e.push({name:"真果切换绑阿萨德群无多无群定强无敌无抢班夺权我觉得千万 ",num:2*t+.2131213,unitPrice:{value:59.9},id:3*t},{name:["苏泊力锅","dadqw"],num:3*t,unitPrice:{value:0x7932b535bdf5e},id:3*t+1},{name:"乐薯片",num:4*t,unitPrice:{value:66},id:3*t+2});this.data=e},methods:{showId(e){},deleteRow(e){}}},l=a,s=(n("dfa1"),n("2877")),c=Object(s["a"])(l,i,r,!1,null,null,null),u=c.exports,d=(n("13d5"),n("1276"),n("ac1f"),n("fb6a"),n("a9e3"),n("159b"),n("c7cd"),n("caad"),n("2532"),n("d3b7"),n("25f0"),n("ca21"),n("99af"),n("ddb0"),n("498a"),n("d81d"),n("841c"),n("5530")),p=n("b85c"),h=n("6062"),f=n("b012"),y=n("6612"),g=n.n(y),x=function(e,t){return e<t?-1:e>t?1:0};function m(e,t){return e?e[t]:null}function v(e,t){return t in e||(e[t]={}),e[t]}var b=function(e,t){return t?t.split(".").reduce(m,e):e},w=function(e,t,n){var o=t.split(".");if(o.length>1){var i=o.slice(0,-1).reduce(v,e);i[o[o.length-1]]=n}else e[t]=n},k="0,0[.]00",S={name:"x-data-grid",props:{columns:{type:Array,default:function(){return[]}},source:{type:Array,default:function(){return[]}},pageSize:{type:Number,default:0},editable:{type:Boolean,default:!1},height:{type:String,default:""},rowKey:{type:String,default:"_index"},hiddenSearch:{type:Boolean,default:!1},hiddenFooter:{type:Boolean,default:!1},noDataText:{type:String,default:"没有数据"},overwriteSearch:{type:Boolean,default:!1},clickExpand:{type:Boolean,default:!1}},data:function(){return{pageX:0,inResize:!1,colWidth:0,col:null,nextCol:null,nextColWidth:0,editCell:[1,1],pageIndex:0,options:{useExtendedSearch:!0,keys:["."]},filterSource:[],activeRowKey:-1,sortFn:x,sortType:"normal",sortKey:null,searchSchema:""}},computed:{fuse:function(){return new h["a"](this.sourceLocal,this.options)}},render:function(e){var t=this,n=[],o=[],i=[],r=0,a=0,l=0;this.columns.forEach((function(e){"right"===e.fixed&&(r+=e.width)})),l=r,this.columns.forEach((function(i,r){"_check"===i.type?o.push(e("col",{style:{width:(i.width||20)+"px"}})):i.width?o.push(e("col",{style:{width:i.width+"px"}})):i.minWidth?o.push(e("col",{style:{width:i.minWidth+"px"}})):o.push(e("col"));var c=[i.title];"_check"===i.type?c=[e("input",{attrs:{type:"checkbox",checked:!1},on:{change:function(e){var n,o=e.target.checked,i=[],r=Object(p["a"])(s);try{for(r.s();!(n=r.n()).done;){var a=n.value;t.$set(a,"_checked",o),o&&i.push(a[t.rowKey])}}catch(l){r.e(l)}finally{r.f()}t.$emit("selectChanged",i)}}})]:i.sortable&&("asc"===i._sortType?c[0]+="↑":"desc"===i._sortType?c[0]+="↓":c[0]+="↑↓");var u={};i.sortable&&(u.click=function(e){if("normal"===i._sortType?t.sortType="asc":"asc"===i._sortType?t.sortType="desc":t.sortType="normal",t.sortFn=i.sortFn||x,t.sortKey=i.key,t.columns.forEach((function(e,n){e._sortType=n===r?t.sortType:"normal"})),"normal"!==t.sortType){var n="asc"===t.sortType?1:-1;t.filterSource.sort((function(e,o){return t.sortFn(e[t.sortKey],o[t.sortKey])*n}))}else t.filterSource.sort((function(e,t){return x(e._index,t._index)}));t.columns.push()}),"left"===i.fixed?(n.push(e("th",{style:{userSelect:"none",position:"sticky",left:a+"px",textAlign:i.align||"left",zIndex:10},on:u},c)),a+=i.width):"right"===i.fixed?(l-=i.width,n.push(e("th",{style:{userSelect:"none",position:"sticky",right:l+"px",borderLeft:"1px solid #D8DADC",textAlign:i.align||"left",zIndex:10},on:u},c))):i.adjustable?n.push(e("th",{style:{userSelect:"none",textAlign:i.align||"left"},on:u},[e("span",{style:{display:"inline-block",width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},c),e("div",{style:{top:0,right:"-4px",width:"8px",position:"absolute",cursor:"col-resize",height:"100%",touchAction:"none"},on:{mousedown:function(e){e.stopPropagation(),t.pageX=e.pageX;var n=e.target.parentElement,o=n.nextElementSibling;t.colWidth=n.offsetWidth,t.inResize=!0,t.col=i,t.nextCol=t.columns[r+1],o&&(t.nextColWidth=o.offsetWidth)},click:function(e){e.stopPropagation()}}})])):n.push(e("th",{style:{userSelect:"none",textAlign:i.align||"left"},on:u},c))}));var s=this.filterSource;this.pageSize>0&&(s=s.slice(this.pageSize*this.pageIndex,this.pageSize*this.pageIndex+this.pageSize)),s.forEach((function(n,o){var c=[];a=0,l=r,t.enableRowSelector&&c.push(e("input",{attrs:{type:"checkbox"}})),t.columns.forEach((function(o){var i=o.ellipsis?{textOverflow:"ellipsis",whiteSpace:"nowrap",overflow:"hidden"}:{},r=b(n,o.key);"number"===o.type?r=g()(r).format(o.format):"text"===o.type&&r instanceof Object&&(r=JSON.stringify(r)),"_check"===o.type?r=[e("input",{attrs:{type:"checkbox"},domProps:{checked:n._checked},on:{change:function(e){var o=e.target.checked;t.$set(n,"_checked",o);var i,r=[],a=Object(p["a"])(s);try{for(a.s();!(i=a.n()).done;){var l=i.value;l._checked&&r.push(l[t.rowKey])}}catch(c){a.e(c)}finally{a.f()}t.$emit("selectChanged",r)}}})]:o.scopedSlots&&(r=t.$scopedSlots[o.scopedSlots](r,n,n._index)),"left"===o.fixed?(i.position="sticky",i.left=a+"px",i.zIndex=9,a+=o.width):"right"===o.fixed&&(l-=o.width,i.position="sticky",i.right=l+"px",i.zIndex=9,i.borderLeft="1px solid #D8DADC");var u=t.editable;!0===o.editable?u=!0:!1===o.editable&&(u=!1),u?t.editCell[0]===n._index&&t.editCell[1]===o.key?c.push(e("td",[e("input",{style:{width:"100%",margin:0,padding:0,border:"none",outlineStyle:"none",fontSize:"16px"},attrs:{value:b(n,o.key)},ref:"editCell",on:{blur:function(){t.$set(t,"editCell",[-1,-1])},keyup:function(e){"Enter"!==e.key&&13!==e.keyCode||(t.editCell[1].includes(".")?w(t.sourceLocal[t.editCell[0]],t.editCell[1],e.target.value):t.$set(t.sourceLocal[t.editCell[0]],t.editCell[1],e.target.value),t.$set(t,"editCell",[-1,-1]),t.$emit("editCell",n))}}})])):c.push(e("td",{style:Object(d["a"])({wordBreak:"break-all",textAlign:o.align||"left"},i),on:{dblclick:function(e){if("_check"===o.type||o.scopedSlots)return!1;t.editCell=[n._index,o.key],setTimeout((function(){t.$refs.editCell.focus(),t.$refs.editCell.selectionStart=t.$refs.editCell.selectionEnd=b(n,o.key).toString().length}),200)}}},r)):c.push(e("td",{style:Object(d["a"])({wordBreak:"break-all",textAlign:o.align||"left"},i)},r))})),i.push(e("tr",{class:{"zebra-pattern":o%2===1,active:n[t.rowKey]===t.activeRowKey},on:{click:function(){t.clickExpand&&t.$set(n,"_expanded",!n._expanded),t.activeRowKey!==n[t.rowKey]&&(t.activeRowKey=n[t.rowKey],t.$emit("activeRowChanged",n))}}},c)),n._expanded&&i.push(e("tr",[e("td",{attrs:{colspan:t.columns.length}},t.$scopedSlots.expandedRowRender(n,o))]))})),0===s.length&&i.push(e("tr",[e("td",{attrs:{colspan:this.columns.length},style:{textAlign:"center",lineHeight:"100px",borderBottom:0,borderRight:0,fontSize:"20px",opacity:.8,letterSpacing:"5px"}},this.noDataText)]));var c=[];if(this.pageSize>0){var u=Math.ceil(this.filterSource.length/this.pageSize);c.push(e("span",{style:{marginRight:"5px"}},"跳转到")),c.push(e("input",{class:"x-page-number",attrs:{type:"number",min:1,max:u},domProps:{value:t.pageIndex+1},style:{width:8*Math.floor(Math.log10(u))+30+"px",outlineStyle:"none",border:"1px solid #ccc",fontSize:"15px",height:"20px"},on:{change:function(e){var n=parseInt(e.target.value);t.pageIndex=n<1?0:n>u?u-1:n-1}}})),c.push(e("span",{style:{margin:"0 5px"}},"页")),c.push(e("button",{class:"x-nav-bt",domProps:{disabled:0===t.pageIndex},on:{click:function(e){t.pageIndex-=1}}},"<")),c.push(e("span",{style:{color:"#708DF4"}},this.pageIndex+1+"/"+u)),c.push(e("button",{class:"x-nav-bt",domProps:{disabled:t.pageIndex===u-1},on:{click:function(e){t.pageIndex+=1}}},">"))}var h,y=e("span",{style:{float:"right"}},c),m=e("span","共有数据".concat(this.sourceLocal.length,"条, 筛选结果").concat(this.filterSource.length,"条")),v=e("div",{style:{textAlign:"left",background:"#F8F8F9",padding:"10px 10px",fontSize:"14px",borderTop:"1px solid #D8DADC"}},[m,y]),k=[],S=[],_=Object(p["a"])(this.columns);try{for(_.s();!(h=_.n()).done;){var C=h.value;C.filterable&&(k.push(e("option",{attrs:{value:C.key}},C.title)),S.push(C.key))}}catch(z){_.e(z)}finally{_.f()}var T=[];this.overwriteSearch?T.push(e("span",this.$slots._search)):(T.push(e("select",{on:{change:function(e){t.options.keys=[e.target.value]}}},[e("option",{attrs:{value:"."}},"全部")].concat(k))),T.push(e("input",{domProps:{value:t.searchSchema},on:{input:Object(f["debounce"])((function(e){t.options.keys.includes(".")&&(t.options.keys=S);var n=e.target.value.trim();t.searchSchema=n,0===n.length?t.filterSource=t.sourceLocal:t.filterSource=t.fuse.search(n).map((function(e){return e.item})),t.pageIndex=0}),300),keyup:function(e){if("Enter"===e.key||13===e.keyCode){t.options.keys.includes(".")&&(t.options.keys=S);var n=e.target.value.trim();t.searchSchema=n,0===n.length?t.filterSource=t.sourceLocal:t.filterSource=t.fuse.search(n).map((function(e){return e.item})),t.pageIndex=0}}}})),T.push(e("span",{style:{color:"#5A77B3",marginLeft:"5px"},attrs:{tooltip:"文本前加=表示完全匹配\n          文本前加'表示包含\n          文本前加!表示不包含\n          文本前加^表示开头为\n          文本前加!^表示开头不为\n          文本后加$表示结尾为\n          文本前加!，后加$表结尾不为\n          空格表示与，|表示或"}},"☀"))),T.push(e("span",{style:{float:"right"}},t.$slots._action));var $=this.hiddenSearch?[]:[e("div",{class:"x-table-title",style:{textAlign:"left"}},T)];return $.push(e("div",{style:{width:"100%",height:this.height,padding:"0 0 0 0",overflowY:"scroll",overflowX:"auto"}},[e("table",{style:{margin:0,width:"calc(100% - 4px)"}},[e("colgroup",o),e("thead",[e("tr",n)]),e("tbody",i)])])),this.hiddenFooter||$.push(v),e("div",{class:"x-data-grid"},$)},watch:{source:function(){if(this.sourceLocal=this.source.map((function(e,t){return e._index=t,e})),this.filterSource=this.sourceLocal,this.searchSchema="","normal"!==this.sortType){var e="asc"===this.sortType?1:-1,t=this;this.filterSource.sort((function(n,o){return t.sortFn(n[t.sortKey],o[t.sortKey])*e}))}}},created:function(){var e=this;if(this.columns.map((function(t,n){return t._sortType=t._sortType||"normal",t._index=n,"number"!==t.type||t.format||(t.format=k),"normal"!==t._sortType&&(e.sortFn=t.sortFn||x,e.sortKey=t.key,e.sortType=t._sortType),t})),this.sourceLocal=this.source.map((function(e,t){return e._index=t,e})),this.filterSource=this.sourceLocal,"normal"!==this.sortType){var t="asc"===this.sortType?1:-1;this.filterSource.sort((function(n,o){return e.sortFn(n[e.sortKey],o[e.sortKey])*t}))}document.addEventListener("mousemove",(function(t){if(e.inResize){var n=t.pageX-e.pageX;e.$set(e.col,"width",Math.max(e.col.minWidth||10,e.colWidth+n)),e.nextCol&&!e.nextCol.fixed&&e.$set(e.nextCol,"width",Math.max(e.nextCol.minWidth||10,e.nextColWidth-n))}})),document.addEventListener("mouseup",(function(t){e.inResize=!1,e.pageX=void 0}))}};n("7560");o["a"].component("x-data-grid",S),new o["a"]({render:e=>e(u)}).$mount("#app")},dfa1:function(e,t,n){"use strict";n("f489")},f489:function(e,t,n){}});
//# sourceMappingURL=index.0c63eaa2.js.map