require('./index.scss');

document.getElementById("app-version").innerText = chrome.app.getDetails().version;
var updateList = document.getElementById("update-list");
var updates = JSON.parse(localStorage.updateScreen);
for(var i in updates){
	var li = document.createElement('li');
	li.innerText = updates[i];
	updateList.appendChild(li);
}
