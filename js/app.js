!function(){marked.setOptions({gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!0,smartLists:!0,smartypants:!1});var e=location.origin+location.pathname.split("/").slice(0,-1).join("/")+"/md/",t=e+"md.json",a=new Vue({el:".Gitbook",data:{md:"",html:""},methods:{setMarkDown:function(e){this.md=e,this.html=marked(e)}}}),i=new Vue({el:".Agenda",data:{items:[]},methods:{filter:function(e){var t=this,a=e.target.value.toLowerCase();$.each(t.items,function(e,t){t.isHidden=t.title.toLowerCase().indexOf(a)<0&&t.tags.every(function(e){return e.toLowerCase().indexOf(a)<0})})},setSearchWord:function(e){e.stopPropagation(),$(".Agenda-search").val($(e.target).text()),this.filter()},removeSearchWord:function(){$(".Agenda-search").val(""),this.filter()},selectBook:function(e){var t=this;$.each(t.items,function(a){t.items[a].isNow=a===e.$index})},loadBook:function(t){$.ajax({url:e+t.file,dataType:"text",cache:!1}).success(function(e){a.setMarkDown(e)})}}});$.ajax({url:t,dataType:"json",cache:!1}).success(function(e){var t=location.search.replace("?","")+".md",a=0;e.forEach(function(e,i){e.file===t&&(a=i),e.isNow=!1,e.isHidden=!1}),e[a].isNow=!0,i.items=e,i.loadBook(e[a])})}();