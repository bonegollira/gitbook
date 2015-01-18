(function () {

  marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function(code, lang) {
      return hljs.highlightAuto(code).value;
    }
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
      searchWord: '',
      items: []
    },

    methods: {

      filter: function () {
        var self = this;
        var words = self.searchWord.split(' ').map(function (word) {
          return word.toLowerCase().trim();
        });

        $.each(self.items, function (i, item) {
          item.isHidden = words.some(function (word) {
            return item.title.toLowerCase().indexOf(word) < 0 && item.tags.every(function (tag) {
              return tag.toLowerCase().indexOf(word) < 0;
            });
          });
        });
      },

      toggleSearchWord: function (e) {
        e.stopPropagation();

        var searchWord = this.searchWord;
        var newText = e.target.textContent.trim();

        if (searchWord.indexOf(newText) < 0) {
          searchWord += ' ' + newText;
        }
        else {
          searchWord = searchWord.replace(new RegExp(newText, 'g'), '');
        }
        this.searchWord = searchWord.replace(/ +/g, ' ').trim();
        this.filter();
      },

      removeSearchWord: function (e) {
        this.searchWord = '';
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
