var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var map = require('map-stream');
var mainBowerFiles = require('main-bower-files');
var timestamp = require('./lib/timestamp');
var del = require('del');
var fs = require('fs');
var path = require('path');
var run = require('run-sequence');



gulp.task('clean', function () {

  del.sync('./.app');

});



gulp.task('js', function () {

  return gulp.src('./app/js/*.js')
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest('./.app/js'));

});



gulp.task('components', function () {

  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.app/components'));

});



gulp.task('stylus', function () {

  return gulp.src('./app/stylus/*.stylus')
    .pipe($.plumber())
    .pipe($.stylus({
      compress: true
    }))
    .pipe(gulp.dest('./.app/css'));

});



gulp.task('markdown', function () {

  var mdjson = [];

  return gulp.src('./app/md/*')

    .pipe(
      $.if(/\.md$/, map(function (file, callback) {
        var lines = file.contents.toString('utf8').split('\n');
        var mtime = fs.statSync(file.path).mtime + "";

        mdjson.push({
          title: lines[1].replace(/^#\s*/, ''),
          tags: JSON.parse(lines[0]),
          timestamp: timestamp.mtime2__(mtime),
          file: path.basename(file.path)
        });

        file.contents = new Buffer(lines.slice(1).join('\n'));
        callback(null, file);
      }))
    )

    .pipe(
      $.if(/\.json/, map(function (file, callback) {
        mdjson.sort(function (prev, next) {
          var prevTime = timestamp.__2Num(prev.timestamp);
          var nextTime = timestamp.__2Num(next.timestamp);
          return prevTime < nextTime;
        });
        file.contents = new Buffer(JSON.stringify(mdjson));
        callback(null, file);
      }))
    )

    .pipe(gulp.dest('./.app/md'));
});



gulp.task('static', function () {

  return gulp.src([
    './app/**/*',
    '!./app/js',
    '!./app/js/*',
    '!./app/md',
    '!./app/md/*',
    '!./app/stylus',
    '!./app/stylus/*'
  ])
    .pipe(gulp.dest('./.app'));

});



gulp.task('server', ['build'], function () {

  browserSync({
    port: 8888,
    server: {
      baseDir: ".app"
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
    './app/js/*.js',
    './app/stylus/*.stylus',
    './app/md/*.md'
  ], ['server.reload']);

});



gulp.task('gh-pages', ['build'], function () {

  var remoteUrl = require('./package.json').repository.url;

  return gulp.src('./.app/**')
    .pipe($.ghPages({remoteUrl: remoteUrl}));

});



gulp.task('build', function (callback) {

  return run('clean', ['js', 'components', 'stylus', 'markdown', 'static'], callback);

});



gulp.task('deploy', ['gh-pages']);



gulp.task('default', ['server', 'watch']);