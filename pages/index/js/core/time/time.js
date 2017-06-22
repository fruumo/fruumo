require('./time.scss');
module.exports = {
	name:'time',
	DOM:['.time','.aorp'],
	is24h:true,
	preload: function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get("settingIs24h", function(storage){

				if(storage.settingIs24h == undefined || storage.settingIs24h == true){
					this.is24h = true;
				} else {
					this.is24h = false;
				}

				//dynamic settings
				chrome.storage.onChanged.addListener(function(changes, area){
					if(area != "sync")
						return;
					if(changes.settingIs24h == undefined)
						return;
					if(changes.settingIs24h.newValue == undefined)
						return;
					if(changes.settingIs24h.newValue){
						this.is24h = true;
					} else {
						this.is24h = false;
					}
				}.bind(this));

				resolve(true);
			}.bind(this));
		}.bind(this));
	},
	onload: function(){
		this.updateTime();
		setInterval(this.updateTime.bind(this), 10000);
		//var date = new Date();
		//this.DOM[1][0].innerText = this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear());
	},
	updateTime: function(){
		var currentTime = new Date();
		var currentHours = currentTime.getHours();
		var currentMinutes = currentTime.getMinutes();		

		//12 hour format
		if(!this.is24h){
			this.DOM[1][0].innerText = currentHours > 11 ? "PM" : "AM";
		} else {
			this.DOM[1][0].innerText = "";
		}
		if(!this.is24h && currentHours > 12){
			currentHours = currentHours - 12;
		}

		if(currentHours < 10){
			currentHours = "0" + currentHours;
		} else {
			currentHours = "" + currentHours;
		}
		if(currentMinutes < 10){
			currentMinutes = "0" + currentMinutes;
		} else {
			currentMinutes = "" + currentMinutes;
		}
		if(this.DOM[0][0].innerText != currentHours + ":" + currentMinutes)
			this.DOM[0][0].innerText = currentHours + ":" + currentMinutes;
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		//console.log(day,d,m,y);
		
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
		
	}
};