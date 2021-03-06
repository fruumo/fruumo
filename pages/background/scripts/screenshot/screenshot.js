module.exports = {
	name:'screenshot-manager',
	onload : function(){

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if (request.type != "screenshot"){
				return;
			}
			var resetTime = 86400000;
			var parser = document.createElement('a');
			parser.href =request.data.url;
			chrome.storage.local.get({"screenshots":{}}, function(storage){
				if(storage.screenshots[request.data.url] && new Date().getTime() - storage.screenshots[request.data.url].timestamp < resetTime){
					return;
				}
				chrome.webNavigation.onCompleted.addListener(screenshot); 
			});
			function screenshot(details){
				if(details.frameId != 0)
					return;
				chrome.storage.local.get({"screenshots":{}}, function(storage){
					function captureTab(windowId, url){
						chrome.tabs.captureVisibleTab(windowId, 
							{format:"jpeg",quality:80}, function(image){

								function resizeImage(url, width, height, callback) {
									var sourceImage = new Image();
									sourceImage.onload = function() {
							// Create a canvas with the desired dimensions
							var canvas = document.createElement("canvas");
							width = (sourceImage.width/sourceImage.height)*height;

							canvas.width = width;
							canvas.height =height;
							var ctx = canvas.getContext("2d")
							// Scale and draw the source image to the canvas
							ctx.drawImage(sourceImage, 0, 0, width, height);
							var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
							var data = imgData.data;
							imgData = {};
							total = 0;
							for(var i=0; i<data.length; i+=4) {
								total++;
								var red = data[i];
								var green = data[i+1];
								var blue = data[i+2];
								var alpha = data[i+3];
								if(imgData["("+red+","+green+","+blue+")"]){
									imgData["("+red+","+green+","+blue+")"]++;
								} else {
									imgData["("+red+","+green+","+blue+")"] = 1;
								}
							}
							var isWhite = false;
							for(var i in imgData){
								if(imgData[i]/total > 0.9){
									isWhite = true;
								}
							}
							// Convert the canvas to a data URL in PNG format
							callback(canvas.toDataURL(), isWhite);
						}
						sourceImage.src = url;
					}
					console.log("Capturing image for " + details.url);
					resizeImage(image, 100,240, function(resized, tf){
						if(tf){sendResponse();return;}
						storage.screenshots[url] ={};
						storage.screenshots[url].image = resized;
						storage.screenshots[url].timestamp = new Date().getTime();
						chrome.storage.local.set(storage);
						chrome.webNavigation.onCompleted.removeListener(screenshot);
						sendResponse();
					});
				});
					}
					chrome.tabs.query({active:true, currentWindow:true},function(tab){
						tab = tab[0];
						if(!tab){
							chrome.webNavigation.onCompleted.removeListener(screenshot);
							return;
						}
						if(tab.url.indexOf(parser.hostname) != -1){
							if(tab.status == "loading")
								return;
							if(!tab.active)
								return;
							captureTab(tab.windowId, request.data.url);
						} else {
							chrome.tabs.get(request.data.tabId, function(tab){
								if(tab.status == "loading")
									return;
								if(!tab.active)
									return;
								captureTab(tab.windowId, request.data.url);
							});
						}
					});
				});
			}
		});
	}
};
