require('./search.scss');

module.exports = {
	name:'search',
	searchTimeout:undefined,
	DOM:['.search-bar','.search-results','.topsites-container','.search-container'],
	searchEngines:[
		require("./core/bookmarks.js")
	],
	searchFunctions:[
	],
	containers:[],
	onload: function(){
		//this.DOM[0][0].addEventListener('focus',this.toggleResults.bind(this));
		//this.DOM[0][0].addEventListener('blur',this.toggleResults.bind(this));	
		this.DOM[0][0].addEventListener('keyup', this.onKey.bind(this));
		for(var i in this.searchEngines){
			this.containers.push(this.searchEngines[i].containerClass);
		}
	},
	cancelResults: function(){
		this.DOM[3][0].className = "search-container";
		this.DOM[1][0].className = "search-results";
		this.DOM[2][0].className = "topsites-container";
		setTimeout(function(){
			while(this.DOM[1][0].lastChild)
				this.DOM[1][0].removeChild(this.DOM[1][0].lastChild);
		}.bind(this),300);
	},
	showResults: function(){
		this.DOM[3][0].className = "search-container searching";
		this.DOM[1][0].className = "search-results show";
		this.DOM[2][0].className = "topsites-container hide";
	},
	onKey: function(e){
		if(e.key == "Escape"){
			this.DOM[0][0].value = "";
			this.cancelResults();
			return;
		}
		if(this.DOM[0][0].value.trim() == ""){	
				this.cancelResults();
				return;
			}
		if(this.searchTimeout){
			clearTimeout(this.searchTimeout);
		}
		this.searchTimeout = setTimeout(function(){
			var query = this.DOM[0][0].value;
			this.searchFunctions = [];
			for(var i in this.searchEngines){
				this.searchEngines[i].search(query).then(function(results){
					if(results.query != query)
						return;
					var oldContainer = document.getElementsByClassName(results.containerClass)[0];
					if(results.div == false){
						if(oldContainer){
							this.DOM[1][0].removeChild(oldContainer);
							this.hideEmptyResults();
						}
						return;
					}
					if(!results.div.isEqualNode(oldContainer)){
						if(oldContainer)
							this.DOM[1][0].removeChild(oldContainer);
						this.DOM[1][0].appendChild(results.div);
					}
					this.hideEmptyResults();
				}.bind(this));
			}
		}.bind(this), 50);
	},
	hideEmptyResults:function(){
		if(this.DOM[1][0].children.length > 0)
			this.showResults();
		else
			this.cancelResults();
	}
};