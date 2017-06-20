require('./search.scss');

module.exports = {
	name:'search',
	searchTimeout:undefined,
	DOM:['.search-bar','.search-results','.topsites-container','.search-container','.cancel-search','.wallpaper'],
	searchEngines:[
		require("./core/googleSuggestion.js"),
		require("./core/apps.js"),
		require("./core/bookmarks.js"),
		require("./core/recentlyClosed.js")
	],
	searchFunctions:[
	],
	containers:[],
	onload: function(){
		//this.DOM[0][0].addEventListener('focus',this.toggleResults.bind(this));
		//this.DOM[0][0].addEventListener('blur',this.toggleResults.bind(this));	
		this.DOM[0][0].addEventListener('keyup', this.onKey.bind(this));
		this.DOM[4][0].addEventListener('click', this.cancelSearch.bind(this));
		for(var i in this.searchEngines){
			this.containers.push(this.searchEngines[i].containerClass);
		}

		document.addEventListener("click", function(event){
			for(var i in event.path){
				if(event.path[i].className == "inner-container" || event.path[i].className == "statusbar")
					return;
			}
			this.cancelSearch();
		}.bind(this));

		//bind for escape
		document.addEventListener("keyup", function(e){
			if(e.key == "Escape"){
				this.cancelSearch();
				return;
			}
		}.bind(this));
	},
	cancelSearch:function(){
		this.DOM[0][0].value = "";
		this.cancelResults();
		return;
	},
	cancelResults: function(){
		this.DOM[3][0].className = "search-container";
		this.DOM[1][0].className = "search-results";
		this.DOM[2][0].className = "topsites-container";
		while(this.DOM[1][0].lastChild)
			this.DOM[1][0].removeChild(this.DOM[1][0].lastChild);
		this.DOM[5][0].style.opacity = "1";
	},
	showResults: function(){
		this.DOM[3][0].className = "search-container searching";
		this.DOM[1][0].className = "search-results show";
		this.DOM[2][0].className = "topsites-container hide";
		this.DOM[5][0].style.opacity = "0.4";
	},
	onKey: function(e){
		if(this.DOM[0][0].value.trim() == ""){	
				this.cancelResults();
				return;
			}
		if(this.searchTimeout){
			clearTimeout(this.searchTimeout);
		}
		this.searchTimeout = setTimeout(function(){
			var query = this.DOM[0][0].value+"";
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
						if(oldContainer){
							this.DOM[1][0].removeChild(oldContainer);
						}
						var myPriority = results.div.getAttribute('data-priority')
						if(!myPriority){
							this.DOM[1][0].appendChild(results.div);	
							return;
						}

						//Find next lowest priority and insertbefore
						var lowerPriority;
						myPriority = parseInt(myPriority);
						var children = this.DOM[1][0].children;
						for(var i in children){
							if(children[i].nodeType != 1){
								continue;
							}
							var otherPriority = children[i].getAttribute('data-priority');
							if(otherPriority){
								if(otherPriority > myPriority){
									continue;
								} else {
									lowerPriority = children[i];
									break;
								}
							}
						}
						if(lowerPriority){
							this.DOM[1][0].insertBefore(results.div, lowerPriority);
						} else {
							this.DOM[1][0].appendChild(results.div,children[0]);
						}
					}
					this.hideEmptyResults();
				}.bind(this));
			}
		}.bind(this), 0);
	},
	hideEmptyResults:function(){
		if(this.DOM[1][0].children.length > 0)
			this.showResults();
		else
			this.cancelResults();
	}
};