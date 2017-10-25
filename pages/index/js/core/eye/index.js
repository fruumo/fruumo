require('./eye.scss');
module.exports = {
	name:'Fruumo Eye',
	DOM:['.fruumo-eye'],
	onload: function(){
		var loader = {
			currentCount : 0,
			updateLoad:function(){
				var elem = document.getElementsByClassName('fruumo-eye')[0];
				if(this.currentCount <= 0){
					this.currentCount = 0;
					elem.className = elem.className.replace(" spinning", "");
				} else {
					if(elem.className.indexOf('spinning')== -1)
						elem.className+= " spinning";
				}
			},
			startLoad: function(){
				this.currentCount++;
				this.updateLoad();
			}, 
			endLoad: function(){
				this.currentCount--;
				this.updateLoad();
			}
		}
		window.fruumo.eye = {};
		window.fruumo.eye.loader = loader;
	}
};