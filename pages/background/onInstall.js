chrome.runtime.onInstalled.addListener(function(){
	//Refresh wallpaper alarm (every hour)
	chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
	chrome.alarms.create("refresh-weather", {when:Date.now()+1000, periodInMinutes:10});

	//Defaults
	localStorage.searchDomain = "https://www.google.ca/search?q="

	chrome.storage.sync.get("settingsReset", function(s){
		if(s.settingsReset == undefined || s.settingsReset){
			resetSettings();
		}
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

});

function resetSettings(){
	chrome.storage.sync.set({settingsReset:false});
	chrome.storage.sync.set({settingDisplayTopsites:true});
	chrome.storage.sync.set({settingFocus:false});
	chrome.storage.sync.set({settingIs24h:true});
	localStorage.searchDomain = "https://www.google.ca/search?q=";
	chrome.storage.sync.set({screenshots:{}})
	chrome.storage.sync.set({bannedTopsites:[]});

	console.log("Resetting settings!");
}