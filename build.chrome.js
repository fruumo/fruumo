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
var version = require("./manifest.json");

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

gulp.task('clean-scripts', function () {
	return gulp.src("../fruumo3-build/build", {read: false})
	.pipe(clean("../fruumo3-build/build",null,{force:true}))
	.pipe(gulp.dest("../fruumo3-build/build"));
});

gulp.task('movefiles', gulp.series('clean-scripts', function(cb){
	return gulp.src(['manifest.json', '_locales/**', 'pages/index/*.html','pages/index/css/**', 'pages/index/js/libs/*', 'pages/settings/index.html', 'pages/onInstall/index.html', 'pages/updated/index.html','pages/background/index.html'] ,{base: './'})
	.pipe(gulpCopy('../fruumo3-build/build', {}));
}));

gulp.task('minifyImages', gulp.series('movefiles', function(cb){
	return 	gulp.src(['images/*'], {base:'./'})
	.pipe(imagemin())
	.pipe(gulp.dest('../fruumo3-build/build'));
}));

gulp.task('minifyCss', gulp.series('minifyImages', function(cb){
	return gulp.src([ 'dist/*.css'],{base: './'})
	.pipe(cleanCSS())
	.pipe(gulp.dest('../fruumo3-build/build'));
}));

gulp.task('minifyJs', gulp.series('minifyCss', function(cb){
	return gulp.src(['dist/*.js'], {base: './'})
	.pipe(jsmin())
	.pipe(gulp.dest('../fruumo3-build/build'));
}));

gulp.task('build',gulp.series('minifyJs', function(cb){
	console.log("Build Completed!");
	cb();
}));

gulp.task('compress',gulp.series('build', function(cb){
	return gulp.src('../fruumo3-build/build/**/*')
        .pipe(zip(version+'.chrome.zip'))
        .pipe(gulp.dest('../fruumo3-build/'));
}));

gulp.task('default', gulp.series(
	(cb)=>{ 
		version = version.version;
		console.log('checking');
		if(existsSync('../fruumo3-build/'+version+'.chrome.zip')){
			console.error("\033[1;31mIt seems this version ("+version+") already has a build.\n Please Bump the version, or remove the build zip file from the builds folder.\033[0m");
			process.exit();
			return;
		}
		cb();
},
'compress', 
function(cb) {cb();}));

