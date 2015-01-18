(function () {

  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
    /*
    highlight: function(code, lang) {
console.log(code);
      return code;
    }
    */
  });

  var MDPATH = location.origin + location.pathname.split('/').slice(0, -1).join('/') + '/md/';
  var API = MDPATH + 'md.json';

  var Gitbook = new Vue({

      el: '.Gitbook',

      data: {
        md: '',
        html: ''
      },

      methods: {

        setMarkDown: function (md) {
          this.md = md;
          this.html = marked(md);
        }

      }

  });

  var Agenda = new Vue({

    el: '.Agenda',

    data: {
      items: []
    },

    methods: {

      filter: function (e) {
        var self = this;
        var text = e.target.value.toLowerCase();
        $.each(self.items, function (i, item) {
          item.isHidden = item.title.toLowerCase().indexOf(text) < 0 && item.tags.every(function (tag) {
            return tag.toLowerCase().indexOf(text) < 0;
          });
        });
      },

      setSearchWord: function (e) {
        e.stopPropagation();
        $('.Agenda-search').val($(e.target).text());
        this.filter();
      },

      removeSearchWord: function (e) {
        $('.Agenda-search').val('');
        this.filter();
      },

      selectBook: function (item) {
        var self = this;
        $.each(self.items, function (i) {
          self.items[i].isNow = i === item.$index;
        });
      },

      loadBook: function (item, index) {
        $.ajax({
          url: MDPATH + item.file,
          dataType: 'text',
          cache: false
        }).success(function (md) {
          Gitbook.setMarkDown(md);
        });
      }

    }
  });

  $.ajax({
    url: API,
    dataType: 'json',
    cache: false
  }).success(function (json) {
    var query = location.search.replace('?', '') + '.md';
    var index = 0;

    json.forEach(function (item, i) {
      if (item.file === query) {
        index = i;
      }
      item.isNow = false;
      item.isHidden = false;
    });
    json[index].isNow = true;
    Agenda.items = json;
    Agenda.loadBook(json[index]);
  });

}());
