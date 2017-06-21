require("./topsites.scss");
var dommy = require('dommy.js');
module.exports = {
	name:'topsites',
	DOM:['.topsites-container'],
	displayTopsites:true,
	preload: function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get("settingDisplayTopsites", function(storage){

				if(storage.settingDisplayTopsites == undefined || storage.settingDisplayTopsites == true){
					this.displayTopsites = true;
				} else {
					this.displayTopsites = false;
				}

				//dynamic settings
				chrome.storage.onChanged.addListener(function(changes, area){
					if(area != "sync")
						return;
					if(changes.settingDisplayTopsites == undefined)
						return;
					if(changes.settingDisplayTopsites.newValue == undefined)
						return;
					if(changes.settingDisplayTopsites.newValue){
						this.displayTopsites = true;
						this.DOM[0][0].innerHTML = "";
						this.onload();
					} else {
						this.displayTopsites = false;
						this.DOM[0][0].innerHTML = "";
					}
				}.bind(this));

				resolve(true);
			}.bind(this));
		}.bind(this));
	},
	onload: function(){
		if(!this.displayTopsites)
			return;
		chrome.topSites.getAsync()
		.then(function(topsites){
			for(var i in topsites){
				if(i > 7) break;
				var topsiteElement = dommy({
					tag:'div',
					attributes:{
						class:"topsite-container"
					},
					children:[
					{
						tag:'div',
						attributes:{
							class:"topsite",
							"data-url":topsites[i].url
						},
						events:{
							click:function(e){
								localStorage.screenshotUrl = this.getAttribute('data-url');
								window.top.location = this.getAttribute('data-url');
							}
						},
						children:[
						{
							tag:'div',
							attributes:{
								class:"image",
								"wallpaper-url":topsites[i].url
							}
						},
						{
							tag:'div',
							attributes:{
								class:"title-container"
							},
							children:[
							{
								tag:'div',
								attributes:{
									class:"favicon"
								},
								children:[
								{
									tag:'img',
									attributes:{
										src:"chrome://favicon/"+topsites[i].url
									}
								}
								]
							},
							{
								tag:"div",
								attributes:{
									class:"title"
								},
								children:[
								{
									type:'text',
									value:topsites[i].title
								}
								]
							}
							]
						}
						]
					}
					]
				});
				this.DOM[0][0].appendChild(topsiteElement);

			}
			setTimeout(function(){
				chrome.storage.local.get({screenshots:null}, function(storage){
					if(storage.screenshots == null)
						return;
					for(var i in storage.screenshots){
						var elems = document.querySelectorAll("[wallpaper-url='"+i+"']");
						if(elems[0])
							elems[0].style.backgroundImage = "url('"+storage.screenshots[i].image+"')";
					}
				});
			},0);
		}.bind(this));
	}
};