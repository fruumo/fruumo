var settingMetric = false;
module.exports = {
	name:'weather-manager',
	onload:function(){
		chrome.alarms.onAlarm.addListener((alarm)=>{
			if(alarm.name != "refresh-weather" ){
				return;
			}
			this.refreshWeather();
		});

		chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
			if (request.type != "refresh-weather"){
				return;
			}
			this.refreshWeather();	
		});
	},
	refreshWeather:function(){
		chrome.storage.sync.get("settingMetric", function(sstorage){
			chrome.storage.local.get({customWeather:null}, function(storage){
				console.log(sstorage.settingMetric);
				settingMetric = sstorage.settingMetric;
				if(!storage.customWeather){
					getIP().then(getWeather);
					return;
				} else {
					getWeather(storage.customWeather, sstorage.settingMetric);
				}
			});
		})
	}
}
function getIP(){
	return fetch("http://ip-api.com/json")
	.then(function(response){
		if(response.ok)
			return response.json();
	});
}

function getWeather(ipInfo){
	console.log("Getting weather");
	var lat = ipInfo.lat + "";
	var long = ipInfo.lon + "";
	var lang = chrome.i18n.getUILanguage();
	lang = lang.indexOf('ru') != -1 ? 'ru' : '';
	console.log(settingMetric);
	if(lang == ''){
		lang = 'en';
	}
	fetch(`https://api.darksky.net/forecast/1526708f30b68c33693ec16507bae665/${lat},${long}?lang=${lang}&units=${settingMetric?"ca":"us"}`)
	.then(function(response){
		if(response.ok)
			return response.json();	
	})
	.then(function(weather){
		console.log(weather);
		chrome.storage.local.set({weather:weather.currently,location:ipInfo});
	});
}
