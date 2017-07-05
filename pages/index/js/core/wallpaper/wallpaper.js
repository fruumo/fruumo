require('./wallpaper.scss');
module.exports = {
	name:'wallpaper',
	resetWallpaper:false,
	DOM:['.wallpaper', '.wallpaper > .wallpaper-meta > .location', '.wallpaper > .wallpaper-meta > .author'],
	onload: function(){
		this.setWallpaper();
		chrome.storage.onChanged.addListener(function(changes,area){
			if(area != "local") return;
			if(!changes.wallpaper) return;
			this.setWallpaper();
		}.bind(this));
		//window.addEventListener('blur', this.notActive.bind(this));
		//window.addEventListener('focus', this.active.bind(this));
		//document.addEventListener('mousemove', this.activeWallpaper.bind(this));
	},
	setWallpaper: function(){
		chrome.storage.local.get({"wallpaper":{}, "wallpaperTimestamp":0},function(storage){
			//document.body.style.color = storage.wallpaper.fontColor;
			document.body.style.backgroundColor = "#000";
			this.DOM[0][0].style.opacity = "0";
			var timeout = 0;
			if(this.DOM[0][0].style.filter.indexOf("blur")!=-1){
				timeout = 700;
			}
			setTimeout(function(){
				this.DOM[0][0].style.backgroundImage = "url('"+storage.wallpaper.image+"')";
				this.DOM[0][0].style.opacity = "1";
				this.DOM[0][0].style.filter = "blur(0px)";
				setTimeout(function(){
					document.body.style.backgroundColor = "#FFF";
				}, 800);
			}.bind(this), timeout);
			
			if(storage.wallpaper.location){
				this.DOM[1][0].innerText = storage.wallpaper.location.title;
			} else {
				this.DOM[1][0].innerText =""
			}
			if(storage.wallpaper.author){
				this.DOM[2][0].innerHTML = "";
				var link = document.createElement('a');
				link.href = storage.wallpaper.author.links.html;
				link.innerText =  storage.wallpaper.author.name;
				this.DOM[2][0].appendChild(link);
				this.DOM[2][0].innerHTML += " / ";
				link = document.createElement('a');
				link.href = "https://unsplash.com";
				link.innerText =  "Unsplash";
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
	},
	notActive : function(){
		this.DOM[0][0].style.backgroundImage = "none";
		this.DOM[0][0].style.display="none";
		this.resetWallpaper = true;
	},
	active: function(){
		if(this.resetWallpaper){
			this.resetWallpaper = false;
			this.setWallpaper();
		}
	}
};