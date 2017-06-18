chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(!localStorage.allTabs){
		localStorage.allTabs = "{}";
	}
	var tabs = JSON.parse(localStorage.allTabs);
	if(changeInfo.discarded || changeInfo.autoDiscardable){
		return;
	}
	if(tab.url.indexOf("chrome://") != -1 || tab.url.indexOf("chrome-extension://") != -1)
		return;
	if(tabs[tab.id]){
		if(tabs[tab.id].url == tab.url && tabs[tab.id].title == tab.title && tabs[tab.id].faviconUrl == tab.favIconUrl){
			return;
		}
	}
	tabs[tab.id] = {};
	if(tab.title)
		tabs[tab.id].title = tab.title;
	if(tab.url)
		tabs[tab.id].url = tab.url;
	if(tab.favIconUrl)
		tabs[tab.id].faviconUrl = tab.favIconUrl;

	localStorage.allTabs = JSON.stringify(tabs);
});

chrome.tabs.onRemoved.addListener(function(tabid){
	if(!localStorage.allTabs){
		localStorage.allTabs = "{}";
	}
	if(!localStorage.recentlyRemovedTabs){
		localStorage.recentlyRemovedTabs = "[]";
	}
	var recentlyRemovedTabs = JSON.parse(localStorage.recentlyRemovedTabs);
	var tabs = JSON.parse(localStorage.allTabs);
	if(!tabs[tabid])
		return;

	recentlyRemovedTabs.push(tabs[tabid]);
	if(recentlyRemovedTabs.length > 10){
		recentlyRemovedTabs.splice(0,recentlyRemovedTabs.length-9);
	}
	delete tabs[tabid];
	localStorage.recentlyRemovedTabs = JSON.stringify(recentlyRemovedTabs);
});

chrome.runtime.onStartup.addListener(function(){
	localStorage.allTabs = "{}";
});

chrome.runtime.onInstalled.addListener(function(){
	setTimeout(function(){
		localStorage.allTabs = "{}";
		localStorage.recentlyRemovedTabs = "[]";
		var tabs = {};
		chrome.tabs.query({},function(allTabs){
			for(var i in allTabs){
				var tab = allTabs[i];
				if(!tab.title || !tab.url)
					continue;
				if(tab.url.indexOf("chrome://") != -1 || tab.url.indexOf("chrome-extension://") != -1)
					continue;;
				if(tabs[tab.id]){
					if(tabs[tab.id].url == tab.url || tabs[tab.id].title == tab.title){
						continue;
					}
				}
				tabs[tab.id] = {};
				if(tab.title)
					tabs[tab.id].title = tab.title;
				if(tab.url)
					tabs[tab.id].url = tab.url;
				if(tab.favIconUrl)
					tabs[tab.id].faviconUrl = tab.favIconUrl;
			}
			localStorage.allTabs = JSON.stringify(tabs);
		});
	},500);
});
