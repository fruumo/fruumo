const path = require('path');
const webpack = require('webpack');

module.exports = {
	module: {
		rules: [
		  {
		    test: /\.(sass|scss)$/,
		    use: [
		      'style-loader',
		      'css-loader',
		      'sass-loader',
		    ]
		  }
		],
	},
	context: path.resolve(__dirname, './pages/'),
	entry: {
	index: './index/js/index.js',
	},
	output: {
	path: path.resolve(__dirname, './dist/'),
	filename: '[name].bundle.js',
	},
};