var render = require('../../default-result-render/index.js');
var fuzzy = require('fuzzyjs');
module.exports = {
	message:"Command-wallpaper",
	containerClass:"command-wallpaper-container command-container",
	icon:true,
	priority:"102",
	search: function(query){
		var $this = this;
		$this.query = query;
		if(query.indexOf('@') != 0){
			return Promise.resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:false
			});
		}
		return new Promise(function(resolve, reject){
			resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:fuzzy.test($this.query.replace('@',''), 'refresh Wallpaper')?$this.createElement():false
			});
		}.bind($this));
	},
	createElement: function(){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		d.appendChild(render({
			title:"Refresh Wallpaper",
			url:"This command will refresh the current wallpaper",
			launch:"",
			imgSrc:"",
			imgError: function(){
				this.style.opacity = 0;
			}, 
			click: function(){
				ga('send', 'event', 'search', 'command refresh wallpaper', appVersion);
				document.getElementsByClassName('wallpaper')[0].style.filter = "blur(4px)";
				chrome.runtime.sendMessage({type:'refresh-wallpaper'});
				document.getElementsByClassName('search-bar')[0].value = "";
				document.getElementsByClassName('search-bar')[0].dispatchEvent(new KeyboardEvent('keyup',{'key':'a'}));
			}
		}));
		return d;
	}
};