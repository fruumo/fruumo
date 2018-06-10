require('../css/animate.scss');
require('./index.scss');
var core = [
require('./core/focus/focus.js'),
require('./core/wallpaper/wallpaper.js'),
require('./core/time/time.js'),
require('./core/ticker/ticker.js'),
require('./core/topsites/topsites.js'),
require('./core/search/search.js'),
require('./core/statusbar/statusbar.js'),
require('./core/search-placeholder/placeholder.js'),
require('./core/weather-display/index.js'),
require('./core/preloader/preload.js'),
require('./core/eye/index.js'),
require('./core/animation-handler/animation-handler.js'),
];
var utils = require('./libs/utils.js');
window.appVersion = chrome.app.getDetails().version;
var oldPlaceholder = "";
window.fruumo = {};

window.onblur = function(){
	if(localStorage.defaultSearchBar != "chrome"){
		document.getElementsByClassName('search-bar')[0].placeholder="";
		searchBarTyper.start();
		if(Math.random() > 0.7){
			document.getElementsByClassName('inner-container')[0].className = "inner-container animated shake";
			setTimeout(function(){
				document.getElementsByClassName('inner-container')[0].className = "inner-container";
			},900);
		}
	}
};
window.onfocus = function(){
	if(localStorage.defaultSearchBar != "chrome"){
		searchBarTyper.stop();
		document.getElementsByClassName('search-bar')[0].placeholder = oldPlaceholder;
	}
}

window.onload = function(){
	if(!localStorage.searchDomain){
		localStorage.searchDomain = "https://www.google.com/search?q=";
	}
	oldPlaceholder = document.getElementsByClassName('search-bar')[0].placeholder + "";
	document.getElementsByClassName("search-container")[0].style.display = "flex";
	//Redirect user if name is not set.
	if(localStorage.username == undefined){
		window.top.location = "../onInstall/index.html";
		return;
	}

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
	if(localStorage.noAnalytics != "true"){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
	} else {
		window.ga = function(...args){console.log("Supressing analytics - ", args);}
	}
	ga('create', 'UA-101959257-1', 'auto');
	ga('set', 'checkProtocolTask', function(){});
	ga('send', 'pageview');
	ga('send', 'event', 'Fruumo', 'load', appVersion);
	//Log page load time
	setTimeout(function(){
		var loadTime = window.performance.timing.domInteractive- window.performance.timing.navigationStart;
		document.getElementById('loadtime').innerText = "Loaded in " + loadTime+'ms';
		console.log('%c Load Time -  ' + loadTime + 'ms', 'color: blue; font-size:16px;');
		ga('send', 'timing', "DOMInteractive", "Ready", loadTime, appVersion);
	},1000);

	//Setup tutorial
	if(localStorage.intro != "true"){
		setTimeout(function(){	
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
			/*{
				element: document.getElementsByClassName('topsite')[0],
				intro: "These are all your most visited websites, this list will change the more you browse the web! The images may look like white boxes right now, but they will eventually be AUTOMATICALLY replaced with images of those websites!",
				position: 'top'
			},*/
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

	setTimeout(() => {
		if(document.activeElement.className != 'search-bar') {
			document.getElementsByClassName('search-bar')[0].focus();
		}
	}, 80);
	//Setup localization
	//document.getElementsByClassName('search-bar')[0].placeholder = chrome.i18n.getMessage("search");
}