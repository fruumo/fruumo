var dommy = require('dommy.js');
require('./opentabsearch.scss');
var Fuse = require('fuse.js');

module.exports = {
	message:"Open Tabs",
	containerClass:"ot-container",
	priority:"100",
	icon:true,
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
		d.className = "ot-container";
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Opened Tabs";
		d.appendChild(t);
		for(var i in results){
			var parser = document.createElement('a');
			parser.href =results[i].url;
			results[i].faviconUrl = "https://www.google.com/s2/favicons?domain="+parser.hostname;
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-id':results[i].id, 'data-window-id':results[i].windowId},
				events:{
					click:function(){
					  	ga('send', 'event', 'search', 'launch search open tab', appVersion);
					  	chrome.tabs.update(parseInt(this.getAttribute('data-id')), {active:true}, function(){
					  		chrome.tabs.getCurrent(function(tab){
					  			chrome.windows.update(parseInt(this.getAttribute('data-window-id')), {focused:true}, function(){
					  				chrome.tabs.remove(tab.id);
					  			});
					  		}.bind(this));
					  	}.bind(this));
					}
				},
				children:[
				{
						tag:'div',
						attributes:{class:'icon-holder'},
						children:[
						{
							tag:'img',
							attributes:{class:'icon', src:results[i].faviconUrl},
							events:{
								error:function(){
									this.style.opacity="0";
								}
							}
						}
						]
				},
				{
					tag:'div',
					attributes:{class:'details-holder'},
					children:[
					{
						tag:'div',
						attributes:{class:'title'},
						children:[{type:'text',value:results[i].title}]
					},
					{
						tag:'div',
						attributes:{class:'url'},
						children:[{type:'text',value:results[i].url}]
					}
					]
				}
				]
			});
			d.appendChild(result);
		}
		return d;
	}
};