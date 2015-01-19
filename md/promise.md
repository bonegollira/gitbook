# Promise

ES6でJavaScriptにPromiseが実装された。
Promiseは非同期処理をまとめることのできるAPIという認識。
非同期処理の完了後に処理を走らせるとなるとコールバックがよく使われるが、コールバックが続いていくと読みづらいコードとなっていまう。
ES6で実装される前まではライブラリが実装していて、ES6で実装されたものと挙動が少し違う。
ライブラリで実装していたものが非推奨としてES6で定義されているのでES6をベースに使い方をまとめておく。
非推奨となっているものはまとめない。

[MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)

## API

```
Promise
  .resolve
  .reject
  .then
  .catch
  .all
  .race
``` 

## 基本的な流れ

```
new Promise(function (resolve, reject) {
  // resolve() -> thenが実行される、何回呼んでもthenが呼ばれるのは1回だけ
  // reject() -> catchが実行される、何回呼んでもcatchが呼ばれるのは1回だけ
})
  .then(function (success) {
    // resolve(arg)でsuccessを受け取れる
  })
  .catch(function (error) {
    // reject(arg)でerrorを受け取れる
  });

  // .then(function (arg) {}, function (error) {}) とも書ける
```

## `resolve` `Promise.resolve`

`Promise`を「解決済み」にする。
`Promise.resolve()`は「解決済み」の`Promise`を生成する

## `reject` `Promise.reject`

`Promise`を「棄却済み」にする。
`Promise.reject()`は「棄却済み」の`Promise`を生成する

## `then`

`Promise`が「解決済み」になった場合、`then`に登録してある処理が呼ばれる。
`then`がメソッドチェーンで続いていれば連続で呼ばれる。
しかし`resolve`から引数を受け継ぐのは1回のみで、連続した`then`で引数を受け継ぐ場合は`then`の中で引数を
`return` する必要がある。
`then`で`Promise`を返した場合、その`Promise`が以降の`then`と`catch`の対象となる。

```
Promise.resolve(10).then(alert).then(alert);
// alertで10が2回表示される

Promise.resolve(10).then(function (num) {
  alert(num);
  // 次のthenにも引数を渡す
  return num;
}).catch(alert).then(alert);
// alertで10が1回表示され、undefinedが1回表示される
```

```
Promise.resolve(10).then(function (num) {
  return new Promise(function (resolve) {
    resolve(num + 10);
  });
}).then(alert).catch(function (num) {
  console.log(num);
});
// alertで20が1回表示される
```

## `catch`

`Promise`が「棄却済み」になった場合、`catch`に登録してある処理が呼ばれる。
`catch`がメソッドチェーンで続いていれば連続で呼ばれる。
しかし`reject`から引数を受け継ぐのは1回のみで、連続した`catch`で引数を受け継ぐ場合は`catch`の中で引数を`return`する必要がある。
`catch`で`Promise`を返した場合、その`Promise`が以降の`then`と`catch`の対象となる。
```
Promise.reject(123).catch(alert).catch(alert);
// alertで123が2回表示される

Promise.reject(10).catch(function (num) {
  alert(num);
  // 次のcatchにも引数を渡す
  return num;
}).then(alert).catch(alert);
```

```
Promise.reject(10).catch(function (num) {
  return new Promise(function (_, reject) {
    reject(num + 10);
  });
}).then(alert).catch(function (num) {
  console.log(num);
});
// console.logで20が1回表示される
```

## `Promise.all`

複数の`Promise`を受け取り、全てが完了すれば処理を走らせる
どれかが`reject`すれば`catch`が呼ばれる

```
var childPromise = Promise.resolve(123);
var promise = Promise.all([true, childPromise]).then(function (args) {
  // args === [true, 123]
  // argsは渡されたPromiseの数の配列となってくる、値を返さないPromiseはundefined
});
```

## `Promise.race`

複数の`Promise`を受け取り、どれか1つが完了すれば処理を走らせる
最初の完了した`Promise`が`resolve`か`reject`かで`then`か`catch`のどちらが呼ばれるか変わります。
引数の使い方などは
