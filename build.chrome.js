/* Gulpfile for chrome */
var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var jsmin = require('gulp-jsmin');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-dest-clean');
var bump = require('gulp-bump');
var zip = require('gulp-zip');
var exec = require('child_process').exec;
var fs = require('fs');
var rename = require("gulp-rename");

function existsSync(filename) {
  try {
    fs.accessSync(filename);
    return true;
  } catch(ex) {
    return false;
  }
}

gulp.task('bump:major', function(){
  return gulp.src(['./manifest.chrome.json','./manifest.firefox.json','./package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  return gulp.src(['./manifest.chrome.json','./manifest.firefox.json','./package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});
gulp.task('bump:patch', function(){
  return gulp.src(['./manifest.chrome.json','./manifest.firefox.json','./package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

var version = require("./manifest.json");
version = version.version;
if(existsSync('../fruumo3-build/'+version+'.zip')){
	console.error("\033[1;31mIt seems this version ("+version+") already has a build.\n Please Bump the version, or remove the build zip file from the builds folder.\033[0m");
	gulp.task('default', [], function(cb) {cb();});
	return;
}

gulp.task('clean-scripts', function () {
	return gulp.src("../fruumo3-build/build", {read: false})
	.pipe(clean("../fruumo3-build/build",null,{force:true}))
	.pipe(gulp.dest("../fruumo3-build/build"));
});

gulp.task('webpack', function (cb) {
	exec('webpack', function (err, stdout, stderr) {
    console.log(stderr);
    cb(err);
  });
});

gulp.task('movefiles', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src(['manifest.json', '_locales/**', 'pages/index/*.html','pages/index/css/**', 'pages/index/js/libs/*', 'pages/settings/index.html', 'pages/onInstall/index.html', 'pages/updated/index.html'] ,{base: './'})
	.pipe(gulpCopy('../fruumo3-build/build', {}));
});

gulp.task('minifyImages', ['clean-scripts', 'webpack'], function(cb){
	return 	gulp.src(['images/*'], {base:'./'})
	.pipe(imagemin())
	.pipe(gulp.dest('../fruumo3-build/build'));
});

gulp.task('minifyCss', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src([ 'dist/*.css'],{base: './'})
	.pipe(cleanCSS())
	.pipe(gulp.dest('../fruumo3-build/build'));
});

gulp.task('minifyJs', ['clean-scripts', 'webpack'], function(cb){
	return gulp.src(['pages/background/*.js','dist/*.js'], {base: './'})
	.pipe(jsmin())
	.pipe(gulp.dest('../fruumo3-build/build'));
});

gulp.task('build',['movefiles','minifyImages','minifyCss','minifyJs'], function(cb){
	console.log("Build Completed!");
	cb();
});

gulp.task('compress',['build'], function(cb){
	return gulp.src('../fruumo3-build/build/**/*')
        .pipe(zip(version+'.chrome.zip'))
        .pipe(gulp.dest('../fruumo3-build/'));
});

gulp.task('default', ['build','compress'], function(cb) {cb();});

