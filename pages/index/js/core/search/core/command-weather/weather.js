var dommy = require('dommy.js');
var moment = require('moment');
window.skycons = require('../../../../libs/skycons.js').Skycons;
require('./weather.scss');
module.exports = {
	message:"Weather Forecast",
	containerClass:"weather-forecast-container",
	icon:true,
	priority:"102",
	search: function(query){
		var $this = this;
		$this.query = query;
		if(query.indexOf('@weather') != 0){
			return Promise.resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:false
			});
		}

		return new Promise(function(resolve, reject){
			chrome.storage.sync.get("settingMetric", function(sstorage){
				chrome.storage.local.get("location", function(storage){
				if(!storage.location){
					return Promise.resolve({
						query:$this.query,
						containerClass:$this.containerClass,
						div:false
					});
				}
				fetch("https://api.darksky.net/forecast/1526708f30b68c33693ec16507bae665/"+storage.location.lat+","+storage.location.lon+"?units="+((sstorage.settingMetric)?"ca":"us"))
				.then(function(response){
					if(response.ok)
						return response.json();	
				})
				.then(function(weather){
					resolve({
						query:$this.query,
						containerClass:$this.containerClass,
						div:$this.createElement(weather, storage.location)
					});
					setTimeout(function(){
						var icons = document.getElementsByClassName('weather-icon');
						var sky = new skycons({"color": "black"});
						for(var i=0;i<icons.length;i++){
							sky.add(icons[i], icons[i].getAttribute('data-weather'));
						}
						sky.play();
					},50);
				});
			});
			});
		}.bind($this));
	
	},
	createElement: function(weather,location){
		console.log(weather);
		var d = dommy({
			tag:'div', attributes:{class:this.containerClass, 'data-priority':this.priority}
		});
		var now = dommy({tag:'div', attributes:{class:'now-weather-container'},
			children:[
				{
					tag:'div', attributes:{class:'temperature'},children:[{'type':'text','value':(weather.currently.temperature.toFixed(0))+String.fromCharCode(176)}]
				},
				{
					tag:'div', attributes:{class:'summary'},children:[
						{tag:'div', attributes:{class:'country'}, children:[{'type':'text','value':location.city}]},
						{tag:'div', attributes:{class:'desc'}, children:[{'type':'text','value':weather.currently.summary}]},
						{tag:'div', attributes:{class:'temp'}, children:[{'type':'text','value':"Feels like "+(weather.currently.apparentTemperature.toFixed(0))+String.fromCharCode(176)}]},
						{tag:'div', attributes:{class:'temp'}, children:[{'type':'text','value':"Chance of rain: " + (weather.currently.precipProbability*100).toFixed(0) + "%"}]},

					]
				}
			]});
		var hourlyForecast = dommy({tag:'div', attributes:{class:'hourly-forecast-container'}});
		for(var i=0;i<8;i++){
			hourlyForecast.appendChild(dommy({
				tag:'div', attributes:{class:'weather-holder'},
				children:[
					{
						tag:'div', attributes:{class:'time'},children:[{'type':'text','value':(new moment(new Date(weather.hourly.data[i].time*1000)).format('hA'))}]
					},
					{
						tag:'canvas', attributes:{class:'weather-icon',width:'64',height:'64', 'data-weather':weather.hourly.data[i].icon}
					},
					{
						tag:'div', attributes:{class:'temperature'},children:[{'type':'text','value':(weather.hourly.data[i].temperature).toFixed(0)+String.fromCharCode(176)}]
					},
					{
						tag:'div', attributes:{class:'summary'},children:[{'type':'text','value':weather.hourly.data[i].summary+((weather.hourly.data[i].precipProbability*100<5)?"":("("+(weather.hourly.data[i].precipProbability*100).toFixed(0)+"%)"))}]
					}
				]
			}));
		}
		var dailyForecast = dommy({tag:'div', attributes:{class:'hourly-forecast-container'}});
		for(var i=0;i<weather.daily.data.length;i++){
			dailyForecast.appendChild(dommy({
				tag:'div', attributes:{class:'weather-holder'},
				children:[
					{
						tag:'div', attributes:{class:'time'},children:[{'type':'text','value':(new moment(new Date(weather.daily.data[i].time*1000)).format('dddd'))}]
					},
					{
						tag:'canvas', attributes:{class:'weather-icon',width:'64',height:'64', 'data-weather':weather.daily.data[i].icon}
					},
					{
						tag:'div', attributes:{class:'temperature'},children:[
							{
								tag:'span', attributes:{class:'temp-high'},children:[
									{'type':'text','value':(weather.daily.data[i].temperatureHigh).toFixed(0)+String.fromCharCode(176)}
								]
							},
							{
								tag:'span', attributes:{class:'temp-low'},children:[
									{'type':'text','value':(weather.daily.data[i].temperatureLow).toFixed(0)+String.fromCharCode(176)}
								]
							}
						]
					},
					{
						tag:'div', attributes:{class:'summary'},children:[{'type':'text','value':weather.daily.data[i].summary+((weather.hourly.data[i].precipProbability*100<5)?"":("("+(weather.hourly.data[i].precipProbability*100).toFixed(0)+"%)"))}]
					}
				]
			}));
		}
		d.appendChild(now);
		d.appendChild(hourlyForecast);
		d.appendChild(dailyForecast);
		return d;
		//{'type':'text','value':(weather.daily.data[i].temperatureHigh).toFixed(0)+String.fromCharCode(176)}
	}
};