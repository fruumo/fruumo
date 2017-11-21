var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js');
module.exports = {
	message:"Autocomplete",
	containerClass:"autocomplete-results-container",
	priority:"102",
	search: function(query){
		var $this = this;
		$this.query = query;
		return new Promise(function(resolve, reject){
			chrome.runtime.sendMessage({type:"history-search", data:{query:this.query}}, function(history) {
				if(history.length == 0 && this.query.match(/^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g) != null){
					history = [{
						id:"818",
						lastVisitTime:1506745565181.638,
						title:this.query,
						typedCount:0,
						url:this.query.indexOf('http') != -1?this.query:'http://'+this.query,
						visitCount:123
					}]
				}
				resolve({
					query:this.query,
					containerClass:this.containerClass,
					div:this.createElement(history,this.query)
				});
			}.bind(this));
		}.bind($this));
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
			if(i==0)
				window.fruumo.preloader.startPreloadUrl(results[i].url);
			var r = render({
				title:results[i].title,
				url:results[i].url,
				launch:results[i].url,
				imgSrc:(results[i].url.indexOf("chrome://") != -1 || results[i].url.indexOf("chrome-extension://") !=-1) ?"":'https://s2.googleusercontent.com/s2/favicons?domain='+parser.hostname,
				imgError: function(){
					this.style.opacity = "0";
				}, 
				click: function(){
					ga('send', 'event', 'search', 'launch autocomplete', appVersion);
					window.top.location= this.getAttribute('data-launch');
				}
			});
			r.setAttribute('data-search-query', results[i].url);
			r.setAttribute('data-orig-query', query);
			d.appendChild(r);
		}
		return d;
	}
};