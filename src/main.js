var world = require('./world');
var Display = require('./graphics');

var source1 = [
  "while(true) {",
  "  this.waffle()",
  "}"
].join('\n');
var source2 = source1;

var display = new Display(document.getElementById("canvas"));

var theWorld = new world.World(source1, source2);

setInterval(function() {
  theWorld.step();
  display.render(theWorld);

  // TODO(michael): Check for win conditions etc
}, 333);
