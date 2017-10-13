var preloadData = {
	defaultUrl:"https://fruumo.com/preload",
	windowId: -10,
	preloaded:{

	}
};

chrome.runtime.onMessage.addListener(function(request, sender, response){
	if(request.type != "preload-url"){
		return;
	}
	preparePreloader(function(id){
		if(preloadData.preloaded[request.data.url]){
			return;
		}
		chrome.tabs.create({
			windowId:preloadData.windowId,
			url:request.data.url
		}, function(tab){
			var tabId = tab.id;
			preloadData.preloaded[request.data.url] = {
				id:tabId,
				timeout: setTimeout(function(info){
					chrome.tabs.remove(info.tabId);
					delete preloadData.preloaded[info.url];
				},4000,{tabId:tabId, url:request.data.url})
			}
		});
	});

});

chrome.runtime.onMessage.addListener(function(request, sender, response){
	if(request.type != "visit-url"){
		return;
	}
	var preloadInfo = preloadData.preloaded[request.data.url];
	if(!preloadInfo){
		response({type:'not-preloaded'});
		return;
	}
	clearTimeout(preloadInfo.timeout);
	chrome.tabs.move(preloadInfo.id,{
		windowId:sender.tab.windowId,
		index:sender.tab.index
	}, function(tab){
		chrome.tabs.update(tab.id, {active:true})
		for(var i in preloadData.preloaded){
			chrome.tabs.remove(preloadData.preloaded[i].tabId);
			delete preloadData.preloaded[i];
		}
	});
	chrome.tabs.remove(sender.tab.id);
	delete preloadData.preloaded[request.data.url];
});

function preparePreloader(cb){
	if(!cb){
		cb = function(){};
	}
	chrome.windows.getAll({populate:true}, function(windows){
		for(var i in windows){
			if(windows[i].id == preloadData.windowId){
				cb(preloadData.windowId);
				return;
			}
			for(var tab of windows[i].tabs){
				if(tab.url == preloadData.defaultUrl){
					preloadData.windowId = windows[i].id;
					cb(windows[i].id);
					return;
				}
			}
		}
		chrome.windows.create({
			url:preloadData.defaultUrl,
			state:'minimized'
		}, function(window){
			preloadData.windowId = window.id;
			cb(window.id);
		});
	});
}

