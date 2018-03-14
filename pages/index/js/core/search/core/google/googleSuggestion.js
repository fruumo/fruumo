var dommy = require('dommy.js');
require('./googleSuggestion.scss');
module.exports = {
	message:"Google Instant",
	containerClass:"google-instant-container",
	priority:"50",
	search: function(query){
		var $this = this;
		$this.query = query;
		if(query.indexOf('@') == 0 || query == ""){
			return Promise.resolve({
				query:query,
				containerClass:this.containerClass,
				div:false
			});
		}
		if(query.indexOf(' ') != -1){
			this.priority = "1000";
		} else {
			this.priority = "50";
		}
		return new Promise(function(resolve, reject){
			fetch("http://suggestqueries.google.com/complete/search?client=firefox&q=" + encodeURIComponent($this.query))
			.then(function(response){
				if(response.ok)
					return response.json();
			})
			.then(function(json){
				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(json[1])
				});
			})
			.catch(function(err){
			});

		}.bind($this));
	},
	createElement: function(results,query){
		var d = document.createElement('div');
		d.className = "google-instant-container";
		d.setAttribute('data-priority',this.priority);
		if(results.length == 0){
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-overwrite-link':'true','data-search-query':this.query, 'data-orig-query':this.query},
				events:{
					click:function(){
					  	ga('send', 'event', 'search', 'search web', appVersion);
					  	ga('send', 'event', 'search', 'search-engine', localStorage.searchDomain);
						window.top.location = localStorage.searchDomain + this.getAttribute('data-search-query');
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'details-holder'},
					children:[
					{
						tag:'div',
						attributes:{class:'title'},
						children:[{type:'text',value:this.query}]
					},
					{
						tag:'div',
						attributes:{class:'url'},
						children:[{type:'text',value:"Search the web"}]
					}				
					]
				}
				]
			});
			d.appendChild(result);
			return d;
		}
		for(var i=0; i<= 3;i++){
			if(!results[i])
				break;
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-overwrite-link':'true','data-search-query':results[i], 'data-orig-query':this.query},
				events:{
					click:function(){
					  	ga('send', 'event', 'search', 'search web', appVersion);
					  	ga('send', 'event', 'search', 'search-engine', localStorage.searchDomain);
						window.top.location = localStorage.searchDomain + this.getAttribute('data-search-query');
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'details-holder'},
					children:[
					{
						tag:'div',
						attributes:{class:'title'},
						children:[{type:'text',value:results[i]}]
					},
					{
						tag:'div',
						attributes:{class:'url'},
						children:[{type:'text',value:"Search the web"}]
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