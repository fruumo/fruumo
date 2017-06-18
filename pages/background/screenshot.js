chrome.webNavigation.onCompleted.addListener(function(details){
	if(details.frameId != 0)
		return;
	if(localStorage.screenshotUrl == "no-url")
		return;
	chrome.tabs.query({active:true}, function(tab){
		if(!tab[0]) return;
		for(var i=0;i<=tab.length; i++){
			if(tab[i].id == details.tabId)
				tab = tab[i];
		}
		if(Array.isArray(tab)){
			console.log(details.tabId,tab);
			return;
		}
		chrome.storage.local.get({"screenshots":{}}, function(storage){
			if(storage.screenshots[localStorage.screenshotUrl] && new Date().getTime() - storage.screenshots[localStorage.screenshotUrl].timestamp < 432000000){
				localStorage.screenshotUrl="no-url";
				return;
			}
			chrome.tabs.captureVisibleTab(tab.windowId, 
			{format:"jpeg",quality:80}, function(image){
				console.log("Capturing image for " + localStorage.screenshotUrl);
				resizeImage(image, 100,400, function(resized){
					storage.screenshots[localStorage.screenshotUrl] ={};
					storage.screenshots[localStorage.screenshotUrl].image = resized;
					storage.screenshots[localStorage.screenshotUrl].timestamp = new Date().getTime();
					chrome.storage.local.set(storage);
					localStorage.screenshotUrl="no-url";
				});
			});
		});
	});

}, {
	urlPrefix:localStorage.screenshotUrl
});

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
        //console.log(height);
        // Convert the canvas to a data URL in PNG format
        callback(canvas.toDataURL());
    }
    sourceImage.src = url;
}