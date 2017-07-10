require("./topsites.scss");
var dommy = require('dommy.js');
module.exports = {
	name:'topsites',
	DOM:['.topsites-container'],
	displayTopsites:true,
	bannedTopsites:[],
	preload: function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get({"bannedTopsites":[]}, function(storage){
				this.bannedTopsites = storage.bannedTopsites;
			}.bind(this));
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
				var banned = false;
				for(var j in this.bannedTopsites){
					if(topsites[i].url.indexOf(this.bannedTopsites[j]) != -1){
						banned = true;
						break;
					}
				}
				if(banned){
					continue;
				}
				if(i > 15) break;
				var topsiteElement = dommy({
					tag:'div',
					attributes:{
						class:"topsite-container"
					},
					children:[
					{
						tag:'a',
						attributes:{
							class:"topsite",
							"data-url":topsites[i].url,
							"href":topsites[i].url
						},
						events:{
							click:function(e){
								chrome.tabs.getCurrent(function(tab){
									chrome.runtime.sendMessage(
									{
										type:"screenshot", 
										data:{
											tabId:tab.id,
											url:this.getAttribute('data-url')
										}
									});
								  	ga('send', 'event', 'Most Visited', 'click', appVersion);
								}.bind(this));
							}
						},
						children:[
						{
							tag:'div',
							attributes:{
								'class':'remove-topsite'
							},
							children:[
							{
								tag:'i',
								attributes:{
									class:"fa fa-times",
									'aria-hidden':"true"
								},
								events:{
									click:function(e){
										e.stopPropagation();
										e.preventDefault();
										var topContainer = this.parentNode.parentNode;
										var hostname = topContainer.hostname;
										if (confirm('Are you sure you want to remove ' + hostname + ' from Fruumo?')) {
											chrome.storage.sync.get({"bannedTopsites":[]}, function(storage){
												storage.bannedTopsites.push(hostname);
												chrome.storage.sync.set({"bannedTopsites":storage.bannedTopsites}, function(){
													location.reload();
												});
											});
										}
									}
								}
							}
							]
						},
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
				chrome.storage.local.get({screenshots:{}}, function(storage){
					/*if(storage.screenshots == null)
						return;*/
					for(var i in storage.screenshots){
						var elems = document.querySelectorAll("[wallpaper-url='"+i+"']");
						if(elems[0] && storage.screenshots[i].image)
							elems[0].style.backgroundImage = "url('"+storage.screenshots[i].image+"')";
					}
					var images = document.getElementsByClassName('image');
					for(var i in images){
						if(!images[i].style)
							return;
						if(images[i].style.backgroundImage == ""){
							fetch('https://www.googleapis.com/pagespeedonline/v1/runPagespeed?screenshot=true&strategy=desktop&url='+images[i].getAttribute('wallpaper-url'))
							.then(function(response){
								if(response.ok)
									return response.json();
							})
							.then(function(data){
								if(!data){
									return;
								}
								this.data = data;
								this.style.backgroundImage = "url('data:image/jpeg;base64," + data.screenshot.data.replace(/\_/g,'/').replace(/\-/g,'+') +"')";
								chrome.storage.local.get({"screenshots":{}}, function(storage){
									storage.screenshots[this.getAttribute('wallpaper-url')] ={};
									storage.screenshots[this.getAttribute('wallpaper-url')].image = "data:image/jpeg;base64,"+this.data.screenshot.data.replace(/\_/g,'/').replace(/\-/g,'+');
									storage.screenshots[this.getAttribute('wallpaper-url')].timestamp = 0;
									chrome.storage.local.set(storage);
								}.bind(this));
							}.bind(images[i]))
							.catch(function(){
								return;
							});
						}
					}
				});
			},0);
		}.bind(this));
	}
};