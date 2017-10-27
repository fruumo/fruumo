var dommy = require('dommy.js');
var amazon = require('./amazon-affiliate-api');
require('./amazon.scss');
module.exports = {
	message:"Amazon Search",
	containerClass:"amazon-display-container",
	priority:"105",
	icon:true,
	timeout:true,
	client: amazon.createClient({
		awsId: "AKIAJHJ4HBXC4YNMZENA",
		awsSecret: "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",
		awsTag: "fruumo04-20"
	}),
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
				var apiDomain = 'webservices.amazon.com';
				//we know user is from canada or US.
				if(storage.location.countryCode == "US")
					apiDomain = 'webservices.amazon.com';
				if(storage.location.countryCode == "CA")
					apiDomain = 'webservices.amazon.ca';

				var q = query.replace('amazon ','');
				if(q.trim() == ""){
					resolve({
						query:this.query,
						containerClass:this.containerClass,
						div:false
					});
					return;
				}
				fruumo.eye.loader.startLoad();
				this.client.itemSearch({
					Keywords: q.trim(),
					searchIndex: 'All',
					responseGroup: 'ItemAttributes,Offers,Images',
					domain: apiDomain
				}).then(function(results){
					resolve({
						query:this.query,
						containerClass:this.containerClass,
						div:this.createElement(results.Items.Item)
					});
					fruumo.eye.loader.endLoad();
				}.bind(this)).catch(function(err){
					fruumo.eye.loader.endLoad();
					throw err;
				});

			}.bind(this));

		}.bind(this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Amazon Search"
		d.appendChild(t);
		var k = 0;
		for(var i in results){
			if(!results[i].ItemAttributes.ListPrice){
				continue;
			}
			k++;
			var result = dommy({
				tag:'div',
				attributes:{class:'result', 'data-url':results[i].DetailPageURL},
				events:{
					click:function(){
						ga('send', 'event', 'search', 'fruumo-amazon', appVersion);
						window.top.location = this.getAttribute('data-url');
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'image-holder'},
					children:[
					{
						tag:'img',
						attributes:{class:'image', src:results[i].MediumImage.URL}
					}
					]
				},
				{
					tag:'div',
					attributes:{class:'details-holder'},
					children:[
					{
						tag:'div',
						attributes:{class:'title'},
						children:[{type:'text',value:results[i].ItemAttributes.Title}]
					},{
						tag:'div',
						attributes:{class:'price'},
						children:[{type:'text',value:results[i].ItemAttributes.ListPrice.FormattedPrice}]
					}
					]
				}
				]
			});
			d.appendChild(result);
		}
		if(k == 0)
			return false;
		return d;
	}
};