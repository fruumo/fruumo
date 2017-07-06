function updateWeatherLocation(){
	chrome.storage.local.get({location:null, customWeather:null}, function(storage){
		if(!storage.location)
			return;
		document.getElementById("location").innerText = storage.location.city+", "+storage.location.countryCode + " " + (!storage.customWeather?"(auto)":"");
		//
	});
}

updateWeatherLocation();
chrome.storage.onChanged.addListener(function(changes, area){
	if(area != "local"){
		return;
	}
	updateWeatherLocation();
});
function editMode(){
	document.getElementById('edit-weather').style.display = "inline-block";
	document.getElementById('no-edit-weather').style.display="none";
}
function noEditMode(){
	document.getElementById('edit-weather').style.display = "none";
	document.getElementById('no-edit-weather').style.display="inline-block";
}
document.getElementById('edit-weather-trigger').addEventListener('click', function(e){
	e.preventDefault();
	editMode();
});
document.getElementById('auto-location').addEventListener('click', function(e){
	chrome.storage.local.remove("customWeather", function(){
		chrome.runtime.sendMessage({type:'refresh-weather'});
		noEditMode();
	});
});
document.getElementById('save-location').addEventListener('click', function(e){
	var locationSearch = document.getElementById('location-search');
	if(locationSearch.value == "")
		return;
	document.getElementById('weather-error').innerText = "";
	document.getElementById('weather-error').style.display = "none";
	this.disabled = true;
	this.value = "Saving...";
	fetch("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22"+encodeURIComponent(locationSearch.value)+"%22&format=json")
	.then(function(response){
		if(response.ok)
			return response.json();	
	})
	.then(function(response){
		if(response.query.count == 0){
			document.getElementById('weather-error').innerText = "No location found.";
			document.getElementById('weather-error').style.display = "block";
			this.disabled = false;
			this.value = "Save";
			return;
		}
		var result = Array.isArray(response.query.results.place)?response.query.results.place[0]:response.query.results.place;
		chrome.storage.local.set({
			customWeather:{
				woeid:result.woeid,
				city:result.name,
				countryCode:result.country.code,
				lat:result.centroid.latitude,
				lon:result.centroid.longitude
			}
		}, function(){
			chrome.runtime.sendMessage({type:'refresh-weather'});
			this.disabled = false;
			this.value = "Save";
			noEditMode();
		}.bind(this));
	}.bind(this));
	
});