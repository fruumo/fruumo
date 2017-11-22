module.exports = {
	name:"omnibar-focus-manager",
	onload: function(){
		chrome.tabs.onCreated.addListener(function(tab){
			if(localStorage.defaultSearchBar == "chrome"){
				return;
			}
			if(tab.url.indexOf("chrome://newtab") != -1){
				chrome.tabs.create({
					windowId: tab.windowId,
					active:true,
					url:'./pages/index/index.html'
				});
				chrome.tabs.remove(tab.id);
			}
		});
	}
}