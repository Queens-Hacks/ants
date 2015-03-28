var world = require('./world');
var Display = require('./graphics');

var source1 = [
  "while (true) {",
  "  var x = 0;",
  "  var y = 0;",
  "  if (this.hasFood) {",
  "    var t = Math.random();",
  "    if (t < 0.25) {",
  "      if this.moveDigDown() {",
  "        y++;",
  "      }",
  "    } else if (t < 0.5) {",
  "      if this.moveDigUp() {",
  "        y--;",
  "      }",
  "    } else if (t < 0.75) {",
  "      if this.moveDigRight() {",
  "        x++;",
  "      }",
  "    } else {",
  "      if this.moveDigLeft() {",
  "        x--;",
  "      }",
  "    }",
  "  } else {",
  "    if (x > 0) {",
  "      this.moveDigLeft();",
  "    } else if (x < 0) {",
  "      this.moveDigRight();",
  "    } else if (y > 0) {",
  "      this.moveDigUp();",
  "    } else if (y < 0) {",
  "      this.moveDigDown();",
  "    }",
  "  }",
  "}"
].join('\n');
var source2 = [
  "while (true) {",
  "  var y = Math.random();",
  "  if (y < 0.25) {",
  "    this.moveDigDown();",
  "  } else if (y < 0.5) {",
  "    this.moveDigUp();",
  "  } else if (y < 0.75) {",
  "    this.moveDigRight();",
  "  } else {",
  "    this.moveDigLeft();",
  "  }",
  "  if (Math.random() < 0.05) {",
  "    this.spray({ 'hello': 'world' });",
  "  }",
  "}"
].join('\n');

var display = new Display(document.getElementById("canvas"));

var theWorld = new world.World(source1, source2);


var requestAnimFrame =
       window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
       function(callback) {
         window.setTimeout(callback, 2000);
       };

// function callback() {
//   theWorld.step();
//   display.render(theWorld);
//
//   requestAnimFrame(callback);
// };
// callback();


var tc = document.getElementById("tickCounter");
var tlcount = document.getElementById("tlCount");
var brcount = document.getElementById("brCount");
var tickNum = 0;

setInterval(function() {
  theWorld.step();
  display.render(theWorld);

  tickNum++;
  tc.textContent = tickNum;
  tlcount.textContent = theWorld.tl.ants.length;
  brcount.textContent = theWorld.br.ants.length;

  // TODO(michael): Check for win conditions etc
}, 100);
