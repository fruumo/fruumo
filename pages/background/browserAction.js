chrome.browserAction.onClicked.addListener(function(t){
	chrome.tabs.create({
		url:"./pages/index/index.html",
		selected:true
	})
});