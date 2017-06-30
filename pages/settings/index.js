require('./index.scss');

chrome.storage.sync.get(null, function(storage){
	console.log(storage);
	var displayTopsites = document.getElementById("display-topsites");
	var time = document.getElementById("24h");
	var focusMode = document.getElementById("focus-mode");
	var reset = document.getElementById("reset");
	if(storage.settingDisplayTopsites){
		displayTopsites.checked = true;
	}
	if(storage.settingIs24h){
		time.checked = true;
	}
	if(storage.settingFocus){
		focusMode.checked = true;
	}
	
	displayTopsites.addEventListener("click", function(){
		chrome.storage.sync.set({settingDisplayTopsites:this.checked});
	});

	time.addEventListener("click", function(){
		chrome.storage.sync.set({settingIs24h:this.checked});
	});

	focusMode.addEventListener("click", function(){
		chrome.storage.sync.set({settingFocus:this.checked});
	});

	reset.addEventListener("click", function(){
		chrome.storage.sync.set({settingsReset:true}, function(){
			location.reload();
		});
	});
});