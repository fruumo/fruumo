require('./statusbar.scss');
module.exports = {
	name:'statusbar',
	DOM:['.statusbar','.statusbar>.icon-list','.search-bar'],
	preload: function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get({"settingAutohideStatusbar":false}, function(storage){
				if(storage.settingAutohideStatusbar){
					this.DOM[0][0].className = "statusbar autohide";
				}
			}.bind(this));
				//dynamic settings
			chrome.storage.onChanged.addListener(function(changes, area){
				if(area != "sync")
					return;
				if(changes.settingAutohideStatusbar != undefined){
					if(changes.settingAutohideStatusbar.newValue){
						this.DOM[0][0].className = "statusbar autohide";
					} else {
						this.DOM[0][0].className = "statusbar";
					}
				}
			}.bind(this));

			resolve(true);
		}.bind(this));
	},
	onload: function(){
		var settings = document.createElement('div');
		settings.className = "item";
		settings.setAttribute("title",chrome.i18n.getMessage("settings"));
		settings.innerHTML = "<i class=\"icon-settings\" aria-hidden=\"true\"></i>";
		settings.addEventListener("click", this.settings.bind(this));
		this.DOM[1][0].appendChild(settings);

		var sessions = document.createElement('div');
		sessions.className = "item";
		sessions.setAttribute("title",chrome.i18n.getMessage("sessions"));
		sessions.innerHTML = "<i class=\"icon-important_devices\" aria-hidden=\"true\"></i>";
		sessions.addEventListener("click", this.sessions.bind(this));
		this.DOM[1][0].appendChild(sessions);

		/*var cWallpaper = document.createElement('div');
		cWallpaper.className = "item";
		cWallpaper.setAttribute("title","Get a new wallpaper");
		cWallpaper.innerHTML = "<i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>";
		cWallpaper.addEventListener("click", this.cWallpaper.bind(this));
		this.DOM[1][0].appendChild(cWallpaper);
		*/
		var downloads = document.createElement('div');
		downloads.className = "item";
		downloads.setAttribute("title",chrome.i18n.getMessage("downloads"));
		downloads.innerHTML = "<i class=\"icon-cloud_download\" aria-hidden=\"true\"></i>";
		downloads.addEventListener("click", this.downloads.bind(this));
		this.DOM[1][0].appendChild(downloads);

		var recentlyClosed = document.createElement('div');
		recentlyClosed.className = "item";
		recentlyClosed.setAttribute("title",chrome.i18n.getMessage("recentlyClosedTabs"));
		recentlyClosed.innerHTML = "<i class=\"icon-rotate_left\" aria-hidden=\"true\"></i>";
		recentlyClosed.addEventListener("click", this.recentlyClosed.bind(this));
		this.DOM[1][0].appendChild(recentlyClosed);

		var allApps = document.createElement('div');
		allApps.className = "item";
		allApps.setAttribute("title",chrome.i18n.getMessage("allApplications"))
		allApps.innerHTML = "<i class=\"icon-apps\" aria-hidden=\"true\"></i>";
		allApps.addEventListener("click", this.allApps.bind(this));
		this.DOM[1][0].appendChild(allApps);
	},
	settings:function(){
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
		  	ga('send', 'event', 'settings', 'launch settings', appVersion);
			window.open(chrome.runtime.getURL('../settings/index.html'));
		}
	},
	cWallpaper:function(){
		document.getElementsByClassName('wallpaper')[0].style.filter = "blur(4px)";
		chrome.runtime.sendMessage({type:'refresh-wallpaper'});
	},
	recentlyClosed: function(){
		this.triggerSearch("@rct");
	},
	allApps: function(){
		this.triggerSearch("@apps");
	},
	downloads:function(){
		this.triggerSearch("@dw");
	},
	sessions: function(){
		this.triggerSearch("@sessions");
	},
	triggerSearch: function(text){
		if(this.DOM[2][0].value != text){
			this.DOM[2][0].value = text;
			this.DOM[2][0].dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
		} else {
			this.DOM[2][0].value = "";
			this.DOM[2][0].dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
		}
	}
};