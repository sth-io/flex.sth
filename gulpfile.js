var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    minifyCSS = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    colors = require('colors'),
    watch = require('gulp-watch'),
    Imagemin = require('imagemin');

// your variables
var config = {
    projectName:    "flexsth",
    filesPrefix:    "flexSth_",
    libPath:        "./_src/lib/",
    lib:            []
}
// adding elements to lib example:
// lib: [config.libPath + 'jQuery/dist/jquery.min.js']


// notify on errors
var onError = function (err) {
    console.log(err)
    console.log('['+'! ERROR FOUND !'.red + ']');
    console.log('line:column: '.cyan + err.line + ':' + err.column + ' |  type: '.cyan + err.type);
    console.log('file: '.cyan + err.fileName.gray);
    console.log('message'.yellow);
    console.log(err.message.grey)
    console.log('details'.yellow);
    console.log(err.extract);
    console.log('['+'! ----------- !'.red + ']');
    this.emit('end');
};

// less to css
gulp.task('less', function () {
    return gulp.src('./_src/less/base.less')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(minifyCSS())
        .pipe(rename(config.filesPrefix+'style.min.css'))
        .pipe(gulp.dest('./dist/css/'))
});

// javascript concatenation and minification
gulp.task('js', function () {
    return gulp.src('./_src/js/**/*.js')
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(concat(config.filesPrefix + 'script.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./dist/js'))
});

//  concatenate your library.
gulp.task('lib', function () {
    return gulp.src(config.lib)
        .pipe(plumber({
          errorHandler: onError
        }))
        .pipe(concat(config.filesPrefix + 'lib.min.js'))
        .pipe(gulp.dest('./_dist/js'));
});

// watch for file changes
gulp.task('watch', function () {
    watch('./_src/less/**/*.less', function () {
        gulp.start('less');
    });
    watch('./_src/js/**/*.js', function () {
        gulp.start('js');
    });
});

// compress images
gulp.task('img', function(){
  new Imagemin()
      .src('_src/img/**/*.{gif,jpg,png,svg,JPG}')
      .dest('_dist/img')
      .use(Imagemin.jpegtran({progressive: true}))
      .use(Imagemin.gifsicle({interlaced: true}))
      .use(Imagemin.optipng({optimizationLevel: 3}))
      .run(function (err, files) {
          console.log(files);
          // => {path: 'build/images/foo.jpg', contents: <Buffer 89 50 4e ...>}
      });
});

// build you code
gulp.task('build', function(){
    gulp.start('less');
    gulp.start('js');
    gulp.start('lib');
    gulp.start('img');
});
