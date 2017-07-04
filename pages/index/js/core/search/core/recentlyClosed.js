var dommy = require('dommy.js');
require('./recentlyClosed.scss');
module.exports = {
	message:"Recently closed tabs",
	containerClass:"rct-container",
	priority:"100",
	icon:true,
	search: function(query){
		var $this = this;
		$this.query = query;

		return new Promise(function(resolve, reject){
			if($this.query.indexOf("@recently-closed-tabs") != 0){
				resolve({
					query:$this.query,
					containerClass:"rct-container",
					div:false
				});
				return;
			}
			chrome.sessions.getRecentlyClosed({maxResults:10}, function(sessions){
				var recentlyClosed = [];
				console.log(sessions);
				function processTab(tab){
					if(!tab.url || !tab.title)
						return;
					if(tab.url.indexOf("chrome://") != -1)
						return;
					var parser = document.createElement('a');
						parser.href =tab.url;
					recentlyClosed.push({
						url:tab.url,
						faviconUrl:"https://www.google.com/s2/favicons?domain="+parser.hostname,
						title:tab.title
					});
				}
				for(var i = sessions.length-1; i>=0; i--){
					var session = sessions[i];
					if(session.tab)
						processTab(session.tab);
					if(session.window){
						for(var j=session.window.tabs.length-1; j>=0; j--){
							processTab(session.window.tabs[j]);
						}
					}
				}
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(recentlyClosed)
				});
			});
		}.bind($this));
	},
	createElement: function(results){
		if(!results){
			return false;
		}
		if(results.length == 0){
			var d = document.createElement('div');
			d.className = "rct-container";
			var t = document.createElement('div');
			t.className = "title";
			t.innerText = "No recently closed tabs";
			d.appendChild(t);
			return d;
		}
		var d = document.createElement('div');
		d.className = "rct-container";
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Recently Closed Tabs";
		d.appendChild(t);
		for(var i=results.length-1; i>=0; i--){
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-url':results[i].url},
				events:{
					click:function(){
					  	ga('send', 'event', 'search', 'launch recently closed', appVersion);
						window.top.location= this.getAttribute('data-url');
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