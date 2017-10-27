var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js'); 
require('./amazon.scss');
module.exports = {
	message:"Amazon-search-link",
	containerClass:"amazon-search-link-container",
	priority:"106",
	icon:true,
	search: function(query){
		this.query = query;
		return new Promise(function(resolve, reject){
			aIndex = query.indexOf('amazon ');
			if(aIndex == -1 || aIndex != 0){
				resolve({
					query:this.query,
					containerClass:this.containerClass,
					div:false
				});
				return;
			}
			chrome.storage.local.get({location:false}, function(storage){
				if(storage.location != false && storage.location.countryCode.indexOf("US")== -1 && storage.location.countryCode.indexOf("CA") == -1){
					resolve({
						query:this.query,
						containerClass:this.containerClass,
						div:false
					});
					return;
				}
				var apiDomain = 'http://www.amazon.com';
				//we know user is from canada or US.
				if(storage.location.countryCode == "US")
					apiDomain = 'https://www.amazon.com/gp/search?ie=UTF8&tag=fruumo04-20&keywords=';
				if(storage.location.countryCode == "CA")
					apiDomain = 'https://www.amazon.ca/gp/search?ie=UTF8&tag=fruumo081-20&keywords=';

				var q = query.replace('amazon ','');
				if(q.trim() == ""){
					resolve({
						query:this.query,
						containerClass:this.containerClass,
						div:false
					});
					return;
				}

				resolve({	
					query:this.query,
					containerClass:this.containerClass,
					div:this.createElement(apiDomain, q)
				});

			}.bind(this));

		}.bind(this));
	},
	createElement: function(api, q){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		d.appendChild(render({
			title:q,
			selected:true,
			url:'Search amazon',
			launch:api+encodeURIComponent(q),
			imgSrc:'https://www.amazon.com/favicon.ico',
			imgError: function(){
				this.style.opacity = "0";
			}, 
			click: function(){
				ga('send', 'event', 'search', 'external-amazon', appVersion);
				window.top.location= this.getAttribute('data-launch');
			}
		})
		);
		return d;
	}
};