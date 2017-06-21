require('./index.scss');
var core = [
	require('./core/wallpaper/wallpaper.js'),
	require('./core/time/time.js'),
	require('./core/ticker/ticker.js'),
	require('./core/topsites/topsites.js'),
	require('./core/search/search.js'),
	require('./core/statusbar/statusbar.js')
];
var utils = require('./libs/utils.js');

window.onload = function(){
	utils.promisifyChrome(['tabs','topSites','history','bookmarks','downloads','management']);
	//start loading core
	var preloads = [];
	for(var i in core){
		if(Array.isArray(core[i].DOM)){
			for(j in core[i].DOM){
				core[i].DOM[j] = Array.prototype.slice.call(document.querySelectorAll(core[i].DOM[j]));
			}
		}
		if(core[i].preload){
			preloads.push(core[i].preload.bind(core[i]).call());
		}
	}
	//Preload first.
	Promise.all(preloads).then(function(){
		for(var i in core){
			if(core[i].onload != undefined){
				console.log('%c Loading ' + core[i].name, 'color: #A61539; font-size:16px;');
				core[i].onload();
			}	
		}	
	});
	//Log page load time
	setTimeout(function(){
		var loadTime = window.performance.timing.domInteractive- window.performance.timing.navigationStart;
		document.getElementById('loadtime').innerText = "Loaded in " + loadTime+'ms';
		console.log('%c Load Time -  ' + loadTime + 'ms', 'color: blue; font-size:16px;');
	},5000);
}