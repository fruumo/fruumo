var dommy = require('dommy.js');
var render = require('../../default-result-render/index.js');
module.exports = {
	message:"Bookmarks",
	containerClass:"bookmark-results-container",
	priority:"51",
	search: function(query){
		var $this = this;
		$this.query = query;
		return new Promise(function(resolve, reject){
			chrome.bookmarks.searchAsync($this.query)
			.then(function(bookmarks){
				bookmarks = bookmarks.filter(function(bookmark){
					return !bookmark.dateGroupModified;
				});
				bookmarks = bookmarks.map(function(bookmark){
					return {
						name:"Bookmark",
						content:bookmark.id,
						title:bookmark.title,
						url:bookmark.url
					}
				});

				resolve({
					query:$this.query,
					containerClass:$this.containerClass,
					div:$this.createElement(bookmarks)
				});

			}.bind($this));
		}.bind($this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		var t = document.createElement('div');
		t.className = "title";
		t.innerText = "Bookmarks";
		d.appendChild(t);
		for(var i in results){
			var parser = document.createElement('a');
			parser.href =results[i].url;
			d.appendChild(
				render({
					title:results[i].title,
					url:results[i].url,
					launch:results[i].url,
					imgSrc:(results[i].url.indexOf("chrome://") != -1 || results[i].url.indexOf("chrome-extension://") !=-1) ?"":'https://s2.googleusercontent.com/s2/favicons?domain='+parser.hostname,
					imgError: function(){
						this.style.opacity = "0";
					}, 
					click: function(){
						ga('send', 'event', 'search', 'launch bookmark', appVersion);
						window.top.location= this.getAttribute('data-launch');
					}
				})
			);
		}
		return d;
	}
};