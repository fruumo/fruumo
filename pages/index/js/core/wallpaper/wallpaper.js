require('./wallpaper.scss');
module.exports = {
	name:'wallpaper',
	DOM:['.wallpaper', '.wallpaper > .wallpaper-meta > .location', '.wallpaper > .wallpaper-meta > .author','.container'],
	onload: function(){
		this.setWallpaper();
		chrome.storage.onChanged.addListener(function(changes,area){
			if(area != "local") return;
			if(!changes.wallpaper) return;
			this.setWallpaper();
		}.bind(this));
		
		//document.addEventListener('mousemove', this.activeWallpaper.bind(this));
	},
	setWallpaper: function(){
		chrome.storage.local.get({"wallpaper":{}, "wallpaperTimestamp":0},function(storage){
			document.body.style.color = storage.wallpaper.fontColor;
			this.DOM[0][0].style.display="none";
			this.DOM[0][0].style.backgroundImage = "url('"+storage.wallpaper.image+"')";
			setTimeout(function(){this.DOM[0][0].style.display="block";}.bind(this), 0);
			if(storage.wallpaper.location)
				this.DOM[1][0].innerText = storage.wallpaper.location.title;
			if(storage.wallpaper.author){
				this.DOM[2][0].innerHTML = "";
				var link = document.createElement('a');
				link.href = storage.wallpaper.author.links.html;
				link.innerText =  storage.wallpaper.author.name;
				this.DOM[2][0].appendChild(link);
			}
		}.bind(this));
	},
	activeWallpaper: function(mouseEvt){
		//calculate required angle
		var mouseX = mouseEvt.clientX;
		var mouseY = mouseEvt.clientY;
		var angleX = ((mouseY/window.innerHeight) * 14)-7;
		var angleY = ((mouseX/window.innerWidth) * 14)-7;

		this.DOM[0][0].style.transform = "rotateX("+ (-angleX).toFixed(2)+"deg) rotateY("+(angleY).toFixed(2)+"deg)"
	}
};