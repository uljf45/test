var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var csso = require('gulp-csso');
var del = require('del');
// 静态服务器
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("scss/*.scss", ['sass']);
    gulp.watch("jsall/*.js", ['rev']);
    gulp.watch("./*.html").on('change', reload);
});

gulp.task('jsmin', function(){
   return gulp.src(['jsall/*.js'])
        .pipe(uglify())
        // .pipe(gulp.dest('./js'))
        .pipe(rev())
        .pipe(gulp.dest('./js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});

gulp.task('rev',['jsmin'], function(){
    return gulp.src(['./rev/**/*.json', './*.html'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(reload( {stream:true} ) );;
});


gulp.task('sass', function(){
	return gulp.src("./scss/*.scss")
		.pipe(sass())
                        .pipe(csso())
		.pipe(gulp.dest("./css"))
		.pipe(reload( {stream:true} ) );
});

gulp.task("default", ["serve"]);

// 代理
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://qiyewow.cn"
    });
});