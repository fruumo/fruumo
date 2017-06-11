module.exports = {
	message:"Bookmarks",
	search: function(query){
		return new Promise(function(resolve, reject){
			chrome.bookmarks.searchAsync(query)
			.then(function(bookmarks){

				bookmarks = bookmarks.filter(function(bookmark){
					return !bookmark.dateGroupModified;
				});
				bookmarks = bookmarks.map(function(bookmark){
					console.log(bookmark);
					return {
						name:"Bookmark",
						content:bookmark.id,
						title:bookmark.title,
						url:bookmark.url
					}
				});

				resolve({
					query:query,
					results:bookmarks
				});

			}.bind(query));
		}.bind(query));
	}
};