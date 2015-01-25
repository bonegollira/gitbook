# 6to5で変換した後closure compilerで圧縮する

[6to5](http://6to5.org/)
はECMAScript6（以下es6）で書かれたコードをes5に変換してくれる。
ブラウザがes6をサポートしているか、どの範囲までサポートしているかを気にせずes6でコードを書ける。
基本的に使うことに関しては問題ないが
[closure compiler](https://developers.google.com/closure/compiler/)
と併用する場合に問題があった。



## 問題点

問題がおこるシーケンスは

- 元のコードを6to5で変換
- 変換したコードをclosure compilerのADVANCED_OPTIMIZATIONで圧縮

の順。
closure compilerのADVANCED_OPTIMIZATIONは強力な圧縮レベルでコーディング規約を守らないと動かないコードに変換してしまう。
（強力な圧縮が魅力で採用している）
簡単に言えば「全ての変数、プロパティを圧縮する」ため、APIとして公開してるプロパティ名もリネームしてしまう。
しかし文字リテラルは圧縮しないため、公開するプロパティは

```
window["api"] = function () {};
```

と文字リテラルで書けば良い。
しかし6to5は上記のように書いてあるコードを

```
window.api = function () {};
```

と変換してしまう。
よって、closure compilerが`api`をリネームしてしまって動かないコードになってしまう。
そのため、6to5の使用を諦めてclosure compilerだけを使っていた。



## 解決策

ちょっと工夫して書けば6to5は勝手に変換しないようだ。

```
window["api" + ""] = function () {};

// 以下の書き方はNGだった...
window[("api")] = function () {};
```

とすれば変換しない。
また

```
window.Obj = {
  ["api"] () {
  }
};
```

と書けば定義でも文字リテラルでプロパティ宣言になる。
が、この書き方は

```
var _defineProperty = function (obj, key, value) {
  return Object.defineProperty(obj, key, {
    value: value,
    enumerable: true,
    configurable: true,
    writable: true
  });
};

window.Obj = _defineProperty({}, "api", function api() {});
```

として、無駄に容量が増してしまう可能性があるので要注意。

```
var Obj = {};
Obj["api" + ""] = function () {};
window.Obj = Obj;
```

とリネームしないプロパティだけ後から追加でいいだろう。



## Gulpタスク

Gulpで書くと

```
var gulp = reqire('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('default', function () {

  return gulp.src('./src/*.js')
    // 必要であればsource mapを追加
    //.pipe($.sourcemaps.init())
    .pipe($.6to5({
      blacklist: [
        // ファイルの先頭に追加する`'use strict';`を外す
        'useStrict'
      ]
    }))
    //.pipe(sourcemap.write('map'))
    .pipe($.closureCompiler({
      compilerPath: './bower_components/closure-compiler/lib/vendor/compiler.jar',
      fileName: 'app.js',
      compilerFlags: {
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6'
      }
    }))
    .pipe(gulp.dest('./dest'));

});
```

となる。
