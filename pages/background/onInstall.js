chrome.runtime.onInstalled.addListener(function(){
	//Refresh wallpaper alarm (every hour)
	chrome.alarms.create("refresh-wallpaper", {when:Date.now(), periodInMinutes:60});
});
