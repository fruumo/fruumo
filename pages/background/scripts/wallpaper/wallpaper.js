module.exports = {
	name:'wallpaper-manager',
	onload: function(){
		const UNSPLASH_API_ID = "a7d6cc6f5ce74fcf56703608563d852c6f7b110a82b1e10cf58e0ead897cc223";
		var UNSPLASH_collection = 947821;
		//test is 922352;
		//UNSPLASH_collection = 922352;
		chrome.alarms.onAlarm.addListener(function(alarm){
			if(alarm.name != "refresh-wallpaper" ){
				return;
			}
			this.refreshWallpaper();
		}.bind(this));

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if (request.type != "refresh-wallpaper"){
				return;
			}
			this.refreshWallpaper();	
		}.bind(this));
	},
	refreshWallpaper: function(){
		chrome.storage.local.get({settingCustomWallpaper:false}, function(storage){
			if(storage.settingCustomWallpaper)
				return;
			console.log('refreshing wallpaper...');
			var max = 0;
			var min = 24;
			var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			var date = new Date();
			var tod = "";
			if(date.getHours() <= 5){tod = "night"}
			else if(date.getHours() <= 11){tod = "morning"}
			else if(date.getHours() <= 18){tod = "afternoon"}
			else if(date.getHours() <= 20){tod = "evening"}
			else {tod = "night"}

			fetch("http://api.fruumo.com/wallpaper/"+tod+"?r="+Math.random())
			.then(function(response){
				if(response.ok)
					return response.json();
			})
			.then(function(data){
				//Get new wallpaper data
				//regular or full
				fetch(""+data.imageLink+"&w="+(screen.width)+"&h="+(screen.height))
				.then(function(response){
					if(response.ok)
						return response.blob();
				})
				.then(function(blob){
					var reader = new FileReader();
					reader.onload = function() {
						function hexToRgb(hex) {
							var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
							return result ? {
								r: parseInt(result[1], 16),
								g: parseInt(result[2], 16),
								b: parseInt(result[3], 16)
							} : null;
						}
						var dataUrl = reader.result;
						var rgb = hexToRgb(data.color);
						var luminance = 1 - (((0.299*rgb.r) + (0.587*rgb.g) + (0.114*rgb.b))/255);
						var fontColor = "";
						fontColor = "#FFF";
						chrome.storage.local.set({wallpaper:{image:dataUrl,author:data.user,location:data.location, color:data.color,fontColor:fontColor,luminance:luminance}});
					};
					reader.readAsDataURL(blob);
				});
			});
		});
	}
}

