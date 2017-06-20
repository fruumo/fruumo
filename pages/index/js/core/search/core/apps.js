var dommy = require('dommy.js');
require('./apps.scss');
module.exports = {
	message:"App Display",
	containerClass:"apps-display-container",
	search: function(query){
		var $this = this;
		$this.query = query;

		return new Promise(function(resolve, reject){
			if($this.query.indexOf("apps:") != 0){
				resolve({
					query:$this.query,
					containerClass:"apps-display-container",
					div:false
				});
				return;
			}

			chrome.management.getAllAsync()
			.then(function(apps){
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(apps)
				});
			}.bind($this));
		}.bind($this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = "apps-display-container";
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Apps";
		d.appendChild(t);
		for(var i in results){
			if(!results[i].icons || !results[i].isApp || !results[i].enabled)
				continue;
			var result = dommy({
				tag:'div',
				attributes:{class:'result', 'data-id':results[i].id},
				events:{
					click:function(){
						chrome.management.launchApp(this.getAttribute('data-id'));
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'icon-holder'},
					children:[
						{
							tag:'img',
							attributes:{class:'icon', src:results[i].icons[results[i].icons.length-1].url}
						},
						{
							tag:'i',
							attributes:{class:"fa fa-times", 'aria-hidden':"true", 'data-id':results[i].id},
							events:{
								click:function(e){
									chrome.management.uninstall(this.getAttribute('data-id'));
									e.stopPropagation();
								}
							}
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
							children:[{type:'text',value:results[i].shortName}]
						}
					]
				}
				]
			});
			d.appendChild(result);
		}
		return d;
	}
};