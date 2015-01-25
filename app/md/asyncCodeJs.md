["javascript"]
# JavaScriptで非同期処理を走らせる方法

Objective-Cでは`NSThread`といったスレッドを分けて処理を走らせてアプリの動作を軽快に見せることができる。
しかしJavaScriptでは非同期処理のAPIがなく`setTimeout`や`XHTTPRequest`で非同期な処理ができるが公式な使い方ではない。
JavaScriptにおいて非同期処理についてまとめておく。



## Web Workers

[HTML5 Rocks](https://www.google.co.jp/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0CB0QFjAA&url=http%3A%2F%2Fwww.html5rocks.com%2Fja%2Ftutorials%2Fworkers%2Fbasics%2F&ei=nrnEVMb8L-PamAW8p4HYCQ&usg=AFQjCNFU8tTM5CACjHMXOpm0JA41maq7ew&sig2=hjXFyfOTeROppAhQG_IRtA)

HTML5で定義されたWeb Workersは完全な別スレッドで処理を走らせるためのAPIらしい。
仕様としては別スレッドで走らせる処理をJSファイルを分けて書いておき、そのJSファイルを読み込むというのが基本。
だが、`Blob`を使えば別ファイルに分けなくても使える。

https://developer.mozilla.org/en-US/docs/Web/API/Blob
http://qiita.com/mohayonao/items/fa7d33b75a2852d966fc

```
var worker = new Worker('worker.js');
worker.addEventListener('message', function (e) {
  console.log('result is:', e.data);
}, false);
worker.postMessage('cmd:get/userData');
```

```
var src = 'self.addEventListener("message", function (e) {self.postMessage(e.data);}, false);';
var blob = new Blob([src], {type: 'text/javascript'});
var worker = new Worker(URL.createObjectURL(blob));
worker.addEventListener('message', function (e) {
  console.log(e.data);
}, false);
worker.postMessage("hello");

// console => "hello"
```



## Web Workersを使わない非同期処理の走らせ方

考えた結果、選択肢は

- `setTimeout`
- `setInterval`
- `XHTTPRequest`
- `addEventListener`

[app](http://bonegollira.github.io/study-asyncCode.js/)
に簡単なテストページを作ったので`setTimeout` `setInterval` `addEventListener`のパフォーマンスは確認できる。

### パフォーマンス

結果をまとめておくと

| `setTimeout` | `setInterval` | `addEventListener` | `Web Workers` |
| --- | --- | --- |
| 27ms | 47069ms | 157ms | 160ms |

### 使うべきか否か

使うなら`setTimeout`。
どれも結局は同じスレッドなので`setTimeout`等で走らせている処理が終わらなければアプリは応答しなくなる。
（クラッシュする）
また、仕事での経験上だが`setTimeout`を連発しすぎるとアプリのパフォーマンスは悪くなり、例えばスクロールはカクカクしたりと弊害もある。
ちょっとした処理で使うのはいいが完全に信頼できるものではない。
