chrome.alarms.onAlarm.addListener(function(alarm){
	if(alarm.name != "check-notifications" ){
		return;
	}
	checkNotifications();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type != "check-notifications"){
		return;
	}
	checkNotifications();
});

function checkNotifications(time){
	getInstallTime().then(function(installTime){
		getCurrentServerTime().then(function(currentTime){
			
		});
	});
}

function getInstallTime(){
	return new Promise(function(resolve, reject){
		chrome.storage.local.get({'installTime':0}, function(storage){
			if(storage.installTime != 0){
				resolve(storage.installTime);
			}
			getCurrentServerTime().then(function(time){
				chrome.storage.local.set({'installTime':time});
				resolve(time);
			});
		});
	});
}

function getCurrentServerTime(){
	return new Promise(function(resolve, reject){
		fetch("http://api.fruumo.com/time")
		.then(function(response){
			if(response.ok)
				return response.json();
		})
		.then(function(json){
			resolve(json.time)	
		})
		.catch(function(err){
				console.log("Unable to get time!", err);
		});
	});
}