["javascript","json"]
# JSON Schema

というものがあるらしい。
**「JSONのデータ構造を定義できる」**
というもの。
この定義ファイルをJSON Schemaと言いJSON SchemaもJSONで書く。
書いた定義を元にJSONをバリデートできるし[jdoc](https://github.com/r7kamura/jdoc)でドキュメントの生成もできる。
[元記事](http://r7kamura.hatenablog.com/entry/2014/06/10/023433)

## 参照

[わかりやすいスライド](http://www.slideshare.net/hinakano/json-schema?ref=http://blog.tojiru.net/article/378812156.html)
[jsonschema(npm)](https://www.npmjs.com/package/jsonschema)

## 具体的に

### JSON

```
{
  "id": 12345,
  "name": "bonegollira"
  "tags": ["man", "JavaScript"]
}
```

### JSON Schema

上記の[JSON](#JSON)のJSON Schemaを書くと

```
{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "tags" {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

となる。
コメントつけると

```
{
  // JSONのタイプを定義
  "type": "object",
  // JSONが持っているプロパティの定義（この場合はidとnameとtags）
  "properties": {
    // idについての定義
    "id": {
      "type": "integer"
    },
    // nameについての定義
    "name": {
      "type": "string"
    },
    // tagsについての定義
    "tags" {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

ということ。

### バリデート

npmのjsonschemaを例にとると

```
var Validator = require('jsonschema').Validator;
var v = new Validator();
var instance = 4;
var schema = {"type": "number"};
console.log(v.validate(instance, schema));
```

でバリデートできる。
