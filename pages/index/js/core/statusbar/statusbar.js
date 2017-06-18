require('./statusbar.scss');
module.exports = {
	name:'statusbar',
	DOM:['.statusbar','.statusbar>.icon-list','.search-bar'],
	onload: function(){
		var cWallpaper = document.createElement('div');
		cWallpaper.className = "item";
		cWallpaper.setAttribute("title","Get a new wallpaper");
		cWallpaper.innerHTML = "<i class=\"fa fa-picture-o\" aria-hidden=\"true\"></i>";
		cWallpaper.addEventListener("click", this.cWallpaper.bind(this));
		this.DOM[1][0].appendChild(cWallpaper);

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
	cWallpaper:function(){
		document.getElementsByClassName('wallpaper')[0].style.display = "none";
		chrome.alarms.create("refresh-wallpaper", {when:Date.now()+1000, periodInMinutes:60});
	},
	recentlyClosed: function(){
		this.triggerSearch("recently-closed-tabs:");
	},
	allApps: function(){
		this.triggerSearch("apps:");
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