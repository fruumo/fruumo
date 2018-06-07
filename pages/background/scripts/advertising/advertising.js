module.exports = {
	name:'advertising-manager',
	onload: function(){
		chrome.alarms.onAlarm.addListener((alarm)=>{
			if(alarm.name != "refresh-advertising" ){
				return;
			}
			this.refreshAdvertising();
		});

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.type != "refresh-advertising"){
				return;
			}
			this.refreshAdvertising();	
		});
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