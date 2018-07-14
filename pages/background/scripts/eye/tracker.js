module.exports = {
	name:'ga',
	onload: () => {
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				if(request.type === 'ga'){
					console.log(request);
					ga('send', 'pageview', '/search_results.php?q='+ request.data.value);
				}
				sendResponse();
			}
		);
	}
}