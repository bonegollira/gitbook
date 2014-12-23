(function () {

  jQuery.expr[':'].lowercontains = function(a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };

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
        var text = $('.Agenda-search').val().toLowerCase();
        $('.Agenda-list-item').removeClass('hidden');
        $('.Agenda-list-item:not(:lowercontains("' + text  + '"))').addClass('hidden');
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
          self.items[i].now = i === item.$index;
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
      json[i].now = false;
    });
    json[index].now = true;
    Agenda.items = json;
    Agenda.loadBook(json[index]);
  });

}());
