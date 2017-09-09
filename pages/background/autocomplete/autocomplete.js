window.db = null;

loadDb(function(){});

chrome.runtime.onMessage.addListener(function(request,sender, respond){
	if(request.type != "history-search"){
		return;
	}

	var query = request.data.query;
	loadDb(function(){
		var results = db.partialMatch(query);
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
		respond(returnResults.splice(0,2));
	});
});

function loadDb(cb){
	if(window.db != null){
		cb();
		return;
	}
	chrome.storage.local.get({searchDb:null}, function(results){
		if(results.searchDb == null){
			firstDbSetup(function(){
				cb();
			});
			return;
		}
		db = new TernarySearchTree();
		db.root = results.searchDb;
		cb();
	});
}

chrome.storage.onChanged.addListener(function(changes, area){
	if(area != "local") return;
	if(changes.searchDb){
		if(!changes.searchDb.newValue){
			window.db = null;
			loadDb(function(){});
		}
	}
});


function firstDbSetup(cb){
	db = new TernarySearchTree();
	chrome.history.search({text:"", startTime:new Date().getTime()-1209600000, maxResults:50000}, function(history){
		console.log("Adding to Autocomplete Database:" + history.length);
		for(var i in history){
			addToDb(history[i]);
		}
		chrome.storage.local.set({searchDb:db.root}, function(){
			cb();
		});
	});
}

function addToDb(historyItem){
	var extractor = document.createElement('a');
	extractor.href = historyItem.url;
	historyItem.url = extractor.protocol+"//"+extractor.hostname;
	var subdomainRemoved = extractor.hostname.replace(/^[^.]*\.(?=\w+\.\w+$)/g,'');
	if(!db.contains(extractor.hostname) || !db.contains(subdomainRemoved)){
		db.add(extractor.hostname, historyItem);
		if(subdomainRemoved != extractor.hostname)
			db.add(extractor.hostname.replace(/^[^.]*\.(?=\w+\.\w+$)/g,''), historyItem);
	}
	return;
}

chrome.history.onVisited.addListener(function(historyItem){
	if(historyItem.url.indexOf("chrome://")!= -1)
		return;
	addToDb(historyItem);
	chrome.storage.local.set({searchDb:db.root}, function(){
	});
});