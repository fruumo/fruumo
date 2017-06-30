chrome.browserAction.onClicked.addListener(function(t){
	chrome.tabs.create({
		url:"chrome://newtab",
		selected:true
	})
});