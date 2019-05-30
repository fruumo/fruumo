function updateWeatherLocation(){
	chrome.storage.local.get({location:null, customWeather:null}, function(storage){
		if(!storage.location)
			return;
		document.getElementById("location").innerText = storage.location.city+", "+storage.location.countryCode + " " + (!storage.customWeather?"(auto)":"");
		//
	});
}

const API_KEY = '80e1db5e1b974262aa3db2e08529a0bf';

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
	fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationSearch.value)}&key=${API_KEY}`)
	.then(function(response){
		if(response.ok)
			return response.json();	
	})
	.then(function(response){
		if(response.results.length == 0){
			document.getElementById('weather-error').innerText = "No location found.";
			document.getElementById('weather-error').style.display = "block";
			this.disabled = false;
			this.value = "Save";
			return;
		}
		var result = response.results[0];
		chrome.storage.local.set({
			customWeather:{
				city:result.formatted,
				countryCode:result.components.country_code,
				lat:result.geometry.lat,
				lon:result.geometry.lng
			}
		}, function(){
			chrome.runtime.sendMessage({type:'refresh-weather'});
			this.disabled = false;
			this.value = "Save";
			noEditMode();
		}.bind(this));
	}.bind(this));
	
});