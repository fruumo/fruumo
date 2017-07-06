require('./statusbar.scss');
module.exports = {
	name:'statusbar',
	DOM:['.statusbar','.statusbar>.icon-list','.search-bar'],
	onload: function(){
		var settings = document.createElement('div');
		settings.className = "item";
		settings.setAttribute("title","Settings");
		settings.innerHTML = "<i class=\"fa fa-cog\" aria-hidden=\"true\"></i>";
		settings.addEventListener("click", this.settings.bind(this));
		this.DOM[1][0].appendChild(settings);

		/*var cWallpaper = document.createElement('div');
		cWallpaper.className = "item";
		cWallpaper.setAttribute("title","Get a new wallpaper");
		cWallpaper.innerHTML = "<i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>";
		cWallpaper.addEventListener("click", this.cWallpaper.bind(this));
		this.DOM[1][0].appendChild(cWallpaper);
		*/
		var downloads = document.createElement('div');
		downloads.className = "item";
		downloads.setAttribute("title","Recently Completed Downloads");
		downloads.innerHTML = "<i class=\"fa fa-download\" aria-hidden=\"true\"></i>";
		downloads.addEventListener("click", this.downloads.bind(this));
		this.DOM[1][0].appendChild(downloads);

		var recentlyClosed = document.createElement('div');
		recentlyClosed.className = "item";
		recentlyClosed.setAttribute("title","Recently Closed Tabs");
		recentlyClosed.innerHTML = "<i class=\"fa fa-history\" aria-hidden=\"true\"></i>";
		recentlyClosed.addEventListener("click", this.recentlyClosed.bind(this));
		this.DOM[1][0].appendChild(recentlyClosed);

		var allApps = document.createElement('div');
		allApps.className = "item";
		allApps.setAttribute("title","All chrome applications")
		allApps.innerHTML = "<i class=\"fa fa-th-large\" aria-hidden=\"true\"></i>";
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
		this.triggerSearch("@recently-closed-tabs");
	},
	allApps: function(){
		this.triggerSearch("@apps");
	},
	downloads:function(){
		this.triggerSearch("@downloads");
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