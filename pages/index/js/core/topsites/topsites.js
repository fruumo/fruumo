require("./topsites.scss");
var dommy = require('dommy.js');
module.exports = {
	name:'topsites',
	DOM:['.topsites-container'],
	onload: function(){
		chrome.topSites.getAsync()
		.then(function(topsites){
			/*
				<div class = "topsite">
					<div class = "background">
					</div>
					<div class = "title-container">
						<div class = "favicon">
						</div>
						<div class = "title">
						</div>
					</div>
				</div>*/
			for(var i in topsites){
				if(i >= 8) break;
				var topsiteElement = dommy({
					tag:'div',
					attributes:{
						class:"topsite-container"
					},
					children:[
					{
						tag:'div',
						attributes:{
							class:"topsite"
						},
						children:[
							{
								tag:'div',
								attributes:{
									class:"image"
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
		}.bind(this));
	}
};