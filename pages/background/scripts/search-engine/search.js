/*
 	To do:
 		- Rewrite frecency algorithm
 		- Handle bookmarks removal addition
 		- Handle reseting database function
 		- Frecency is not handling bookmark views properly
 		- Fallback if indexing failure
 		- Show indexing message when indexing
 		*/
 		var fLink = 100;
 		var fTyped = 150;
 		var fAutoBookmark = 75;
 		var fReload,fStartPage,fFormSubmit,fKeyword,fGenerated = 0;
 		var fCutoff1 = 4;
 		var fCutoff2 = 14;
 		var fCutoff3 = 31;
 		var fCutoff4 = 90;
 		var fWeight1 = 100;
 		var fWeight2 = 70;
 		var fWeight3 = 50;
 		var fWeight4 = 30;
 		var fWeight5 = 10;
 		module.exports = {
 			name:"sem",
 			db: undefined,
 			openDb: function(callback, force) {
 				if (!this.db || force) {
 					this.db = openDatabase('fruumodb', '1.0', 'Fruumo data', 100 * 1024 * 1024);
 					this.db.transaction(function(tx){
 						if(!force)
 							console.log("Creating database tables");
 						tx.executeSql(`CREATE TABLE IF NOT EXISTS urls (
 							url TEXT, hostname TEXT, type NUMERIC,
 							title TEXT, frecency NUMERIC DEFAULT -1,
					id NUMERIC DEFAULT 0)`);
						tx.executeSql(`CREATE TABLE IF NOT EXISTS titles (
							hostname TEXT,
							title TEXT)`) // type1 = history item, type2 = bookmark
 						tx.executeSql('CREATE INDEX IF NOT EXISTS urlindex ON urls (url)');
 						tx.executeSql('CREATE UNIQUE INDEX IF NOT EXISTS hostnameindex ON urls (hostname)');
 						tx.executeSql('CREATE INDEX IF NOT EXISTS titleindex ON urls (title)');
 						tx.executeSql('CREATE INDEX IF NOT EXISTS frecencyindex ON urls (frecency)');
 						tx.executeSql('CREATE INDEX IF NOT EXISTS typeindex ON urls (type)');
 						callback();
 					}.bind(this));
 				} else {
 					callback();
 				}
 			},
 			onload: function(){
 				var self = this;
 				this.openDb(function(){
			//Count number of items in db and check if indexing is required
				self.db.transaction(function(tx){
						tx.executeSql('SELECT count(*) FROM urls',[], function(tx, results){
							if(results.rows[0]['count(*)'] == 0){
								self.buildIndex();
							}
						});
					});
				});

 				chrome.history.onVisited.addListener(function(historyItem){
 					if(historyItem.url.indexOf("chrome://")!= -1 || historyItem.url.indexOf("chrome-extension://")!= -1)
 						return;
 					self.addItemToIndex(historyItem);
 				}.bind(this));

 				chrome.runtime.onMessage.addListener(function(request,sender, respond){
 					// if(self.indexCount > 0){
 					// 	return respond([{
 					// 		title:"Fruumo is currently building it's index to serve your searches better",
 					// 		url:"https://fruumo.com/indexing"
 					// 	}]);
 					// }
 					if(request.type != "history-search"){
 						return;
 					}
 					var query = request.data.query;
 					if(query[query.length-1] == " "){
 						return respond([]);
 					}
 					this.db.transaction(function(tx){
 						//tx.executeSql('SELECT * FROM urls WHERE ( (hostname LIKE ?) OR (hostname LIKE ?) OR (title LIKE ?) ) ORDER BY frecency DESC LIMIT 4' ,['%'+query+'%','%'+query.replace('www.','')+'%','%'+query+'%'], function(tx, results){
 						tx.executeSql(`SELECT * FROM urls JOIN 
 								(SELECT hostname, count(title) as tc, title as ntitle FROM titles 
 									WHERE (hostname LIKE ? OR hostname LIKE ?) AND NOT hostname = title  
 									GROUP BY hostname,title
 								) as f 
 							ON f.hostname = urls.hostname WHERE ((urls.hostname LIKE ?) OR (urls.hostname LIKE ?) OR (urls.title LIKE ?)) GROUP BY urls.hostname HAVING max(f.tc) ORDER BY frecency DESC LIMIT 4 
 							` ,['%'+query+'%','%'+query.replace('www.','')+'%','%'+query+'%','%'+query.replace('www.','')+'%','%'+query+'%'], function(tx, results){
 							var resultSet = [];
 							for(var i=0;i<=results.rows.length-1; i++){
 								resultSet.push(results.rows.item(i));
 								resultSet[i].title = resultSet[i].ntitle;
 								if(resultSet[i].ntitle == ""){
 									resultSet[i].title = resultSet[i].hostname;
 								}
 							}
 							respond(resultSet);
 						}, console.log);	
 					});

 					return true;
 				}.bind(this));

 				chrome.bookmarks.onCreated.addListener(function(id, bookmark){
 					this.indexBookmarks(bookmark);
 				}.bind(this));
 				chrome.bookmarks.onRemoved.addListener(function(id,removeInfo){
 					console.log(id);
 					this.removeItemFromIndex({
 						id:id
 					});
 				}.bind(this));
 			},
	//Assumes DB is open
	buildIndex:function(){
		var self = this;
		chrome.history.search({text:"", startTime:new Date().getTime()-1209600000, maxResults:50000}, function(history){
			console.log("Adding to Autocomplete Database:" + history.length);
			for(var i in history){
				historyItem = history[i];
				if(historyItem.url.indexOf("chrome://")!= -1 || historyItem.url.indexOf("chrome-extension://")!= -1)
					continue;
				self.addItemToIndex(historyItem, function(){});
			}
		});
		chrome.bookmarks.getTree(function(tree){
			for(var i in tree)
				this.indexBookmarks(tree[i]);
		}.bind(this));
	},
	addItemToIndex:function(historyItem, callback){
		var cb = function(){}
		if(callback){
			cb = callback;
		}
		self = this;
		this.openDb(function(){
			chrome.history.getVisits({url:this.url}, function(visitItems){
				visitItems.reverse();
				var extractor = document.createElement('a');
				if(!this.type){
					extractor.href = this.url;
					this.url = extractor.protocol+"//"+extractor.hostname.replace(/\/$/, "");
					this.hostname = extractor.hostname.replace(/\/$/, "");
					this.hostname = this.hostname.replace('www.','');
				} else if(this.type == 2){
					this.hostname = this.url.replace('http://','').replace('https://','');
				}
				self.db.transaction(function(tx){
					//tx.executeSql('IF EXISTS(SELECT hostname FROM urls WHERE hostname = ?) UPDATE ',[this.hostname])
					this.frecency = self.score(visitItems, this.type);
					cb();
					if(this.title == "")
						this.title = this.hostname;
					tx.executeSql('UPDATE urls SET frecency=frecency+?,title=? WHERE hostname=?' ,[this.frecency,this.title, this.hostname], function(tx, results){					
						if(results.rowsAffected < 1){
							tx.executeSql('INSERT INTO urls (id,type, url, hostname, title,frecency) VALUES (?,?, ?,?, ?,?)', [this.rId?this.rId:null,this.type?this.type:1, this.url,this.hostname,this.title,this.frecency],function(){}, console.log);
						}
							tx.executeSql('INSERT INTO titles (hostname, title) VALUES (?,?)', [this.hostname,this.title]);
					}.bind(this),console.log);
				}.bind(this));
			}.bind(this));
		}.bind(historyItem),true);
	},
	removeItemFromIndex: function(removeInfo){
		if(removeInfo.id){
			return this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM urls WHERE id=? ',[removeInfo.id], function(){}, function(){});
			});
		}
		if(removeInfo.hostname){
			return this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM urls WHERE hostname=?',[removeInfo.hostname], function(){}, function(){});
			});	
		}
	},
	indexBookmarks: function(tree){
		//base case
		if(tree.url){
			this.addItemToIndex({
				rId:tree.id,
				url:tree.url,
				title:tree.title,
				type:2
			});
			return;
		}
		if(tree.children.length >0){
			for(var i in tree.children){
				this.indexBookmarks(tree.children[i]);
			}
		}
	},
	score:function(visitItems,type) {
		var vi = '';
		var singleVisitPoints = 0;
		var summedVisitPoints = 0;
		var bonus = 0;
		var bucketWeight = 0;
		var days = 0;
		// For each sampled recent visits to this URL...
		var totalSampledVisits = Math.min(visitItems.length);
		for (var x=0; x < totalSampledVisits; x++) {
			singleVisitPoints = 0;
			bonus = 0;
			bucketWeight = 0;
			days = 0;
			vi = visitItems[x];
			// Determine which bonus score to give
			switch (vi.transition) {
				case "link":
				bonus = fLink;
				break;
				case "typed":
				bonus = fTyped;
				break;
				case "auto_bookmark":
				bonus = fAutoBookmark;
				break;
				case "reload":
				bonus = fReload;
				break;
				case "start_page":
				bonus = fStartPage;
				break;
				case "form_submit":
				bonus = fFormSubmit;
				break;
				case "keyword":
				bonus = fKeyword;
				break;
				case "generated":
				bonus = fGenerated;
				break;
				default:
				break;
			}
			//bookmark bonus
			if(type == 2){
				bonus = 200;
			}

			// Determine the weight of the score, based on the age of the visit
			days = ((new Date().getTime()/1000) - (vi.visitTime/1000)) / 86400;
			if (days < fCutoff1) {
				bucketWeight = fWeight1;
			} else if (days < fCutoff2) {
				bucketWeight = fWeight2;
			} else if (days < fCutoff3) {
				bucketWeight = fWeight3;
			} else if (days < fCutoff4) {
				bucketWeight = fWeight4;
			} else {
				bucketWeight = fWeight5;
			}

			// Calculate the points
			singleVisitPoints = (bonus / 100) * bucketWeight;
			if(isNaN(singleVisitPoints)){
				singleVisitPoints = 0;
			}
			summedVisitPoints = summedVisitPoints + singleVisitPoints;
		}

		// Calculate and return the frecency score for the URL
		return Math.ceil(visitItems.length * summedVisitPoints / totalSampledVisits);
	}
}