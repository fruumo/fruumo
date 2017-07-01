require('./index.scss');
chrome.storage.local.get(null, function(lstorage){

	chrome.storage.sync.get(null, function(storage){
		console.log(storage);
		var displayTopsites = document.getElementById("display-topsites");
		var time = document.getElementById("24h");
		var focusMode = document.getElementById("focus-mode");
		var reset = document.getElementById("reset");
		var metricWeather = document.getElementById("metric-weather");
		var customWallpaperBrowse = document.getElementById("custom-wallpaper-browse");
		var customWallpaper = document.getElementById("custom-wallpaper");
		var fruumoWallpaper = document.getElementById("fruumo-wallpaper");
		if(storage.settingDisplayTopsites){
			displayTopsites.checked = true;
		}
		if(storage.settingIs24h){
			time.checked = true;
		}
		if(storage.settingFocus){
			focusMode.checked = true;
		}
		if(storage.settingMetric || storage.settingMetric == undefined){
			metricWeather.checked = true;
		}
		if(!lstorage.settingCustomWallpaper){
			fruumoWallpaper.checked = true;
		} else {
			customWallpaper.checked = true;
		}

		customWallpaperBrowse.addEventListener("change", function(e){
			if(e.target.files.length == 0)
				return;

    		var file = e.target.files[0];
    		 if (!file.type.match('image.*')) {
       			return;
      		}
      		var reader = new FileReader();
      		reader.onload = function(){
				var dataUrl = reader.result;
				var fontColor = "#FFF";
				chrome.storage.local.set({wallpaper:{image:dataUrl,author:"",location:"", color:"",fontColor:fontColor,luminance:0}});
				chrome.storage.local.set({settingCustomWallpaper:true});
      		};
      		reader.readAsDataURL(file);
		});
		customWallpaper.addEventListener("click", function(){
			customWallpaperBrowse.click();
		});
		fruumoWallpaper.addEventListener("click", function(){
			chrome.storage.local.remove("settingCustomWallpaper");
			chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
		});
		metricWeather.addEventListener("click", function(){
			chrome.storage.sync.set({settingMetric:this.checked});
		});

		displayTopsites.addEventListener("click", function(){
			chrome.storage.sync.set({settingDisplayTopsites:this.checked});
		});

		time.addEventListener("click", function(){
			chrome.storage.sync.set({settingIs24h:this.checked});
		});

		focusMode.addEventListener("click", function(){
			chrome.storage.sync.set({settingFocus:this.checked});
		});

		reset.addEventListener("click", function(){
			chrome.storage.sync.set({settingsReset:true}, function(){
				location.reload();
			});
		});
	});
});
require('./weather.js');