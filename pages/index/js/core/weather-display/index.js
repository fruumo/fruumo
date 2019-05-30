require('./index.scss');
window.skycons = require('../../libs/skycons').Skycons;
module.exports = {
	name:'search-weather',
	DOM:['.weather-container .temperature', '.weather-container .condition','.weather-container','.search-bar','.weather-container .icon-container'],
	preload:function(){
		chrome.storage.onChanged.addListener(function(changes,area){
			if(changes.weather || changes.location || changes.settingMetric){
				this.DOM[0][0].innerHTML = "";
				this.DOM[1][0].innerHTML = "";
				this.DOM[4][0].innerHTML = "";
				this.onload();
			}
		}.bind(this));
		this.DOM[2][0].addEventListener("click", function(e){
			this.DOM[3][0].value = "@weather";
			this.DOM[3][0].dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
		}.bind(this));
		return Promise.resolve();
	},
	onload: function(){
		chrome.storage.sync.get({settingMetric:true}, function(storage){
			chrome.storage.local.get({weather:null,location:null},function(lstorage){
				if(lstorage.weather == null || lstorage.location == null)
					return;
				var weather = lstorage.weather;
				var temp;
				if(storage.settingMetric)
					temp = Math.round(parseFloat(weather.apparentTemperature)) + "&deg;C";
				else
					temp = Math.round(parseFloat(weather.apparentTemperature))+ "&deg;F"
				this.DOM[0][0].innerHTML = temp;
				this.DOM[1][0].innerText = weather.summary;
				this.DOM[4][0].innerHTML = this.getWeatherIcon(weather.icon);
				setTimeout(function(){
					fruumo.eye.loader.endLoad();
					var icons = document.getElementsByClassName('weather-icon');
					var sky = new skycons({"color": "black"});
					for(var i=0;i<icons.length;i++){
						sky.add(icons[i], icons[i].getAttribute('data-weather'));
					}
					sky.play();
				},50);
			}.bind(this));
		}.bind(this));
	},
	getWeatherIcon: function(condid) {
		return `<canvas class="weather-icon" data-weather="${condid}"width="32" height="32"></canvas>`;
	}
};