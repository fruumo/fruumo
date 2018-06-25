var mousetrap = require('mousetrap');

module.exports = {
	name:'focus-mode',
	DOM:['.topsites-container','.search-container', '.time-container','.ticker-container','.container'],
	preload: function(){
		return new Promise((resolve, reject) => {
			chrome.storage.sync.get("settingFocus",	(storage) => {

				if(storage.settingFocus){
					this.DOM[3][0].classList.add("focus");
					this.DOM[2][0].classList.add("focus");
					this.DOM[1][0].classList.add("focus");
					this.DOM[0][0].classList.add("focus");
				}

				//dynamic settings
				chrome.storage.onChanged.addListener((changes, area) => {
					if(area != "sync")
						return;
					if(!changes.settingFocus)
						return;
					if(changes.settingFocus.newValue == undefined)
						return;
					if(changes.settingFocus.newValue){
						this.DOM[4][0].style.opacity = "0";
						setTimeout(() => {
							this.DOM[3][0].classList.add("focus");
							this.DOM[2][0].classList.add("focus");
							this.DOM[1][0].classList.add("focus");
							this.DOM[0][0].classList.add("focus");
							this.DOM[4][0].style.opacity = "1";
						},300);
					} else {
						this.DOM[4][0].style.opacity = "0";
						setTimeout(() => {
							this.DOM[3][0].classList.remove("focus");
							this.DOM[2][0].classList.remove("focus");
							this.DOM[1][0].classList.remove("focus");
							this.DOM[0][0].classList.remove("focus");
							this.DOM[4][0].style.opacity = "1";
						},300);
					}
				});

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
			});
		});
	},
};