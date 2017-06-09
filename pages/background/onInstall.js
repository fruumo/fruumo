chrome.runtime.onInstalled.addListener(function(){
	//Refresh wallpaper alarm (every hour)
	chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
	chrome.alarms.create("refresh-weather", {when:Date.now()+1000, periodInMinutes:60});

});
