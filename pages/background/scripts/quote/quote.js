module.exports = {
	name:'quote-manager',
	onload: function(){
		chrome.alarms.onAlarm.addListener(function(alarm){
			if(alarm.name != "refresh-quote" ){
				return;
			}
			this.refreshQuote();
		}.bind(this));

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if (request.type != "refresh-quote"){
				return;
			}
			this.refreshQuote();	
		}.bind(this));
	},
	refreshQuote: function(){
		fetch("http://api.fruumo.com/quote/?r="+Math.random())
		.then(function(response){
			if(response.ok)
				return response.json();
		})
		.then(function(data){
			console.log(data.quote.trim());
			chrome.storage.local.set({quote:data.quote.trim()});
		});
	}
}