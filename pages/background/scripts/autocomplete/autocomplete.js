var TernarySearchTree = require('./ternary.js');
module.exports = {
	name:"autocomplete-manager",
	db:null,
	loadDb:function(cb){
		if(this.db != null){
			cb();
			return;
		}
		chrome.storage.local.get({searchDb:null}, function(results){
			if(results.searchDb == null){
				this.firstDbSetup(function(){
					cb();
				});
				return;
			}
			this.db = new TernarySearchTree();
			this.db.root = results.searchDb;
			cb();
		}.bind(this));
	},
	firstDbSetup:function(cb){
		this.db = new TernarySearchTree();
		chrome.history.search({text:"", startTime:new Date().getTime()-1209600000, maxResults:50000}, function(history){
			console.log("Adding to Autocomplete Database:" + history.length);
			for(var i in history){
				if(history[i].url.indexOf("chrome://")!= -1 || history[i].url.indexOf("chrome-extension://")!= -1)
					continue;
				this.addToDb(history[i]);
			}
			chrome.storage.local.set({searchDb:this.db.root}, function(){
				cb();
			});
		}.bind(this));
	},
	addToDb:function(historyItem){
		var extractor = document.createElement('a');
		extractor.href = historyItem.url;
		historyItem.url = extractor.protocol+"//"+extractor.hostname;
		var subdomainRemoved = extractor.hostname.replace(/^[^.]*\.(?=\w+\.\w+$)/g,'');
		if(!this.db.contains(extractor.hostname) || !this.db.contains(subdomainRemoved)){
			this.db.add(extractor.hostname, historyItem);
			if(subdomainRemoved != extractor.hostname)
				this.db.add(extractor.hostname.replace(/^[^.]*\.(?=\w+\.\w+$)/g,''), historyItem);
		}
		return;
	},
	onload: function(){
		this.loadDb(function(){});
		chrome.runtime.onMessage.addListener(function(request,sender, respond){
			if(request.type != "history-search"){
				return;
			}

			var query = request.data.query;
			this.loadDb(function(){
				var results = this.db.partialMatch(query);
				var returnResults = [];
				for(var i in results){
					results[i] = results[i].data;
					if(Array.isArray(results[i])){
						for(var j in results[i]){
							returnResults.push(results[i][j]);
						}
					}
				}
				returnResults.sort(function(a,b){
					if(a.visitCount == b.visitCount){
						return 0;
					}
					if(a.visitCount > b.visitCount){
						return -1;
					} else {
						return 1;
					}
				});
				respond(returnResults.splice(0,4));
			}.bind(this));
		}.bind(this));

		chrome.storage.onChanged.addListener(function(changes, area){
			if(area != "local") return;
			if(changes.searchDb){
				if(!changes.searchDb.newValue){
					this.db = null;
					this.loadDb(function(){});
				}
			}
		}.bind(this));

		chrome.history.onVisited.addListener(function(historyItem){
			if(historyItem.url.indexOf("chrome://")!= -1 || historyItem.url.indexOf("chrome-extension://")!= -1)
				return;
			this.addToDb(historyItem);
			chrome.storage.local.set({searchDb:this.db.root}, function(){
			});
		}.bind(this));
	}

}