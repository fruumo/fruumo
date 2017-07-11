var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js');

require('./downloads.scss');
module.exports = {
	message:"Downloads",
	containerClass:"downloads-results-container",
	priority:"99",
	icon:true,
	search: function(query){
		var $this = this;
		$this.query = query;
		return new Promise(function(resolve, reject){
			if($this.query.indexOf("@downloads") != 0){
				resolve({
					query:$this.query,
					containerClass:"downloads-container",
					div:false
				});
				return;
			}

			chrome.downloads.search({limit:20, orderBy:['-startTime'], state:"complete"}, function(downloads){
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(downloads)
				});
			}.bind($this));
		}.bind($this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = chrome.i18n.getMessage("downloads");
		d.appendChild(t);
		for(var i in results){
			d.appendChild(
				render({
					title:results[i].filename.match(/[^/]+(?=$)/)[0],
					url:results[i].url,
					launch:results[i].id,
					imgSrc:"",
					imgError: function(){
						chrome.downloads.getFileIcon(parseInt(this.getAttribute("data-launch")), {}, function(c){
							if(!c || this.src == c)
								return;
							this.src = c;
						}.bind(this));
					}, 
					click: function(){
						ga('send', 'event', 'search', 'launch download', appVersion);
						chrome.downloads.show(parseInt(this.getAttribute("data-launch")));
					}
				})
			);
		}
		return d;
	}
};