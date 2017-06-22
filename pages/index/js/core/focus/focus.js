var mousetrap = require('mousetrap');

module.exports = {
	name:'focus-mode',
	DOM:['.topsites-container','.search-container', '.time-container','.ticker-container'],
	preload: function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get("settingFocus", function(storage){

				if(storage.settingFocus){
					this.DOM[3][0].className += " focus";
					this.DOM[2][0].className += " focus";
					this.DOM[1][0].className += " focus";
					this.DOM[0][0].className += " focus";
				}

				//dynamic settings
				chrome.storage.onChanged.addListener(function(changes, area){
					if(area != "sync")
						return;
					if(!changes.settingFocus)
						return;
					if(changes.settingFocus.newValue == undefined)
						return;
					if(changes.settingFocus.newValue){
						this.DOM[0][0].className += " focus";
						this.DOM[1][0].className += " focus";
						this.DOM[2][0].className += " focus";
						this.DOM[3][0].className += " focus";
					} else {
						this.DOM[3][0].className = this.DOM[3][0].className.replace(" focus", "");
						this.DOM[2][0].className = this.DOM[2][0].className.replace(" focus", "");
						this.DOM[1][0].className = this.DOM[1][0].className.replace(" focus", "");
						this.DOM[0][0].className = this.DOM[0][0].className.replace(" focus", "");
					}
				}.bind(this));

				mousetrap.bind('alt+f', function(e){
					chrome.storage.sync.get("settingFocus", function(storage){
						if(storage.settingFocus){
							chrome.storage.sync.set({"settingFocus":false});
						} else {
							chrome.storage.sync.set({"settingFocus":true});
						}
					});
				}, 'keydown');


				resolve(true);
			}.bind(this));
		}.bind(this));
	},
};