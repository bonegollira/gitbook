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
      hitCount: 0,
      items: []
    },

    methods: {

      filter: function () {
        var words = this.searchWord.split(' ').map(function (word) {
          return word.toLowerCase().trim();
        });
        var hitCount = this.items.length;

        this.items.forEach(function (item, i) {
          var isHidden = words.some(function (word) {
            return item.title.toLowerCase().indexOf(word) < 0 && item.tags.every(function (tag) {
              return tag.toLowerCase().indexOf(word) < 0;
            });
          });
          isHidden && hitCount--;
          item.isHidden = isHidden;
        });

        this.hitCount = hitCount;
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

      selectBook: function (index) {
        this.items.forEach(function (item, i) {
          item.isNow = i === index;
        });
      },

      loadBook: function (index) {
        var self = this;
        var item = self.items[index];

        superagent.get(MDPATH + item.file).end(function (response) {
          var md = response.text;
          Gitbook.setMarkDown(md);
          self.items.forEach(function (item, i) {
            item.isNow = i === index;
          });
        });

      }

    }
  });

  superagent.get(API).end(function (response) {
    var query = location.search.replace('?', '') + '.md';
    var index = 0;

    Agenda.items = response.body.map(function (item, i) {;
      if (item.file === query) {
        index = i;
      }
      item.isNow = false;
      item.isHidden = false;
      return item;
    });
    Agenda.loadBook(index);
  });

}());
