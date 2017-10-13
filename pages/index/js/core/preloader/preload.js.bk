module.exports = {
	name:'domain-preloader',
	DOM:['.preloads'],
	onload:function(){
		window.preloadedUrls = [];
		window.startPreloadUrl = function(url){
			if(window.preloadedUrls.indexOf(url)!= -1){
				return;
			}
			window.preloadedUrls.push(url);
			var p = document.createElement('link');
			p.setAttribute('rel','prefetch');
			p.setAttribute('href',url);
			document.getElementsByClassName('preloads')[0].appendChild(p);
		}
 		if(localStorage.dev != "fruumo"){
	 		chrome.topSites.getAsync()
			.then(function(topsites){
				for(var i in topsites){
					if(i>10){
						return;
					}
					startPreloadUrl(topsites[i].url);
				}
			}.bind(this));
		}
		if(localStorage.dev == "fruumo"){
			window.startPreloadUrl = function(url){
				chrome.runtime.sendMessage({type:'preload-url', data:{url:url}});
			}
		}
		window.moveUrl = function(url){
			if(localStorage.dev != 'fruumo'){
				window.top.location = url;
				return;
			}
			chrome.runtime.sendMessage({type:'visit-url', data:{url:url}}, function(response){
				if(response.type == 'not-preloaded'){
					window.top.location = this;
				}
			}.bind(url));
		}
	}
};