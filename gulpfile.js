var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css');

var browserSync = require('browser-sync').create();

gulp.task('css', function() {
    gulp.src([
            'src/css/**/bootstrap.css',
            'src/css/**/style.css',
            'src/css/**/font-awesome.css'
        ])
        .pipe(minifyCSS())
        .pipe(gulp.dest('dest/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
    gulp.src([
            'src/js/**/bootstrap.js',
            'src/js/**/knockout-3.4.2.js',
            'src/js/**/map.js'
        ])
        .pipe(uglify())
        .pipe(gulp.dest('dest/js'));
});

gulp.task('images', function() {
    gulp.src([
            'src/images/**/*'
        ])
        .pipe(gulp.dest('dest/images'));
});

gulp.task('font', function() {
    gulp.src([
            'src/fonts/**/*'
        ])
        .pipe(gulp.dest('dest/fonts'));
});

gulp.task('html', function() {
    gulp.src([
            'src/*.html'
        ])
        .pipe(gulp.dest('dest'));
});

gulp.task('js-watch', ['js'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('css-watch', ['css'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('image-watch', ['images'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('html-watch', ['html'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('font-watch', ['font'], function(done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['js', 'css', 'images', 'font', 'html'], function() {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "dest"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("src/js/*.js", ['js-watch']);
    gulp.watch("src/css/**/*.css", ['css-watch']);
    gulp.watch("src/images/**/*", ['image-watch']);
    gulp.watch("src/fonts/**/*", ['font-watch']);
    gulp.watch("src/*.html", ['html-watch']);
});