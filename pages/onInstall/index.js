require('./index.scss');
if(localStorage.username != undefined){
	window.top.location = "../index/index.html";
}
function storeAndAnimate(no){
	if(!no){
		var name = document.getElementById("name").value;
		if(name.trim() == ""){
			localStorage.username = ""
		} else {
			localStorage.username = document.getElementById("name").value;
		}
	} else {
		localStorage.username = "";
	}
	document.getElementsByClassName('container')[0].style.opacity = "0";
	document.getElementsByClassName('corner-icon')[0].className += " center";
	setTimeout(function(){
		window.top.location = "../index/index.html";
	}, 2000);
}

document.getElementById("submit-name").addEventListener("click", function(e){
	storeAndAnimate(false);
});
document.getElementById("name").addEventListener("keyup", function(e){
	if(e.key == "Enter"){
		storeAndAnimate(false);
	}
});

document.getElementById("no-thanks").addEventListener("click", function(e){
	storeAndAnimate(true);
});
