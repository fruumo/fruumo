require('./ticker.scss');
module.exports = {
	name:'ticker',
	DOM:['.ticker'],
	tickerStrings:[],
	greetings:['Bonjour', 'Namaste', 'Hi', 'Konnichiwa'],
	currentTick:0,
	timeVisible:true,
	preload:function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get({"timeVisible":true}, function(storage){
				if(!storage.timeVisible){
					this.timeVisible = false;
				}
				resolve(true);
			}.bind(this));
		}.bind(this));
	},
	onload: function(){
		if(!this.timeVisible)
			return;
		var date = new Date();
		 
			chrome.storage.local.get("quote", (storage)=>{
				//only do this if the language is english
				if(storage.quote && chrome.i18n.getUILanguage().indexOf('en') != -1)
					this.tickerStrings.push(storage.quote);
				this.tickerStrings.push(this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()));
			});
		this.DOM[0][0].style.opacity = 0;
		this.DOM[0][0].innerHTML = this.greetings[Math.floor(Math.random() * this.greetings.length)] + (localStorage.username == ""?".":(" "+localStorage.username+"."));
		this.DOM[0][0].style.opacity = 1;
		setTimeout(function(){
			this.tick();
		}.bind(this), 2000);
		setInterval(this.tick.bind(this), 8000);
	},
	tick: function(){
		if(this.DOM[0][0].innerHTML != this.tickerStrings[this.currentTick]){
			this.DOM[0][0].style.opacity = 0;
			setTimeout(function(){
				this.DOM[0][0].innerHTML = this.tickerStrings[this.currentTick];
				this.DOM[0][0].style.opacity = 1;
				this.currentTick++;
				if(this.currentTick >= this.tickerStrings.length){
					this.currentTick = 0;
				}
			}.bind(this),400);
		}
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var day = DayArray[day];
		var month =  monthArray[m];
		var suffix = "";
		if(d === 3 || d === 23){
			suffix = "rd";
		}else if(d === 1 || d === 21 || d === 31){
			suffix = "st";
		}else if(d == 2 || d == 22){
			suffix = "nd";
		} else if(d !== 1 || d !== 21 || d !== 31){
			suffix = "th";
		} 

		return chrome.i18n.getMessage("dateFormat", [chrome.i18n.getMessage(day),d+"", chrome.i18n.getMessage(suffix),chrome.i18n.getMessage(month), y+""]);	
	}
};