var dommy = require('dommy.js');
var Fuse = require('fuse.js');
var render = require('../../default-result-render/index.js');

module.exports = {
	message:"Open Tabs",
	containerClass:"ot-container",
	priority:"100",
	search: function(query){
		var $this = this;
		$this.query = query;

		return new Promise(function(resolve, reject){
			chrome.tabs.query({}, function(tabs){
				var options = {
					shouldSort: true,
					threshold: 0.3,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					minMatchCharLength: 10,
					keys: [
					"title",
					"url"
					]
				};
				var fuse = new Fuse(tabs, options);
				tabs = fuse.search($this.query);
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:tabs.length > 0 ? $this.createElement(tabs):false
				});
			});
		}.bind($this));
	},
	createElement: function(results){
		if(!results){
			return false;
		}
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Opened Tabs";
		d.appendChild(t);
		for(var i in results){
			var parser = document.createElement('a');
			parser.href =results[i].url;
			results[i].faviconUrl = "https://www.google.com/s2/favicons?domain="+parser.hostname;
			d.appendChild(
				render({
					title:results[i].title,
					url:results[i].url,
					launch:JSON.stringify([results[i].id, results[i].windowId]),
					imgSrc:results[i].faviconUrl,
					imgError: function(){
						this.style.opacity = "0";
					}, 
					click: function(){
						ga('send', 'event', 'search', 'launch search open tab', appVersion);
						var tabId = JSON.parse(this.getAttribute('data-launch'));
						windowId = parseInt(tabId[1]);
						tabId = parseInt(tabId[0]);
						chrome.tabs.update(parseInt(tabId), {active:true}, function(){
							chrome.tabs.getCurrent(function(tab){
								chrome.windows.update(parseInt(windowId), {focused:true}, function(){
									chrome.tabs.remove(tab.id);
								});
							}.bind(this));
						}.bind(this));
					}
				})
			);
		}
		return d;
	}
};