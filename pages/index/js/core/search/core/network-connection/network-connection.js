require('./network-connection.scss');
var render = require('../../default-result-render/index.js');

module.exports = {
	message:"Network Connection",
	containerClass:"network-connection-container",
	icon:true,
	priority:"110",
	search: function(query){
		var $this = this;
		$this.query = query;
		console.log('test');
		return new Promise(function(resolve, reject){
			resolve({
				query:$this.query,
				containerClass:$this.containerClass,
				div:navigator.onLine?false:$this.createElement()
			});
		}.bind($this));
	},
	createElement: function(){
		var d = document.createElement('div');
		d.className = this.containerClass;
		d.setAttribute('data-priority',this.priority);
		d.appendChild(render({
			title:"Connection error",
			url:"Chrome is not connected to the internet.",
			launch:"",
			fontawesome:"fa-wifi"
		}));
		return d;
	}
};