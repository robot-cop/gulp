var gulp = require('gulp'),
	concat = require('gulp-concat'), //- 多个文件合并为一个；  
	ugLify = require('gulp-uglify'), //压缩js  
	changed = require('gulp-changed'), //检查改变状态  
	browserSync = require("browser-sync").create(); //浏览器实时刷新  
var $ = require('gulp-load-plugins')();

//压缩html  
gulp.task('html', function() {
	var options = {
		removeComments: true, //清除HTML注释  
		collapseWhitespace: true, //压缩HTML  
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />  
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />  
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"  
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"  
		minifyJS: true, //压缩页面JS  
		minifyCSS: true //压缩页面CSS  
	};
	gulp.src('src/**/*.html')
		.pipe(changed('dist', { hasChanged: changed.compareSha1Digest }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }));
});
//

//
//压缩js  
gulp.task("script", function() {
	gulp.src(['src/**/*.js'])
		.pipe($.plumber())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(changed('dist', { hasChanged: changed.compareSha1Digest }))
		.pipe(ugLify())	
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }));
});

//启动热更新  http://localhost:2016/html/pages/home/index.html
gulp.task('serve', function() {
	gulp.start('script');
	browserSync.init({
		browser: 'chrome',
		proxy: 'http://localhost:8088'
	});
	
	gulp.watch('src/**/*.js', ['script']); //监控文件变化，自动更新  

	gulp.watch('src/**/*.html', ['html']);
});

gulp.task('default', ['serve']);
