!function(){marked.setOptions({gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!0,smartLists:!0,smartypants:!1,highlight:function(t,e){return hljs.highlightAuto(t).value}});var t=location.origin+location.pathname.split("/").slice(0,-1).join("/")+"/md/",e=new Vue({el:".Gitbook",data:{md:"",html:document.querySelector(".Gitbook-article").innerHTML},methods:{setMarkDown:function(t){this.md=t,this.html=marked(t),this.$el.scrollTop=0}}}),i=new Vue({el:".Agenda",data:{searchWord:"",hitCount:0,items:[]},methods:{filter:function(){var t=this.searchWord.split(" ").map(function(t){return t.toLowerCase().trim()}),e=this.items.length;this.items.forEach(function(i,o){var n=t.some(function(t){return i.title.toLowerCase().indexOf(t)<0&&i.tags.every(function(e){return e.toLowerCase().indexOf(t)<0})});n&&e--,i.isHidden=n}),this.hitCount=e},toggleSearchWord:function(t){t.stopPropagation();var e=this.searchWord,i=t.target.textContent.trim();e.indexOf(i)<0?e+=" "+i:e=e.replace(new RegExp(i,"g"),""),this.searchWord=e.replace(/ +/g," ").trim(),this.filter()},removeSearchWord:function(t){this.searchWord="",this.filter()},selectBook:function(t){this.items.forEach(function(e,i){e.isNow=i===t})},loadBook:function(i){var o=this,n=o.items[i];superagent.get(t+n.file).end(function(t){var n=t.text;e.setMarkDown(n),o.items.forEach(function(t,e){t.isNow=e===i})})}}}),o=location.search.replace("?","")+".md",n=0;i.items=window.config.mdJson.map(function(t,e){return t.file===o&&(n=e),t.isNow=!1,t.isHidden=!1,t}),i.loadBook(n)}();