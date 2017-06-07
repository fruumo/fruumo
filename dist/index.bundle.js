/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = {
	name:'wallpaper',
	DOM:['.wallpaper', '.wallpaper > .wallpaper-meta > .location', '.wallpaper > .wallpaper-meta > .author'],
	onload: function(){
		this.setWallpaper();
		chrome.storage.onChanged.addListener(function(changes,area){
			if(area != "local") return;
			if(!changes.wallpaper) return;
			this.setWallpaper();
		}.bind(this));
	},
	setWallpaper: function(){
		chrome.storage.local.get({"wallpaper":{}, "wallpaperTimestamp":0},function(storage){
			document.body.style.color = storage.wallpaper.fontColor;
			this.DOM[0][0].style.display="none";
			this.DOM[0][0].style.backgroundImage = "url('"+storage.wallpaper.image+"')";
			setTimeout(function(){this.DOM[0][0].style.display="block";}.bind(this), 0);
			if(storage.wallpaper.location)
				this.DOM[1][0].innerText = storage.wallpaper.location.title;
			if(storage.wallpaper.author){
				this.DOM[2][0].innerHTML = "";
				var link = document.createElement('a');
				link.href = storage.wallpaper.author.links.html;
				link.innerText =  storage.wallpaper.author.name;
				this.DOM[2][0].appendChild(link);
			}
		}.bind(this));
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
	promisifyChrome: function(apis){
		for(var i in apis){
			var api = apis[i];
			if(chrome[api] == undefined){
				continue;
			}
			console.debug("Promisifying chrome." + api);
			var chromeKeys = Object.keys(chrome[api]);
			for(var func of chromeKeys){
				if(typeof chrome[api][func] == "function"){
					new function(func, api){
						chrome[api][func+"Async"] = function(args){
							return new Promise(function(resolve, reject){
								var newArgs = Array.prototype.slice.call(this);
								newArgs.push(function(args){
									this(args);
								}.bind(resolve));
								chrome[api][func].apply(this, newArgs);
							}.bind(arguments));
						}
					}(func, api);

				}
			}
		}
	},
	isChrome: function(){
		if(navigator.userAgent.toLowerCase().indexOf('chrome') != -1)
			return true;
		else 
			return false;
	},
	isFirefox: function(){
		if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1)
			return true;
		else 
			return false;
	},
	escapeXml:function(s) {
		var XML_CHAR_MAP = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&apos;'
		};
		return s.replace(/[\<\>\&\"\']/g, function (ch) {
			return XML_CHAR_MAP[ch];
		});
	}

}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".wallpaper {\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  background-size: cover;\n  background-position: center bottom;\n  background-repeat: no-repeat;\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  animation: fadein 700ms;\n  display: none; }\n  .wallpaper .wallpaper-meta {\n    font-size: 14px;\n    opacity: 0.4;\n    font-weight: 200;\n    padding: 10px;\n    position: absolute;\n    bottom: 0px;\n    text-shadow: 0 0 25px rgba(0, 0, 0, 0.4); }\n    .wallpaper .wallpaper-meta a {\n      text-decoration: none;\n      color: inherit; }\n\n@keyframes fadein {\n  from {\n    opacity: 0; }\n  to {\n    opacity: 1; } }\n", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./wallpaper.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./wallpaper.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);

	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(8);
var core = [
	__webpack_require__(0),
	__webpack_require__(10),
	__webpack_require__(13)
];
var utils = __webpack_require__(1);

window.onload = function(){
	utils.promisifyChrome(['tabs','history','bookmarks','downloads']);
	//start loading core
	for(var i in core){
		if(Array.isArray(core[i].DOM)){
			for(j in core[i].DOM){
				core[i].DOM[j] = Array.prototype.slice.call(document.querySelectorAll(core[i].DOM[j]));
			}
		}

		if(core[i].onload != undefined){
			console.log('%c Loading ' + core[i].name, 'color: #A61539; font-size:16px;');
			core[i].onload();
		}
	}
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "html, body {\n  width: 100%;\n  height: 100%;\n  font-family: sans-serif; }\n\nbody {\n  background: black;\n  color: white;\n  overflow: hidden;\n  min-width: 100%;\n  min-height: 100%; }\n  body .container {\n    width: 100%;\n    height: 100%;\n    z-index: 1;\n    background: transparent;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center; }\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(12);
module.exports = {
	name:'time',
	DOM:['.time'],
	onload: function(){
		this.updateTime();
		setInterval(this.updateTime.bind(this), 1000);
		//var date = new Date();
		//this.DOM[1][0].innerText = this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear());
	},
	updateTime: function(){
		var currentTime = new Date();
		var currentHours = currentTime.getHours();
		var currentMinutes = currentTime.getMinutes();		

		//12 hour format
		//if(localStorage.timeFormat == "12h" && currentHours > 12){
		//	currentHours = currentHours - 12;
		//}

		if(currentHours < 10){
			currentHours = "0" + currentHours;
		} else {
			currentHours = "" + currentHours;
		}
		if(currentMinutes < 10){
			currentMinutes = "0" + currentMinutes;
		} else {
			currentMinutes = "" + currentMinutes;
		}
		if(this.DOM[0][0].innerText != currentHours + ":" + currentMinutes)
			this.DOM[0][0].innerText = currentHours + ":" + currentMinutes;
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		//console.log(day,d,m,y);
		
		var dateString = DayArray[day]+", ";
		if(d === 3 || d === 23){
			dateString += d+"rd of ";
		}else if(d === 1 || d === 21 || d === 31){
			dateString += d+"st of ";
		}else if(d == 2 || d == 22){
			dateString += d+"nd of ";
		} else if(d !== 1 || d !== 21 || d !== 31){
			dateString += d+"th of ";
		} 
		
		dateString += monthArray[m] + " " + y ;
		
		return dateString;	
		
	}
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".container .time {\n  z-index: inherit;\n  font-size: 12em;\n  font-weight: 400;\n  margin-top: -2em;\n  text-shadow: 0 0 25px rgba(0, 0, 0, 0.4); }\n\n@media (max-width: 850px) {\n  .container .time {\n    z-index: inherit;\n    font-size: 8em;\n    margin-top: 0em; } }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./time.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./time.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
module.exports = {
	name:'ticker',
	DOM:['.ticker'],
	tickerStrings:[],
	currentTick:0,
	onload: function(){
		var date = new Date();
		this.tickerStrings.push(this.dateToString(date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()));
		this.getWeather();
		this.tick();
		setInterval(this.tick.bind(this), 8000);
	},
	tick: function(){
		if(this.DOM[0][0].innerHTML != this.tickerStrings[this.currentTick]){
			this.DOM[0][0].style.display = "none";
			this.DOM[0][0].innerHTML = this.tickerStrings[this.currentTick];
			setTimeout(function(){this.DOM[0][0].style.display = "block";}.bind(this), 10);
		}
		this.currentTick++;
		if(this.currentTick >= this.tickerStrings.length){
			this.currentTick = 0;
		}
	},
	dateToString: function(day,d,m,y){
		var monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var DayArray = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dateString = DayArray[day]+", ";
		if(d === 3 || d === 23){
			dateString += d+"rd of ";
		}else if(d === 1 || d === 21 || d === 31){
			dateString += d+"st of ";
		}else if(d == 2 || d == 22){
			dateString += d+"nd of ";
		} else if(d !== 1 || d !== 21 || d !== 31){
			dateString += d+"th of ";
		} 
		
		dateString += monthArray[m] + " " + y ;
		
		return dateString;	
		
	},
	getWeather: function(){
		fetch("http://ip-api.com/json")
		.then(function(response){
			if(response.ok)
				return response.json();
		})
		.then(function(ipInfo){
			var lat = ipInfo.lat + "";
			var long = ipInfo.lon + "";
			fetch("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22("+lat+"%2C"+long+")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
			.then(function(response){
				if(response.ok)
					return response.json();	
			})
			.then(function(weather){
				console.log(weather);
				this.tickerStrings.push("It's " + Math.round((weather.query.results.channel.item.condition.temp-32)*5/9) + " &deg;C and "+weather.query.results.channel.item.condition.text+".")
			}.bind(this));
		}.bind(this));
	}
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".ticker-container {\n  z-index: inherit;\n  text-shadow: 0 0 25px rgba(0, 0, 0, 0.4);\n  font-size: 1.5em;\n  font-weight: 200;\n  height: 21px; }\n  .ticker-container .ticker {\n    animation: fadein 1000ms; }\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./ticker.scss", function() {
			var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/sass-loader/lib/loader.js!./ticker.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })
/******/ ]);