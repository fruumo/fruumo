module.exports = {
	name:'animation-disabler',
	DOM:[],
	styleElem:undefined,
	preload:function(){
		return new Promise(function(resolve, reject){
			this.styleElem = document.createElement('style');
			this.styleElem.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(this.styleElem);
			resolve();
			chrome.storage.sync.get({'disableAnimations':false}, function(storage){
				if(storage.disableAnimations == undefined){
					storage = {};
					storage.disableAnimations = false;
				}
				if(storage.disableAnimations == true){
					this.styleElem.innerHTML = '.time-container, .ticker-container, .topsites-container, .search-container, .search-container *{transition:none !important;}';
				}
			}.bind(this));

			 chrome.storage.onChanged.addListener(function(changes, namespace) {
        		if(namespace != "sync" || changes.disableAnimations == undefined){
        			return;
        		}
        		if(changes.disableAnimations.newValue == true){
					this.styleElem.innerHTML = '.time-container, .ticker-container, .topsites-container, .search-container,  .search-container * {transition:none !important;}';
        		} else {
        			this.styleElem.innerHTML = '';
        		}
      		}.bind(this));
		}.bind(this));
	}
};