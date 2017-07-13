var render = require('../../default-result-render/index.js');
var fuzzy = require('fuzzyjs');
var groupby = require('lodash.groupby');

module.exports = {
	message:"Command-sort-tabs",
	containerClass:"command-sort-tabs-container command-container",
	icon:true,
	priority:"102",
	search: function(query){
		var $this = this;
		$this.query = query;
		if(query.indexOf('@') != 0){
			return Promise.resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:false
			});
		}
		return new Promise(function(resolve, reject){
			resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:fuzzy.test($this.query.replace('@',''), 'sort all tabs')?$this.createElement():false
			});
		}.bind($this));
	},
	createElement: function(){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		d.appendChild(render({
			title:"Sort all tabs",
			url:"This command will sort all open tabs by url",
			launch:"",
			imgSrc:"",
			imgError: function(){
				this.style.opacity = 0;
			}, 
			click: function(){
				ga('send', 'event', 'search', 'command sort all tabs', appVersion);
				chrome.tabs.queryAsync({}).then(function(tabs){
					var grouped = groupby(tabs, function(tab){
						var base = tab.url.match(/^https?:\/\/[^\/]+/i);
						if(!base)
							return "unknown";
						else
							return base[0];
					});
					var keys = Object.keys(grouped)
					for(var i in keys){
						var key = keys[i];
						for(var j in grouped[key]){
							var tab = grouped[key][j];
							chrome.tabs.move(tab.id, {index:-1});
						}
					}
				});
			}
		}));
		return d;
	}
};