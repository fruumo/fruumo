require('./search.scss');
module.exports = {
	name:'search',
	searchTimeout:undefined,
	DOM:['.search-bar','.search-results','.topsites-container'],
	onload: function(){
		//this.DOM[0][0].addEventListener('focus',this.toggleResults.bind(this));
		//this.DOM[0][0].addEventListener('blur',this.toggleResults.bind(this));	
		this.DOM[0][0].addEventListener('keyup', this.onKey.bind(this));
	},
	toggleResults:function(){
		if(this.DOM[1][0].className.indexOf('show')!= -1){
			this.DOM[1][0].className = "search-results";
			this.DOM[2][0].className = "topsites-container";
		} else {
			this.DOM[1][0].className = "search-results show";
			this.DOM[2][0].className = "topsites-container hide"
		}
	},
	cancelResults: function(){
		this.DOM[1][0].className = "search-results";
		this.DOM[2][0].className = "topsites-container";
	},
	onKey: function(e){
		if(this.searchTimeout){
		clearTimeout(this.searchTimeout);
		}
		this.searchTimeout = setTimeout(function(){
			
		}.bind(this, e), 400);
	}
};