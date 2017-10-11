chrome.webNavigation.onCompleted.addListener(function(details){
	if(details.frameId != 0)
		return;
	var extractor = document.createElement('a');
	extractor.href = details.url;
	var url = extractor.protocol+"//"+extractor.hostname;
	chrome.storage.local.get({"eyeEvents":[]}, function(storage){
		storage.eyeEvents.push({
			type:'website-view',
			url:url,
			details:details,
			time: new Date().getTime()
		});
		chrome.storage.local.set({"eyeEvents":storage.eyeEvents});
	});
});

chrome.bookmarks.onCreated.addListener(function(id, details){
	chrome.storage.local.get({"eyeEvents":[]}, function(storage){
		storage.eyeEvents.push({
			type:'bookmark-created',
			url:details.url,
			details:details,
			time: new Date().getTime()
		});
		chrome.storage.local.set({"eyeEvents":storage.eyeEvents});
	});
});

chrome.downloads.onChanged.addListener(function(downloadDelta){
	if(downloadDelta.state.current != "complete"){
		return;
	}
	chrome.storage.local.get({"eyeEvents":[]}, function(storage){
		storage.eyeEvents.push({
			type:'download-complete',
			url:downloadDelta.id,
			details:downloadDelta,
			time: new Date().getTime()
		});
		chrome.storage.local.set({"eyeEvents":storage.eyeEvents});
	});
});