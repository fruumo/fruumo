var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js');
module.exports = {
	message:"Autocomplete",
	containerClass:"autocomplete-results-container",
	priority:"102",
	advertising:undefined,
	timeout: undefined,
	search: function(query){
		var $this = this;
		$this.query = query;
		return new Promise(function(resolve, reject){
			if(localStorage.indexing == "true")
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement([{id:"818",
					lastVisitTime:1506745565181.638,
					title:"Fruumo is currently indexing your bookmarks and history to serve your searches better.",
					typedCount:0,
					urlDetect:true,
					url:"http://fruumo.com/indexing",
					visitCount:123}],$this.query)
				});
			chrome.runtime.sendMessage({type:"history-search", data:{query:this.query}}, function(history) {
				if(this.query.match(/^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g) != null){
					history.unshift({
						id:"818",
						lastVisitTime:1506745565181.638,
						title:this.query,
						typedCount:0,
						urlDetect:true,
						url:this.query.indexOf('http') != -1?this.query:'http://'+this.query,
						visitCount:123
					});
				}
				if(this.advertising == undefined){
					//this.loadAdvertising();
				}
				if(!localStorage.adblock && this.advertising != undefined && history.length > 0){
					history.push({
						id:"ad9",
						lastVisitTime:1506745565181.638,
						title:this.advertising.title,
						url:this.advertising.url,
						advertising:true,
						advertisingImg:this.advertising.image?this.advertising.image:undefined,
						visitCount:123
					});
				}
				resolve({
					query:this.query,
					containerClass:this.containerClass,
					div:this.createElement(history,this.query)
				});
			}.bind(this));
		}.bind($this));
	},
	loadAdvertising: function(){
		chrome.storage.local.get({advertising:[]}, function(storage){
			storage = storage.advertising;
			storage = storage[Math.floor(Math.random()*storage.length)];
			this.advertising = storage;
		}.bind(this));
	},
	createElement: function(results,query){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		for(var i in results){
			if(!results[i].title || !results[i].url)
				continue;
			var parser = document.createElement('a');
			parser.href =results[i].url;
			if(i==0 && !results[i].urlDetect)
				window.fruumo.preloader.startPreloadUrl(results[i].url);
			var img = 'https://s2.googleusercontent.com/s2/favicons?domain='+parser.hostname;
			if(results[i].url.indexOf("chrome://") != -1 || results[i].url.indexOf("chrome-extension://") !=-1)
				img = "";
			if(results[i].advertisingImg){
				img = results[i].advertisingImg;
			}
			var url = results[i].url;
			if(results[i].advertising){
				url = "Advertisment";
			}
			if(results[i].type == 2){
				url = "Bookmark";
			}
			var r = render({
				title:results[i].title,
				url:url,
				launch:results[i].url,
				imgSrc:img,
				imgError: function(){
					this.style.opacity = "0";
				}, 
				click: function(){
					if(this.getAttribute('advert')){
						ga('send', 'event', 'search', 'launch advertising', appVersion);
					}
					ga('send', 'event', 'search', 'launch autocomplete', appVersion);
					window.top.location= this.getAttribute('data-launch');
				}
			});
			r.setAttribute('data-search-query', results[i].url);
			r.setAttribute('data-orig-query', query);
			if(results[i].advertising)
				r.setAttribute('advert',true);
			d.appendChild(r);
		}
		return d;
	}
};