require("./topsites.scss");
var dommy = require('dommy.js');
module.exports = {
	name:'topsites',
	DOM:['.topsites-container'],
	onload: function(){
		chrome.topSites.getAsync()
		.then(function(topsites){
			for(var i in topsites){
				if(i > 9) break;
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
						elems[0].style.backgroundImage = "url('"+storage.screenshots[i].image+"')";
					}
				});
			},0);
		}.bind(this));
	}
};