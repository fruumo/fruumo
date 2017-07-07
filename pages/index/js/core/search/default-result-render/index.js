var dommy = require('dommy.js');
require('./index.scss');
module.exports = function(res){
	var imgError = function(){}
	var imgSrc = "";
	if(typeof res.imgError == "function"){
		imgError = res.imgError;	
	} 

	if(res.imgSrc != ""){
		imgSrc = res.imgSrc;
	}
	var click = function(){}
	if(typeof res.click == "function"){
		click = res.click;
	}
	return dommy({
		tag:'div',
		attributes:{class:'result','data-launch':res.launch},
		events:{
			click:click
		},
		children:[
		{
			tag:'div',
			attributes:{class:'icon-holder'},
			children:[
			{
				tag:'img',
				attributes:{class:'icon', src:imgSrc, "data-launch":res.launch},
				events:{
					error:imgError
				}
			}
			]
		},
		{
			tag:'div',
			attributes:{class:'details-holder'},
			children:[
			{
				tag:'div',
				attributes:{class:'title'},
				children:[{type:'text',value:res.title+"" }]
			},
			{
				tag:'div',
				attributes:{class:'url'},
				children:[{type:'text',value:res.url+""}]
			}
			]
		}
		]
	});

};