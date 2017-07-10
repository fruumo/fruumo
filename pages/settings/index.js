require('./index.scss');
window.appVersion = chrome.app.getDetails().version;

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-101959257-1', 'auto');

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
		var searchEngine = document.getElementById("search-engine");
		var appV = document.getElementById("app-version");
		var omniboxSearch = document.getElementById("omnibox-search");
		var fruumoSearch = document.getElementById("fruumo-search");

		appV.innerText = appVersion;

		if(localStorage.defaultSearchBar == "chrome"){
			omniboxSearch.checked = true;
		} else {
			fruumoSearch.checked = true;
		}

		if(localStorage.searchDomain){
			searchEngine.value = localStorage.searchDomain;
		}

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
		fruumoSearch.addEventListener("click", function(){
			localStorage.defaultSearchBar = "fruumo";
		});
		omniboxSearch.addEventListener("click", function(){
			localStorage.defaultSearchBar = "chrome";
		});
		searchEngine.addEventListener("change", function(e){
			localStorage.searchDomain = this.value;
		});
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
		  	ga('send', 'event', 'setting', 'custom wallpaper');

		});
		customWallpaper.addEventListener("click", function(){
			customWallpaperBrowse.click();
		});
		fruumoWallpaper.addEventListener("click", function(){
			chrome.storage.local.remove("settingCustomWallpaper");
			chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
			ga('send', 'event', 'setting', 'fruumo wallpaper');
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
		
		reset.addEventListener("update", function(){
			chrome.runtime.requestUpdateCheck(function(status){
				if(status == "update_available")
					chrome.runtime.reload();
			});
		});

	});
});
require('./weather.js');