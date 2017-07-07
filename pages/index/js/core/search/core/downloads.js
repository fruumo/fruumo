var dommy = require('dommy.js');
require('./downloads.scss');
module.exports = {
	message:"Downloads",
	containerClass:"downloads-results-container",
	priority:"99",
	icon:true,
	search: function(query){
		var $this = this;
		$this.query = query;
		return new Promise(function(resolve, reject){
			if($this.query.indexOf("@downloads") != 0){
				resolve({
					query:$this.query,
					containerClass:"downloads-container",
					div:false
				});
				return;
			}

			chrome.downloads.search({limit:20, orderBy:['-startTime'], state:"complete"}, function(downloads){
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(downloads)
				});
			}.bind($this));
		}.bind($this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = "downloads-results-container";
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Downloads";
		d.appendChild(t);
		for(var i in results){
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-id':results[i].id},
				events:{
					click:function(){
					  	ga('send', 'event', 'search', 'launch download', appVersion);
						chrome.downloads.show(parseInt(this.getAttribute("data-id")));
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'icon-holder'},
					children:[
					{
						tag:'img',
						attributes:{class:'icon', src:"", "data-id":results[i].id},
						events:{
							error:function(e){
								chrome.downloads.getFileIcon(parseInt(this.getAttribute("data-id")), {}, function(c){
									if(!c)
										return;
									this.src = c;
								}.bind(this));
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
						children:[{type:'text',value:results[i].filename.match(/[^/]+(?=$)/)[0] }]
					},
					{
						tag:'div',
						attributes:{class:'url'},
						children:[{type:'text',value:results[i].url}]
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