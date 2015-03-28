var world = require('./world');
var Display = require('./graphics');

var source1 = [
  "while (true) {",
  "  if (this.hasFood() === false) {",
  "    var t = Math.random();",
  "    if (t < 0.25) {",
  "      this.moveDigDown();",
  "    } else if (t < 0.5) {",
  "      this.moveDigUp();",
  "    } else if (t < 0.75) {",
  "      this.moveDigRight();",
  "    } else {",
  "      this.moveDigLeft();",
  "      this.log('hi there from ' + this.getTeam());",
  "    }",
  "  } else {",
  "    if (this.homeLocation().x > this.location().x) {",
  "      this.moveDigRight();",
  "    }",
  "    if (this.homeLocation().x < this.location().x) {",
  "      this.moveDigLeft();",
  "    }",
  "    if (this.homeLocation().y > this.location().y) {",
  "      this.moveDigDown();",
  "    }",
  "    if (this.homeLocation().y < this.location().y) {",
  "      this.moveDigUp();",
  "    }",
  "  }",
  "}"
].join('\n');
var source2 = source1;

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
  tc.textContent = "t = " + tickNum;
  tlcount.textContent = theWorld.tl.ants.length;
  brcount.textContent = theWorld.br.ants.length;

  // TODO(michael): Check for win conditions etc
}, 100);


var inputleft = ace.edit("inputleft");
inputleft.setTheme("ace/theme/monokai");
inputleft.getSession().setMode("ace/mode/javascript");

var inputright = ace.edit("inputright");
inputright.setTheme("ace/theme/monokai");
inputright.getSession().setMode("ace/mode/javascript");

var outputleft = ace.edit("logboxleft");
outputleft.setTheme("ace/theme/monokai");
outputleft.renderer.setShowGutter(false);
outputleft.setReadOnly(true);
global.outputleft = outputleft;

var outputright = ace.edit("logboxright");
outputright.setTheme("ace/theme/monokai");
outputright.renderer.setShowGutter(false);
outputright.setReadOnly(true);
global.outputright = outputright;
