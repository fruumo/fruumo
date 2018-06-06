require('./index.scss');

document.getElementById("app-version").innerText = chrome.app.getDetails().version;
document.getElementById("username").innerText = (localStorage.username == "" || !localStorage.username? " there": localStorage.username);

var updateList = document.getElementById("update-list");
var updates = JSON.parse(localStorage.updateScreen);
for(var i in updates){
	var li = document.createElement('li');
	li.innerText = updates[i];
	updateList.appendChild(li);
}


document.getElementById("display-changes").addEventListener("click", function(e){
	//this.style.display = "none";
	document.getElementById("update-list").style.display = "block";
});