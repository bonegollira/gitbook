var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var merge = require('merge-stream');
var timestamp = require('./lib/timestamp');



gulp.task('js', function () {

  var merged = merge();

  merged.add(
    gulp.src('./js/*.js')
      .pipe($.plumber())
      .pipe($.uglify())
      .pipe(gulp.dest('./app/minjs'))
  );


  merged.add(
    gulp.src('./bower_components/vue/dist/vue.min.js').pipe(gulp.dest('./app/components/vue/dist'))
  );
  merged.add(
    gulp.src('./bower_components/jquery/dist/jquery.min.js').pipe(gulp.dest('./app/components/jquery/dist'))
  );
  merged.add(
    gulp.src('./bower_components/marked/lib/marked.js').pipe(gulp.dest('./app/components/marked/lib'))
  );
  merged.add(
    gulp.src('./bower_components/github-markdown-css/github-markdown.css').pipe(gulp.dest('./app/components/github-markdown-css'))
  );
  merged.add(
    gulp.src('./bower_components/normalize.css/normalize.css').pipe(gulp.dest('./app/components/normalize.css'))
  );

});



gulp.task('stylus', function () {
  return gulp.src('./stylus/*.stylus')
    .pipe($.plumber())
    .pipe($.stylus({
      compress: true
    }))
    .pipe(gulp.dest('./app/css'));
});



gulp.task('markdown', function () {
  var del = require('del');
  var fs = require('fs');
  var mdjson = [];

  del.sync('./app/md');
  fs.mkdirSync('./app/md');

  fs.readdirSync('./markdown').map(function (md) {
    return {
      name: md,
      full: __dirname + '/markdown/' + md
    };
  }).forEach(function (info) {
    var markdown = fs.readFileSync(info.full, {encoding: 'utf-8'});
    var lines = markdown.split('\n');
    var mtime = fs.statSync(info.full).mtime + "";

    mdjson.push({
      title: lines[1].replace('# ', ''),
      tags: (JSON.parse(lines[0])).map(function (tag) {return {tag: tag};}),
      timestamp: timestamp.mtime2__(mtime),
      file: info.name
    });

    markdown = lines.slice(1).join('\n');

    fs.writeFileSync('./app/md/' + info.name, markdown);
  });

  mdjson.sort(function (prev, next) {
    var prevTime = timestamp.__2Num(prev.timestamp);
    var nextTime = timestamp.__2Num(next.timestamp);
    return prevTime < nextTime;
  });

  fs.writeFileSync('./app/md/md.json', JSON.stringify(mdjson));

});



gulp.task('server', ['build'], function () {
  browserSync({
    port: 8888,
    server: {
      baseDir: "app"
    },
    ghostMode: false,
    notify: false,
    scrollProportionally: false,
    browser: "google chrome"
  });
});



gulp.task('server.reload', ['build'], function () {
  browserSync.reload();
});



gulp.task('watch', function () {
  gulp.watch([
    './app/index.html',
    './js/*.js',
    './stylus/*.stylus',
    './markdown/*.md'
  ], ['server.reload']);
});



gulp.task('gh-pages', ['build'], function () {
  var remoteUrl = require('./package.json').repository.url;
  return gulp.src('./app/**')
    .pipe($.ghPages({remoteUrl: remoteUrl}));
});



gulp.task('build', ['js', 'stylus', 'markdown']);



gulp.task('deploy', ['gh-pages']);



gulp.task('default', ['server', 'watch']);
