require('./ticker.scss');
module.exports = {
	name:'ticker',
	DOM:['.ticker'],
	tickerStrings:[],
	currentTick:0,
	onload: function(){
		var date = new Date();
		this.tickerStrings.push(this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()));
		this.getWeather();
		this.tick();
		setInterval(this.tick.bind(this), 8000);
	},
	tick: function(){
		if(this.DOM[0][0].innerHTML != this.tickerStrings[this.currentTick]){
			this.DOM[0][0].style.display = "none";
			this.DOM[0][0].innerHTML = this.tickerStrings[this.currentTick];
			setTimeout(function(){this.DOM[0][0].style.display = "block";}.bind(this), 10);
		}
		this.currentTick++;
		if(this.currentTick >= this.tickerStrings.length){
			this.currentTick = 0;
		}
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dateString = DayArray[day]+", ";
		if(d === 3 || d === 23){
			dateString += d+"rd of ";
		}else if(d === 1 || d === 21 || d === 31){
			dateString += d+"st of ";
		}else if(d == 2 || d == 22){
			dateString += d+"nd of ";
		} else if(d !== 1 || d !== 21 || d !== 31){
			dateString += d+"th of ";
		} 
		
		dateString += monthArray[m] + " " + y ;
		
		return dateString;	
		
	},
	getWeather: function(){
		fetch("http://ip-api.com/json")
		.then(function(response){
			if(response.ok)
				return response.json();
		})
		.then(function(ipInfo){
			var lat = ipInfo.lat + "";
			var long = ipInfo.lon + "";
			fetch("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22("+lat+"%2C"+long+")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
			.then(function(response){
				if(response.ok)
					return response.json();	
			})
			.then(function(weather){
				console.log(weather);
				this.tickerStrings.push("It's " + Math.round((weather.query.results.channel.item.condition.temp-32)*5/9) + " &deg;C and "+weather.query.results.channel.item.condition.text+".")
			}.bind(this));
		}.bind(this));
	}
};