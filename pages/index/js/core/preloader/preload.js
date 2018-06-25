module.exports = {
	name:'domain-preloader',
	DOM:['.preloads'],
	onload:function(){
		window.fruumo.preloader = {};
		window.fruumo.preloader.preloadedUrls = [];
		window.fruumo.preloader.startPreloadUrl = function(url){
			if(window.fruumo.preloader.preloadedUrls.indexOf(url)!= -1){
				return;
			}
			window.fruumo.preloader.preloadedUrls.push(url);
			var p = document.createElement('link');
			//p.setAttribute('rel','prerender');
			p.setAttribute('rel','prefetch');
			p.setAttribute('href',url);
			document.getElementsByClassName('preloads')[0].appendChild(p);
		}
 		chrome.topSites.getAsync()
		.then((topsites) => {
			for(var i in topsites){
				if(i>10){
					return;
				}
				fruumo.preloader.startPreloadUrl(topsites[i].url);
			}
		});
	}
};