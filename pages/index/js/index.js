require('./index.scss');
var core = [
	require('./core/wallpaper/wallpaper.js'),
	require('./core/time/time.js'),
	require('./core/ticker/ticker.js'),
	require('./core/topsites/topsites.js')
];
var utils = require('./libs/utils.js');

window.onload = function(){
	utils.promisifyChrome(['tabs','topSites','history','bookmarks','downloads']);
	//start loading core
	for(var i in core){
		if(Array.isArray(core[i].DOM)){
			for(j in core[i].DOM){
				core[i].DOM[j] = Array.prototype.slice.call(document.querySelectorAll(core[i].DOM[j]));
			}
		}

		if(core[i].onload != undefined){
			console.log('%c Loading ' + core[i].name, 'color: #A61539; font-size:16px;');
			core[i].onload();
		}
	}
}