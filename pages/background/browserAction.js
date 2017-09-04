chrome.browserAction.onClicked.addListener(function(t){
	chrome.tabs.create({
		url:"./pages/index/index.html",
		selected:true
	});
	chrome.browserAction.getBadgeText({}, function(text){
		if(text == "NEW"){
			chrome.browserAction.setBadgeText({
				text:''
			});
			chrome.windows.create({
				url:'../pages/updated/index.html',
				focused:true,
				state:'maximized'
			});
		}
	});
});