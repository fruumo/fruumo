require('./search.scss');
var dommy = require('dommy.js');

module.exports = {
	name:'search',
	searchTimeout:undefined,
	DOM:['.search-bar','.search-results','.topsites-container'],
	searchEngines:[
	require("./core/bookmarks.js")
	],
	onload: function(){
		//this.DOM[0][0].addEventListener('focus',this.toggleResults.bind(this));
		//this.DOM[0][0].addEventListener('blur',this.toggleResults.bind(this));	
		this.DOM[0][0].addEventListener('keyup', this.onKey.bind(this));
	},
	toggleResults:function(){
		if(this.DOM[1][0].className.indexOf('show')!= -1){
			this.DOM[1][0].className = "search-results";
			this.DOM[2][0].className = "topsites-container";
		} else {
			this.DOM[1][0].className = "search-results show";
			this.DOM[2][0].className = "topsites-container hide";
		}
	},
	cancelResults: function(){
		this.DOM[1][0].className = "search-results";
		this.DOM[2][0].className = "topsites-container";
	},
	showResults: function(){
		this.DOM[1][0].className = "search-results show";
		this.DOM[2][0].className = "topsites-container hide";
	},
	onKey: function(e){
		if(this.searchTimeout){
			clearTimeout(this.searchTimeout);
		}
		this.searchTimeout = setTimeout(function(){
			while(this.DOM[1][0].lastChild){
				this.DOM[1][0].removeChild(this.DOM[1][0].lastChild);
			}
			if(this.DOM[0][0].value.trim() == ""){
				this.cancelResults();
				return;
			}
			for(var i in this.searchEngines){
				this.searchEngines[i].search(this.DOM[0][0].value)
				.then(this.displayResults.bind(this));
			}
		}.bind(this, e), 400);
	},
	displayResults: function(results){
		if(this.DOM[0][0].value != results.query)
			return;
		if(results.results.length == 0){
			return;
		} else {
			this.showResults();
		}
		var resultsContainer = document.createElement('div');
		resultsContainer.className = 'results-container';
		for(var i in results.results){
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-url':results.results[i].url},
				events:{
					click:function(){
						window.top.location= this.getAttribute('data-url');
					}
				},
				children:[
				{
					tag:'div',
					attributes:{class:'icon-holder'},
					children:[
						{
							tag:'img',
							attributes:{class:'icon', src:'https://s2.googleusercontent.com/s2/favicons?domain='+results.results[i].url}
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
							children:[{type:'text',value:results.results[i].title}]
						},
						{
							tag:'div',
							attributes:{class:'url'},
							children:[{type:'text',value:results.results[i].url}]
						}
					]
				}
				]
			});
			resultsContainer.appendChild(result);
		}
		this.DOM[1][0].appendChild(resultsContainer);
	}
};