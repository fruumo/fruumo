window.appVersion = chrome.app.getDetails().version;
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-101959257-1', 'auto');
ga('set', 'checkProtocolTask', function(){});

chrome.runtime.onInstalled.addListener(function(details){
	//Google Analytics
	if(details.reason == "install")
  		ga('send', 'event', 'Fruumo', 'install', appVersion);

	//Refresh wallpaper and weather alarm (every hour)
	chrome.alarms.create("refresh-wallpaper", {periodInMinutes:60});
	chrome.alarms.create("refresh-weather", {periodInMinutes:10});
	chrome.alarms.create("check-updates", {periodInMinutes:120});

	refreshWallpaper();
	refreshWeather();
	
	chrome.runtime.setUninstallURL("http://fruumo.com/uninstall", function(){});
	//Defaults
	chrome.storage.sync.get("settingsReset", function(s){
		if(s.settingsReset == undefined || s.settingsReset){
			resetSettings();
		}
	});
});


chrome.storage.onChanged.addListener(function(changes, area){
	if(area != "sync")
		return;
	if(!changes.settingsReset)
		return;
	if(changes.settingsReset.newValue == undefined)
		return;
	if(changes.settingsReset.newValue){
		resetSettings();
	} else {
	}
}.bind(resetSettings));

function resetSettings(){
	chrome.storage.sync.set({settingsReset:false});
	chrome.storage.sync.set({settingDisplayTopsites:false});
	chrome.storage.sync.set({settingFocus:false});
	chrome.storage.sync.set({settingIs24h:true});
	chrome.storage.sync.set({settingMetric:true});
	chrome.storage.sync.set({largeTopsites:false});
	chrome.storage.sync.set({timeVisible:true});
	chrome.storage.sync.set({searchVisible:true});

	localStorage.searchDomain = "http://www.blpsearch.com/search?sid=695&aid=090&src=hmp&p=";
	localStorage.defaultSearchBar = "fruumo";
	localStorage.smartDomain = "true";
	chrome.storage.sync.set({bannedTopsites:[]});
	chrome.storage.sync.set({settingAutohideStatusbar:false});

	chrome.storage.local.remove("screenshots");
	chrome.storage.local.remove("customWeather");
	chrome.storage.local.remove("settingCustomWallpaper");
	chrome.storage.local.remove("searchDb");

	localStorage.intro = "false";
	delete localStorage.username;

	chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
	chrome.alarms.create("refresh-weather", {when:Date.now()+1000, periodInMinutes:10});
	console.log("Resetting settings!");
}