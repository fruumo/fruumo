var Typer = function(element,words) {
  this.element = element;
  var delim = element.dataset.delim || ","; // default to comma
  this.words = words // non empty words
  this.delay = element.dataset.delay || 40;
  this.loop = element.dataset.loop || "true";
  this.deleteDelay = element.dataset.deletedelay || element.dataset.deleteDelay || 800;

  this.progress = { word:Math.floor(Math.random() * this.words.length), char:0, building:true, atWordEnd:false, looped: 0 };
  this.typing = false;

  //this.doTyping();
};

Typer.prototype.start = function() {
  if (!this.typing) {
    this.typing = true;
    this.doTyping();
  }
};
Typer.prototype.stop = function() {
  this.typing = false;
  var r = Math.floor(Math.random() * this.words.length);
  while(r == this.progress.word){
  	r = Math.floor(Math.random() * this.words.length)
  }
  this.progress = { word:r, char:0, building:true, atWordEnd:false, looped: 0 };
};
Typer.prototype.doTyping = function() {
  var e = this.element;
  var p = this.progress;
  var w = p.word;
  var c = p.char;
  var currentChar = this.words[w][c];
  p.atWordEnd = false;
  if (p.building) {
    e.placeholder += currentChar;
    p.char += 1;
    if (p.char == this.words[w].length) {
      p.building = false;
      p.atWordEnd = true;
    }
  } else {
    e.placeholder = e.placeholder.slice(0, -1);
    if (!this.element.placeholder) {
      p.building = true;
      //p.word = (p.word + 1) % this.words.length;
      var r = Math.floor(Math.random() * this.words.length);
      while(r == p.word){
      	r = Math.floor(Math.random() * this.words.length)
      }
      p.word = r;
      p.char = 0;
    }
  }

  if(p.atWordEnd) p.looped += 1;

  if(!p.building && (this.loop == "false" || this.loop <= p.looped) ){
    this.typing = false;
  }

  var myself = this;
  setTimeout(function() {
    if (myself.typing) { myself.doTyping(); };
  }, p.atWordEnd ? this.deleteDelay : this.delay);
};

module.exports = {
	name:'moving-placeholder',
	DOM:['.search-bar'],
	strings:["How tall is Donald trump?", "Your chrome apps", "Any URL", "@rct", "@weather", "3+4" ,"@downloads", "@sort", "Something from your bookmarks"],
	onload: function(){
    chrome.topSites.getAsync()
    .then((topsites) => {
      for(var i in topsites){
        if(i > 4){
          break;
        }
        if(topsites[i].url.length < 45){
          this.strings.push(topsites[i].url);
        }
        if(topsites[i].title.length < 45){
          this.strings.push(topsites[i].title);
        }
      }
    });
		window.searchBarTyper = new Typer(this.DOM[0][0],this.strings);
	}
};