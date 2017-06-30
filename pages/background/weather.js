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
	fetch("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22("+lat+"%2C"+long+")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
	.then(function(response){
		if(response.ok)
			return response.json();	
	})
	.then(function(weather){
		chrome.storage.local.set({weather:weather.query,location:ipInfo});
	});
}

chrome.alarms.onAlarm.addListener(function(alarm){
	if(alarm.name != "refresh-weather" ){
		return;
	}
	chrome.storage.local.get({customWeather:null}, function(storage){
		if(!storage.customWeather){
			getIP().then(getWeather);
			return;
		} else {
			getWeather(storage.customWeather);
		}

	});
});