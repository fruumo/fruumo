chrome.runtime.onUpdateAvailable.addListener(function(details){

	//force update of extension
	chrome.runtime.reload();
});

chrome.alarms.onAlarm.addListener(function(alarm){
	if(alarm.name != "check-updates" ){
		return;
	}
	checkForUpdates(function(latestVersion, currentVersion, v){});
});

chrome.runtime.onInstalled.addListener(function(details){
  	if(details.reason != "update"){
  		return;
  	}
	ga('send', 'event', 'Fruumo', 'update', appVersion);
	ga('send', 'event', 'Fruumo', 'update-from-previous-version', details.previousVersion);
	localStorage.updateScreen = appVersion;
	checkForUpdates(function(latestv, currentv, v){
		if(!v.updateStrings[appVersion]){console.log("No update features!"); return;}
		localStorage.updateScreen = JSON.stringify(v.updateStrings[appVersion]);
		chrome.windows.create({
			url:'../pages/updated/index.html',
			focused:true,
			state:'maximized'
		});
	});
});

function checkForUpdates(callback){
	console.log("Checking for updates...");
	fetch("http://fruumo.com/version/version.json?rnd="+Math.random())
	.then(function(response){
		if(response.ok)
			return response.json();	
	})
	.then(function(version){
		if(parseInt(version.latestVersion.replace(/\./g, "")) > parseInt(appVersion.replace(/\./g, ""))){
			console.log("Update available " + version.latestVersion);
			chrome.runtime.requestUpdateCheck(function(status){
				if(status == "update_available")
					chrome.runtime.reload();
			});
			return;
		}
		console.log("No updates");
		callback(version.latestVersion, appVersion, version);
	});
}