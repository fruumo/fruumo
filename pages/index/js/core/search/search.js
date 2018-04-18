require('./search.scss');
var mousetrap = require('mousetrap');

module.exports = {
	name:'search',
	DOM:['.search-bar','.search-results','.topsites-container','.search-container','.cancel-search','.wallpaper','.time-container','.ticker-container'],
	searchEngines:[
	require("./core/google/googleSuggestion.js"),
	require("./core/apps/apps.js"),
	//require("./core/bookmarks/bookmarks.js"),
	require("./core/recentlyClosed/recentlyClosed.js"),
	require("./core/downloads/downloads.js"),
	require("./core/sessions/sessions.js"),
	require("./core/opentabs/opentabsearch.js"),
	require('./core/autocomplete/autocomplete.js'),
	require("./core/command-sort-tabs/command.js"),
	require("./core/command-refresh-all/command.js"),
	require("./core/command-weather/weather.js"),
	require("./core/command-wallpaper/command.js"),
	require("./core/amazon-search/amazon.js"),
	require("./core/amazon-search/amazon-search-link.js"),
	require("./core/network-connection/network-connection.js")
	],
	lastQuery:"",
	containers:[],
	resultElements:[],
	keyboardSelectedResult:-1,
	searchVisible:true,
	preload:function(){
		return new Promise(function(resolve, reject){
			chrome.storage.sync.get({"searchVisible":true}, function(storage){
				if(!storage.searchVisible){
					this.searchVisible = false;
				}
				//dynamic settings
				chrome.storage.onChanged.addListener(function(changes, area){
					if(area != "sync")
						return;
					if(changes.searchVisible){
						location.reload();
					}
				}.bind(this));

				resolve(true);
			}.bind(this));
		}.bind(this));
	},
	onload: function(){
		if(!this.searchVisible){
			this.DOM[3][0].style.display = "none";
			return;
		}
		this.DOM[0][0].addEventListener('keyup', this.onKey.bind(this));
		this.DOM[4][0].addEventListener('click', this.cancelSearch.bind(this));
		for(var i in this.searchEngines){
			this.containers.push(this.searchEngines[i].containerClass);
		}

		document.addEventListener("click", function(event){
			for(var i in event.path){
				if(!event.path[i].className)
					continue;
				if(event.path[i].className == "inner-container" || event.path[i].className.indexOf("statusbar")!=-1)
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

		//bind for down arrow
		Mousetrap.bind('down', this.downArrow.bind(this), 'keydown');
		Mousetrap.bind('up', this.upArrow.bind(this), 'keydown');
		// Mousetrap.bind('right', this.downArrow.bind(this), 'keydown');
		// Mousetrap.bind('left', this.upArrow.bind(this), 'keydown');
	},
	cancelSearch:function(){
		this.DOM[0][0].value = "";
		this.cancelResults();
		return;
	},
	cancelResults: function(){
		this.DOM[3][0].className = this.DOM[3][0].className.replace(" searching","");
		this.DOM[1][0].className = this.DOM[1][0].className.replace(" show","");
		this.DOM[2][0].className = this.DOM[2][0].className.replace(" hide","");;

		while(this.DOM[1][0].lastChild)
			this.DOM[1][0].removeChild(this.DOM[1][0].lastChild);
		this.DOM[5][0].style.opacity = "1";
		this.DOM[6][0].style.opacity = "1";
		this.DOM[7][0].style.opacity = "1";
		this.resultElements = [];
		this.keyboardSelectedResult = -1;
	},
	showResults: function(){
		if(this.DOM[3][0].className.indexOf("searching") == -1)
			this.DOM[3][0].className += " searching";
		if(this.DOM[1][0].className.indexOf("show") == -1)
			this.DOM[1][0].className += " show";
		if(this.DOM[2][0].className.indexOf("hide") == -1)
			this.DOM[2][0].className += " hide";

		this.DOM[5][0].style.opacity = "0.4";
		this.DOM[6][0].style.opacity = "0";
		this.DOM[7][0].style.opacity = "0";

		this.keyboardSelectedResult = -1;
		this.resultElements = Array.prototype.slice.call(document.querySelectorAll('.search-results .result'));
		for(var i in this.resultElements){
			if(this.resultElements[i].className.indexOf('result-selected')!=0)
				this.resultElements[i].className = this.resultElements[i].className.replace('result-selected','');
		}
		if(document.getElementsByClassName("amazon-search-link-container")[0] || document.getElementsByClassName("autocomplete-results-container")[0] || document.getElementsByClassName("command-container")[0]){
			this.keyboardSelectedResult = 0;
			this.resultElements[0].className += " result-selected"
		}
	},
	onKey: function(e){
		if(e.key == "ArrowDown"){
			this.DOM[0][0].select();
			this.downArrow(e);
			return;
		}
		if(e.key == "ArrowUp"){
			this.DOM[0][0].select();
			this.upArrow(e);
			return;
		}
		if(e.key == "Enter"){
			this.launchResult(e);
			return;
		}
		if(e.key == "Escape"){
			this.cancelSearch();
			return;
		}
		if(this.DOM[0][0].value.trim() == ""){	
			this.cancelResults();
			return;
		}
		e.stopPropagation();		
		var query = this.DOM[0][0].value+"";
		for(var i in this.searchEngines){
			if(query[0] == "@" && !this.searchEngines[i].icon){
				continue;
			}
			var t = 0;
			if(this.searchEngines[i].timeout){
				if(!this.searchEngines[i].timeoutTime)
					t = 500;
				else
					t=this.searchEngines[i].timeoutTime;
			}
			if(this.searchEngines[i].internalTimeout && this.searchEngines[i].timeout){
				clearTimeout(this.searchEngines[i].internalTimeout);
			}
			this.searchEngines[i].internalTimeout = setTimeout(function(i){
				this.searchEngines[i].search(query).then(function(results){
					if(results.query != this.DOM[0][0].value || results.query != query)
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
			}.bind(this), t,i);
		}
	},
	hideEmptyResults:function(){
		if(this.DOM[1][0].children.length > 0)
			this.showResults();
		//else
			//this.cancelResults();
		},
		downArrow: function(e){
			if(this.DOM[1][0].children.length == 0)
				return; 
			e.preventDefault();
			if(this.resultElements[this.keyboardSelectedResult]){
				this.resultElements[this.keyboardSelectedResult].className =  this.resultElements[this.keyboardSelectedResult].className.replace("result-selected","");
				if(this.resultElements[this.keyboardSelectedResult].getAttribute('data-orig-query')){
					this.DOM[0][0].value = this.resultElements[this.keyboardSelectedResult].getAttribute('data-orig-query');
				}
			}
			this.keyboardSelectedResult++;
			if(this.keyboardSelectedResult >= this.resultElements.length){
				this.keyboardSelectedResult = 0;
			}
			if(this.resultElements[this.keyboardSelectedResult]){
				this.resultElements[this.keyboardSelectedResult].className =  this.resultElements[this.keyboardSelectedResult].className + " result-selected";
				this.resultElements[this.keyboardSelectedResult].scrollIntoView(false);
				if(this.resultElements[this.keyboardSelectedResult].getAttribute('data-search-query')){
					this.DOM[0][0].value = this.resultElements[this.keyboardSelectedResult].getAttribute('data-search-query');
				}
			}
		},
		upArrow: function(e){
			if(this.DOM[1][0].children.length == 0)
				return; 
			e.preventDefault();
			if(this.resultElements[this.keyboardSelectedResult]){
				this.resultElements[this.keyboardSelectedResult].className =  this.resultElements[this.keyboardSelectedResult].className.replace("result-selected","");
				if(this.resultElements[this.keyboardSelectedResult].getAttribute('data-orig-query')){
					this.DOM[0][0].value = this.resultElements[this.keyboardSelectedResult].getAttribute('data-orig-query');
				}
			}
			this.keyboardSelectedResult--;
			if(this.keyboardSelectedResult <= -1){
				this.keyboardSelectedResult = this.resultElements.length-1;
			}
			if(this.resultElements[this.keyboardSelectedResult]){
				this.resultElements[this.keyboardSelectedResult].className =  this.resultElements[this.keyboardSelectedResult].className + " result-selected";
				this.resultElements[this.keyboardSelectedResult].scrollIntoView(false);
				if(this.resultElements[this.keyboardSelectedResult].getAttribute('data-search-query')){
					this.DOM[0][0].value = this.resultElements[this.keyboardSelectedResult].getAttribute('data-search-query');
				}
			}
		},
		headRequest: function(url, callback){
			var http = new XMLHttpRequest();
			http.open('HEAD', url);
			http.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					callback(this.status);
				}
			};
			http.send();
		},
		launchResult: function(e){
			if(this.DOM[0][0].value[(this.DOM[0][0].value.length)-1] != " " && this.DOM[0][0].value.match(/^((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g) != null){
				if(this.DOM[0][0].value.indexOf('http')!= -1){
					window.top.location = this.DOM[0][0].value;
				} else {
					if(!localStorage.smartDomain || localStorage.smartDomain == "true"){
					/*var i = document.createElement('iframe');
					i.src = "http://"+this.DOM[0][0].value;
					i.style.opacity = "0";
					document.body.appendChild(i);*/
					this.headRequest("http://"+this.DOM[0][0].value, function(status){
						if(status == 0){
							ga('send', 'event', 'search', 'search web', appVersion);
							ga('send', 'event', 'search', 'search-engine', localStorage.searchDomain);
							ga('send', 'event', 'fruumo', 'broken-domain-avoided', localStorage.searchDomain);
							window.top.location = localStorage.searchDomain + this.DOM[0][0].value;
						} else {
							window.top.location = "http://"+this.DOM[0][0].value;	
						}
					}.bind(this));
					setTimeout(function(){
						window.top.location = "http://"+this.DOM[0][0].value;
					}.bind(this),1000);
				} else {
					window.top.location = "http://"+this.DOM[0][0].value;
				}	
			}
			return;
		}
		if(this.DOM[1][0].children.length == 0 && this.DOM[0][0].value != ""){
			ga('send', 'event', 'search', 'search web', appVersion);
			ga('send', 'event', 'search', 'search-engine', localStorage.searchDomain);
			window.top.location = localStorage.searchDomain + this.DOM[0][0].value;
			return;
		}
		if(this.keyboardSelectedResult == -1){
			ga('send', 'event', 'search', 'search web', appVersion);
			ga('send', 'event', 'search', 'search-engine', localStorage.searchDomain);
			window.top.location = localStorage.searchDomain + this.DOM[0][0].value;
			return;
		}
		if(this.resultElements[this.keyboardSelectedResult]){
			this.resultElements[this.keyboardSelectedResult].click();
			return;
		}
		if(this.resultElements[0]){
			this.resultElements[0].click();
			return;
		}

	}
};