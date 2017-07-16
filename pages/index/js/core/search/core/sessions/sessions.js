var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js');
require('./sessions.scss');
module.exports = {
	message:"Sessions",
	containerClass:"sessions-container",
	priority:"99",
	icon:true,
	search: function(query){
		var $this = this;
		$this.query = query;

		return new Promise(function(resolve, reject){
			if($this.query.indexOf("@sessions") != 0){
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:false
				});
				return;
			}
			chrome.sessions.getDevices({}, function(sessions){
				console.log(sessions);
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(sessions)
				});
			});
		}.bind($this));
	},
	createElement: function(results){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = chrome.i18n.getMessage("sessions");
		if(results.length == 0){
			t.innerText = chrome.i18n.getMessage("noSessions");
			d.appendChild(t);
			return d;
		}
		d.appendChild(t);

		function processTab(tab){
			if(!tab.url || !tab.title)
				return;
			if(tab.url.indexOf("chrome://") != -1)
				return;
			var parser = document.createElement('a');
				parser.href =tab.url;
			d.appendChild(
				render({
					title:tab.title,
					url:tab.url,
					launch:tab.url,
					imgSrc:"https://www.google.com/s2/favicons?domain="+parser.hostname,
					imgError: function(){
						this.style.opacity = "0";
					}, 
					click: function(){
						ga('send', 'event', 'search', 'launch other device', appVersion);
						window.top.location= this.getAttribute('data-launch');
					}
				})
			);
		}
		for(var i=0; i<results.length; i++){
			var device = document.createElement('div');
			device.className = "title device-name";
			device.innerText = results[i].deviceName;
			d.appendChild(device);
			for(var j in results[i].sessions){
				var session = results[i].sessions[j];
				if(session.tab){
					processTab(session.tab);
				}
				if(session.window){
					for(var k=session.window.tabs.length-1; k>=0; k--){
						processTab(session.window.tabs[k]);
					}
				}
			}
		}
		return d;
	}
};