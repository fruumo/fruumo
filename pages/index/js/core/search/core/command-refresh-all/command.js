var render = require('../../default-result-render/index.js');
var fuzzy = require('fuzzyjs');
module.exports = {
	message:"Command-refresh-all-tabs",
	containerClass:"command-refresh-all-tabs-container command-container",
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
				div:fuzzy.test($this.query.replace('@',''), 'refresh all tabs')?$this.createElement():false
			});
		}.bind($this));
	},
	createElement: function(){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		d.appendChild(render({
			title:"Refresh all tabs",
			url:"This command will refresh all open tabs",
			launch:"",
			imgSrc:"",
			imgError: function(){
				this.style.opacity = 0;
			}, 
			click: function(){
				ga('send', 'event', 'search', 'command refresh all tabs', appVersion);
				chrome.tabs.queryAsync({windowType:"normal"})
				.then(function(tabs){
					for(var i in tabs){
						var tab = tabs[i];
						if(tab.url.indexOf("chrome://")!=-1){
							continue;
						}
						chrome.tabs.reload(tab.id, {bypassCache:true});
					}
				})
			}
		}));
		return d;
	}
};