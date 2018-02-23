module.exports = {
	name:'advertising-manager',
	onload: function(){
		chrome.alarms.onAlarm.addListener(function(alarm){
			if(alarm.name != "refresh-advertising" ){
				return;
			}
			this.refreshAdvertising();
		}.bind(this));

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if (request.type != "refresh-advertising"){
				return;
			}
			this.refreshAdvertising();	
		}.bind(this));
	},
	refreshAdvertising: function(){
		fetch("https://fruumo.com/advertising/advertising.json?r="+Math.random())
		.then(function(response){
			if(response.ok)
				return response.json();
		})
		.then(function(data){
			chrome.storage.local.set({advertising:data});
		});
	}
}