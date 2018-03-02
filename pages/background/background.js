var requiredFiles = [
	//require("./scripts/autocomplete/autocomplete.js"),
	require("./scripts/browserAction/browserAction.js"),
	require("./scripts/focus/fruumoFocus.js"),
	require("./scripts/notifications/notifications.js"),
	require("./scripts/onInstall/onInstall.js"),
	require("./scripts/quote/quote.js"),
	require("./scripts/advertising/advertising.js"),
	require("./scripts/screenshot/screenshot.js"),
	require("./scripts/updates/updates.js"),
	require("./scripts/wallpaper/wallpaper.js"),
	require("./scripts/weather/weather.js"),
	require("./scripts/search-engine/search.js")
];
// 
// 	
// 	
// 	
// 	
// 	require("./scripts/screenshot/screenshot.js"),
// 	require("./scripts/updates/updates.js"),
// 	require("./scripts/wallpaper/wallpaper.js"),
// 	require("./scripts/weather/weather.js")
// console.log('test');
// console.log(requiredFiles);
// window.test = "test";
window.appVersion = chrome.app.getDetails().version;
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-101959257-1', 'auto');
ga('set', 'checkProtocolTask', function(){});
window.plugins = {};

for(var i in requiredFiles){
	console.log("Loading " + requiredFiles[i].name);
	window.plugins[requiredFiles[i].name] = requiredFiles[i];
	window.plugins[requiredFiles[i].name].onload();
}
setupAlarms();