chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type != "screenshot"){
    	return;
    }
    var parser = document.createElement('a');
	parser.href =request.data.url;
    chrome.webNavigation.onCompleted.addListener(screenshot, {
    	url:[{hostContains:parser.hostname+""}]
    });

	function screenshot(details){
		var resetTime = 86400000;
		if(details.frameId != 0)
			return;
		chrome.storage.local.get({"screenshots":{}}, function(storage){
			if(storage.screenshots[request.data.url] && new Date().getTime() - storage.screenshots[request.data.url].timestamp < resetTime){
				return;
			}
			chrome.tabs.get(details.tabId, function(tab){
				chrome.tabs.captureVisibleTab(tab.windowId, 
				{format:"jpeg",quality:80}, function(image){
					
					function resizeImage(url, width, height, callback) {
						var sourceImage = new Image();
						sourceImage.onload = function() {
							// Create a canvas with the desired dimensions
							var canvas = document.createElement("canvas");
							width = (sourceImage.width/sourceImage.height)*height;

							canvas.width = width;
							canvas.height =height;
							// Scale and draw the source image to the canvas
							canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
							// Convert the canvas to a data URL in PNG format
							callback(canvas.toDataURL());
						}
						sourceImage.src = url;
					}
					console.log("Capturing image for " + details.url);
					resizeImage(image, 100,400, function(resized){
						storage.screenshots[request.data.url] ={};
						storage.screenshots[request.data.url].image = resized;
						storage.screenshots[request.data.url].timestamp = new Date().getTime();
						chrome.storage.local.set(storage);
						sendResponse();
					});
				});
			});
		});
		chrome.webNavigation.onCompleted.removeListener(screenshot);
	}
});