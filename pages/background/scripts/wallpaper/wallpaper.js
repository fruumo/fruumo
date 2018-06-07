module.exports = {
	name:'wallpaper-manager',
	onload: function(){
		const UNSPLASH_API_ID = "a7d6cc6f5ce74fcf56703608563d852c6f7b110a82b1e10cf58e0ead897cc223";
		var UNSPLASH_collection = 947821;
		//test is 922352;
		//UNSPLASH_collection = 922352;
		chrome.alarms.onAlarm.addListener((alarm)=>{
			if(alarm.name != "refresh-wallpaper" ){
				return;
			}
			this.refreshWallpaper();
		});

		chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
			if (request.type != "refresh-wallpaper"){
				return;
			}
			this.refreshWallpaper();	
		});
	},
	refreshWallpaper: function(){
		chrome.storage.local.get({settingCustomWallpaper:false}, function(storage){
			if(storage.settingCustomWallpaper)
				return;
			console.log('refreshing wallpaper...');
			var max = 0;
			var min = 24;
			var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			var date = new Date();
			var tod = "";
			if(date.getHours() <= 5){tod = "night"}
			else if(date.getHours() <= 11){tod = "morning"}
			else if(date.getHours() <= 18){tod = "afternoon"}
			else if(date.getHours() <= 20){tod = "evening"}
			else {tod = "night"}

			fetch("http://api.fruumo.com/wallpaper/"+tod+"?r="+Math.random())
			.then(function(response){
				if(response.ok)
					return response.json();
			})
			.then(function(data){
				//Get new wallpaper data
				//regular or full
				var sWidth = screen.width >= screen.height?screen.width:screen.height;
				var sHeight = screen.height < screen.width?screen.height:screen.width;
				var img = document.createElement('img');
				img.addEventListener('load', function(){
					var canvas = document.createElement('canvas');
					canvas.width = this.naturalWidth;
					canvas.height = this.naturalHeight;
					canvas.getContext('2d').drawImage(this,0,0);
					var dataUrl = canvas.toDataURL('image/webp',0.92);
					chrome.storage.local.set({wallpaper:{image:dataUrl,author:data.user,location:data.location, color:data.color}});
				});
				img.setAttribute('src', ""+data.imageLink+"&w="+(sWidth)+"&h="+(sHeight));
			});
		});
	}
}

