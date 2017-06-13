var dommy = require('dommy.js');
require('./bookmarks-search.scss');
module.exports = {
	message:"Bookmarks",
	containerClass:"bookmark-results-container",
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
					div:$this.createElement(bookmarks)
				});

			}.bind($this));
		}.bind($this));
	},
	createElement: function(results){
		if(results.length == 0)
			return false;
		var d = document.createElement('div');
		d.className = "bookmark-results-container";
		for(var i in results){
			var result = dommy({
				tag:'div',
				attributes:{class:'result','data-url':results[i].url},
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
						attributes:{class:'icon', src:'https://s2.googleusercontent.com/s2/favicons?domain='+results[i].url}
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
						children:[{type:'text',value:results[i].title}]
					},
					{
						tag:'div',
						attributes:{class:'url'},
						children:[{type:'text',value:results[i].url}]
					}
					]
				}
				]
			});
			d.appendChild(result);
		}
		return d;
	}
};