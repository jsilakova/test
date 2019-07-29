'use strict';

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var pug             = require('gulp-pug');
var fs              = require('file-system');
var imagemin        = require('gulp-imagemin');
var browserSync     = require('browser-sync');
var combineMq       = require('gulp-combine-mq');
var clean           = require('gulp-clean');
var uglify          = require('gulp-uglify');

var src = {
  pug:   'src/pug/',
  img:   'src/assets/',
  sass:  'src/scss/',
  fonts: 'src/fonts/*.*',
  js:    'src/js/*.js',
};

var dest = {
  html: 'dest/',
  img: 'dest/assets/',
  css: 'dest/css',
  fonts: 'dest/fonts/',
  js: 'dest/js/',
};

gulp.task('clean', function () {  
  return gulp.src('dest/', {read: false})
    .pipe(clean());
});

gulp.task('sass', function () {
  return gulp
    .src(src.sass + '*.scss' )
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['ie >= 10', 'last 2 version'],
      cascade: false,
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.css))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('pug', function () {
  return gulp
    .src(src.pug + '*.pug')
    .pipe(pug({
      pretty: true,
      locals: Object.assign(JSON.parse(fs.readFileSync('banuba-content.json'))),
    }).on('error', (e) => console.log(e.toString())))
    .pipe(gulp.dest(dest.html))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('compress-js', function () {
  return gulp
    .src("src/js/main.js")
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));
});

gulp.task('preloader-js', function () {
  return gulp
    .src("src/js/preloader.js")
    .pipe(uglify())
    .pipe(gulp.dest(dest.js));
});

gulp.task('copy-fonts', function () {
  return gulp
    .src(src.fonts)
    .pipe(gulp.dest(dest.fonts));
});

gulp.task('copy-img', function () {
  return gulp
    .src(src.img + '**/*.*')
    .pipe(gulp.dest(dest.img));
});

// copy js tasks
gulp.task('copy-bootstrap-js', function () {
  return gulp
    .src("node_modules/bootstrap/dist/js/bootstrap.min.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-jquery-js', function () {
  return gulp
    .src("node_modules/jquery/dist/jquery.min.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-slick-carousel', function () {
  return gulp
    .src("node_modules/slick-carousel/slick/slick.min.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-aos-animate', function () {
  return gulp
    .src("node_modules/aos/dist/aos.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-js', function () {
  return gulp
    .src(src.js)
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-three-js', function () {
  return gulp
    .src("src/js/three.min.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-three-main-js', function () {
  return gulp
    .src("src/js/three-main.js")
    .pipe(gulp.dest(dest.js));
});
gulp.task('copy-popper-js', function () {
  return gulp
    .src("src/js/popper.min.js")
    .pipe(gulp.dest(dest.js));
});

gulp.task('copy-all-js', [
  'copy-jquery-js',
  'preloader-js',
  'copy-popper-js',
  'copy-bootstrap-js',
  'copy-slick-carousel',
  'copy-three-js',
  'copy-three-main-js',
  'copy-aos-animate'
], function () {});

gulp.task('combineMq', function () {
    return gulp.src('dest.css')
    .pipe(combineMq({
        beautify: false
    }))
    .pipe(gulp.dest(dest.css));
});



gulp.task('watch', function () {
  gulp.watch(src.pug + '**/*.pug', ['pug']);
  gulp.watch(src.sass + '**/*.scss', ['sass']);
  gulp.watch(src.js + '**/*.js');
  gulp.watch('banuba-content.json', ['pug']);
  gulp.watch(src.img, ['copy-img']);
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'dest/',
    },
    port: 8080,
    open: true,
    notify: false,
  });
});


gulp.task('default', [
  'sass',
  'pug',
  'copy-img',
  "compress-js",
  'copy-all-js',
  'copy-fonts',
  'watch',
  'browserSync',
], function () {});

gulp.task('css', function () {
  return gulp
    .src(src.sass + '*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false,
    }))
    .pipe(gulp.dest(dest.css));
});

gulp.task('html', function () {
  return gulp
    .src(src.pug)
    .pipe(pug())
    .pipe(gulp.dest(dest.html));
});

gulp.task('imagemin', function () {
  return gulp
    .src(src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(dest.img));
});

gulp.task('build', ['css', 'html', 'imagemin', 'copy-fonts', "compress-js", 'copy-all-js', 'combineMq'], function () {});
