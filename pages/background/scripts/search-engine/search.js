var elasticlunr = require('elasticlunr');
module.exports = {
	name:"search-engine-manager",
	scoreDb:{},
	idx:elasticlunr(function () {
		this.setRef('id');
		this.addField('title');
		this.addField('subtitle');
	}),
	onload: function(){
		chrome.bookmarks.getTree(function(tree){
			for(var i in tree)
				this.indexBookmarks(tree[i]);
		}.bind(this));
	},
	indexBookmarks: function(tree){
		//base case
		if(tree.url){
			this.idx.addDoc({
				id:'bookmark:'+tree.id,
				title:tree.title,
				subtitle:tree.url
			});
			return;
		}
		if(tree.children.length >0){
			for(var i in tree.children){
				this.indexBookmarks(tree.children[i]);
			}
		}
	},
	calculateScore: function(url, callback, notCascade){
		chrome.history.getVisits({url:url}, function(visits){
			var totalVisits = visits.length;
			var sampleSize = 20;
			var score = 0;
			for(var i in visits.slice(0,20)){
				var currentVisit = visits[i];
				var today = new Date().getTime()/1000;
				var days = (today - (currentVisit.visitTime/1000)) / 86400;
				var weight = 10;
				var bonus = 0;
				if(days < 4){
					weight = 100;
				} else if(days < 14){
					weight = 70;
				} else if(days < 31){
					weight = 50;
				} else if(days < 90){
					weight = 30;
				}
				if(currentVisit.transition == "link"){
					bonus = 120;
				}
				if(currentVisit.transition == "typed"){
					bonus = 200;
				}
				score = score + ((bonus / 100.0) * weight);
			}
			return callback((score/sampleSize)*totalVisits);

		}.bind(this));
	}
}