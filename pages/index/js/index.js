require('./index.scss');
var core = [
require('./core/focus/focus.js'),
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
	setTimeout(function(){
		if(localStorage.intro == "true"){
			return;
		}
		var intro = introJs();
		intro.addSteps([{
			element: document.querySelectorAll('.search-bar')[0],
			intro: "Thanks for installing fruumo! Let's walk you through how this works.",
			position: 'right'
		},
		{
			element: document.querySelectorAll('.search-bar')[0],
			intro: "This is the all powerful fruumo search bar. You can search the web, your bookmarks, your applications, your downloads and more!",
			position: 'bottom'
		},
		{
			element: document.getElementsByClassName('topsite')[0],
			intro: "These are all your most visited websites, this list will change the more you browse the web! The images may look like white boxes right now, but they will eventually be AUTOMATICALLY replaced with images of those websites!",
			position: 'top'
		},
		{
			element: document.getElementsByClassName('ticker')[0],
			intro: "This is the fruumo ticker, it shows you the date and the current weather condition of your location. The location can be changed in the settings.",
			position: 'top'
		},
		{
			element: document.getElementsByClassName('statusbar')[0],
			intro: "This is the menu. You can view your downloads, apps and recently closed tabs from here. You can also access the settings page from here.",
			position: 'bottom'
		}
		]);
		intro.oncomplete(function() {
  			localStorage.intro = "true";
		});
		intro.onexit(function(){
			localStorage.intro = "true";
		});
		intro.start();

	},500);
}