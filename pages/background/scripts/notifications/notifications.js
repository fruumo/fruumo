module.exports = {
	name:'notification-manager',
	onload:function(){

		chrome.alarms.onAlarm.addListener(function(alarm){
			if(alarm.name != "check-notifications" ){
				return;
			}
			this.checkNotifications();
		}.bind(this));

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if (request.type != "check-notifications"){
				return;
			}
			this.checkNotifications();
		}.bind(this));
	},
	checkNotifications:function (time){
		this.getInstallTime().then(function(installTime){
			this.getCurrentServerTime().then(function(currentTime){

			});
		}.bind(this));
	},
	getInstallTime:function(){
		return new Promise(function(resolve, reject){
			chrome.storage.local.get({'installTime':0}, function(storage){
				if(storage.installTime != 0){
					resolve(storage.installTime);
				}
				this.getCurrentServerTime().then(function(time){
					chrome.storage.local.set({'installTime':time});
					resolve(time);
				});
			}.bind(this));
		}.bind(this));
	},
	getCurrentServerTime:function(){
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
}