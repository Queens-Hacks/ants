var world = require('./world');
var Display = require('./graphics');

var source1 = [
  "var t = Math.random();",
  "while (true) {",
  "  if (this.hasFood() === false) {",
  " if(Math.random()>.95)  t = Math.random();",
  "    if (t < 0.25) {",
  "      this.moveDigDown();",
  "    } else if (t < 0.5) {",
  "      this.moveDigUp();",
  "    } else if (t < 0.75) {",
  "      this.moveDigRight();",
  "    } else {",
  "      this.moveDigLeft();",
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
var source2 = ["while (true) {",
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

var display = new Display(document.getElementById("canvas"));

// var gameWorld = new world.World(source1, source2);

var tc = document.getElementById("tickCounter");
var tlcount = document.getElementById("tlCount");
var brcount = document.getElementById("brCount");
var tickNum = 0;


var requestAnimFrame =
       window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
       function(callback) {
         window.setTimeout(callback, 100);
       };


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

var paused = false;
var sourceSupplied = false;
var gameWorld = new world.World();

function run() {
  if (paused) { return; }
  gameWorld.step();
  display.render(gameWorld);

  tickNum++;
  tc.textContent = "t = " + tickNum;
  tlcount.textContent = gameWorld.tl.ants.length;
  brcount.textContent = gameWorld.br.ants.length;

  requestAnimFrame(run);
}

var playbtn = document.getElementById("play");
playbtn.addEventListener('click', function(e) {
  e.preventDefault();
  if (!sourceSupplied) {
    gameWorld.setSources(inputleft.getValue(), inputright.getValue());
    sourceSupplied = true;
  }
  paused = false;
  run();
});

var pausebtn = document.getElementById("pause");
pausebtn.addEventListener('click', function(e) {
  e.preventDefault();
  paused = true;
});

var restartbtn = document.getElementById("restart");
restartbtn.addEventListener('click', function(e) {
  e.preventDefault();
  sourceSupplied = false;
  gameWorld = new world.World();
  paused = true;
  outputleft.setValue("~~ Upper Left Program Log ~~");
  outputright.setValue("~~ Lower Right Program Log ~~");
  display.render(gameWorld);
});

display.render(gameWorld);
outputleft.setValue("~~ Upper Left Program Log ~~");
outputright.setValue("~~ Lower Right Program Log ~~");
