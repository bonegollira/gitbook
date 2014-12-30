["node.js", "javascript", "gulp", "gulp-plugin"]
# Gulpプラグイン

タスクランナーツールの[Gulp](http://gulpjs.com/)のプラグインは充実していて探せば困っていることの9割は解決ができてしまう。
ここでは便利なプラグインをまとめる。

## 最初に

プラグインを探したり使ったりする上で[ブラックリスト](https://github.com/gulpjs/plugins/blob/master/src/blackList.json)を参考にしている。
Gulpの開発チームが公開しているプラグインのブラックリストで他のプラグインでカバーできるプラグインの一覧。
これ使おうって思ったプラグインがあればまずはここをみて、ブラックリストであれば他のもっと高機能なプラグインを調べて見るのがいいだろう。大抵はそっちの方が高機能だ。

## プラグイン

- [gulp-load-plugins](#gulp-load-plugins)
- [gulp-plumber](#gulp-plumber)
- [gulp-inject](#gulp-inject)
- [gulp-gh-pages](#gulp-gh-pages)
- [gulp-filter](#gulp-filter)

## gulp-load-plugins

[gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins)

Gulpのプラグインを`require`してくれるプラグイン。
gulp-load-pluginsさえ`require`しておけば後々プラグインを追加してもいちいち`require`する必要がない。

```
var $ = require('gulp-load-plugins')();

gulp.src('*')
  .pipe($.concat('index.html')) // gulp-concat
  .pipe($.ghPages({}) // gulp-gh-pages
  ...
```

## gulp-plumber

[gulp-plumber](https://www.npmjs.com/package/gulp-plumber)

Gulpプラグインによるエラーが起こってパイプブレイクしたときにパイプブレイクを回避してくれるプラグイン。
[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)など圧縮プラグインで構文ミスなどでエラーが起こるとパイプブレイクが起こり`watch`が終了してしまうが、gulp-plumberで回避できる。

```
gulp.src('./app/js/*.js')
  .pipe($.plumber())
  .pipe($.uglify())
  ...
```

## gulp-inject

[gulp-inject](https://www.npmjs.com/package/gulp-inject)

srcにインジェクト用の記述があればそこに別のsrcを差し込むことができる。
例えば

```
// index.html

<!DOCTYPE html>
<html>
  <!-- inject:js -->
  <!-- endinject -->
</html>
```

```
gulp.src('index.html')
  .pipe($.inject(gulp.src('src/*.js', {read: false})))
  .pipe(gulp.dest('dist'));
```

とあれば

```
// dist/index.htm

<!DOCTYPE html>
<html>
  <!-- inject:js -->
  <script src="/src/sample.js"></script>
  <!-- endinject -->
</html>
```

といった具合なインジェクトができる。

```
gulp.src('src/*.js')
  .pipe($.uglify())
  .pipe($.inject(gulp.src('src/*.css', {read: false})))
  ...

gulp.src('src/*.js')
  .pipe($.uglify())
  .pipe($.inject(gulp.src('src/*.css'), {
    transform: function (filepath, file) {
      return file.contents.toString('utf8');
    }
  }))
  ...
```

## gulp-add-src

gulp-injectとdeplicatedって書いてあったけど別機能じゃ、、、

## gulp-gh-pages

[gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages)

Gitのgh-pagesブランチへsrcをプッシュしてくれるプラグイン。
gh-pagesじゃなくてもオプションで選択できるので便利。

```
gulp.src('app/**/*') // app以下のファイルだけプッシュ
  .pipe($.ghPages({remoteUrl:"git@github.com:bonegollira/gitbook.git"}));
```

## gulp-filter

気になってるので調べる
