var SQL = require('./sql.js');
window.db = null;
loadDb(function(){});
window.lastSearch = null;
chrome.runtime.onMessage.addListener(function(request,sender, respond){
	if(request.type != "history-search"){
		return;
	}
	if(window.lastSearch!= null){
		if(request.data.query.indexOf(window.lastSearch.query) != -1 && lastSearch.results.length == 0){
			respond([]);
			return;
		}
	}
	var query = request.data.query;
	loadDb(function(){
		var stmt = db.prepare("SELECT * FROM history WHERE (host LIKE '"+query+"%') ORDER BY visitCount DESC, typedCount DESC LIMIT 2;");
		var results =[];
		while(stmt.step()){
			results.push(stmt.getAsObject());
		}
		stmt.free();
		window.lastSearch = {
			query:query,
			results:results
		};
		respond(results);
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
		db = new SQL.Database(Uint8Array.from(results.searchDb));
		//db.prepare();
		cb();
	});
}


function firstDbSetup(cb){
	db = new SQL.Database();
	db.run("CREATE TABLE history (id, url UNIQUE, title, host, lastVisitTime, visitCount, typedCount);");
	chrome.history.search({text:"", startTime:new Date().getTime()-604800000, maxResults:10000}, function(history){
		console.log("Adding to Autocomplete Database:" + history.length);
		for(var i in history){
			addToDb(history[i]);
		}
		chrome.storage.local.set({searchDb:Array.from(db.export())}, function(){
			cb();
		});
	});
}

function addToDb(historyItem){
	var extractor = document.createElement('a');
	extractor.href = historyItem.url;
	db.run("INSERT OR IGNORE INTO history VALUES (?,?,?,?,?,?,?)", [historyItem.id, extractor.protocol+"//"+extractor.hostname, historyItem.title, extractor.hostname.replace('www.',''), historyItem.lastVisitTime, historyItem.visitCount, historyItem.typedCount]);
	return;
}
function updateDb(historyItem){
	var extractor = document.createElement('a');
	extractor.href = historyItem.url;
	db.run("INSERT OR REPLACE INTO history VALUES (?,?,?,?,?,?,?)", [historyItem.id, extractor.protocol+"//"+extractor.hostname, historyItem.title, extractor.hostname.replace('www.',''), historyItem.lastVisitTime, historyItem.visitCount, historyItem.typedCount]);
	return;
}

chrome.history.onVisited.addListener(function(historyItem){
	if(historyItem.url.indexOf("chrome://")!= -1)
		return;
	updateDb(historyItem);
	chrome.storage.local.set({searchDb:Array.from(db.export())}, function(){
		cb();
	});
});