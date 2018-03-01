

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var pump = require('pump')

var gutil = require('gulp-util');


// 压缩脚本
gulp.task('script', function (cb) {
    gulp.src(['src/config.js', "src/analytics.js", "src/tracker/*.js"])
        .pipe(concat('analytics.js'))
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['script']);