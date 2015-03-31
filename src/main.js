var world = require('./world');
var Display = require('./graphics');
var display = new Display(document.getElementById("canvas"));
// Get the elements
var tc = document.getElementById("tickCounter");
var tlcount = document.getElementById("tlCount");
var brcount = document.getElementById("brCount");
var tickNum = 0;
// Helper function
var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 100);
    };
// Create the ace editors
var inputleft = ace.edit("inputleft");
inputleft.setTheme("ace/theme/monokai");
inputleft.getSession().setMode("ace/mode/javascript");
var inputright = ace.edit("inputright");
inputright.setTheme("ace/theme/monokai");
inputright.getSession().setMode("ace/mode/javascript");
var outputleft = ace.edit("logboxleft");
outputleft.setTheme("ace/theme/monokai");
outputleft.setReadOnly(true);
global.outputleft = outputleft;
var outputright = ace.edit("logboxright");
outputright.setTheme("ace/theme/monokai");
outputright.setReadOnly(true);
global.outputright = outputright;
global.paused = true;
var sourceSupplied = false;
var gameWorld = new world.World();
var winner = 0;

function run() {
    if (paused) {
        return;
    }
    if (winner === 0) {
        winner = gameWorld.step();
        tickNum++;
    }
    display.render(gameWorld, winner);
    tc.textContent = "t = " + tickNum;
    tlcount.textContent = gameWorld.map.getSugar('tl');
    brcount.textContent = gameWorld.map.getSugar('br');
    requestAnimFrame(run);
}
var playbtn = document.getElementById("play");
playbtn.addEventListener('click', function(e) {
    if (!paused || winner != 0) {
        return;
    }
    paused = false;
    e.preventDefault();
    if (!sourceSupplied) {
        gameWorld.setSources(inputleft.getValue(), inputright.getValue());
        sourceSupplied = true;
    }
    run();
});
var pausebtn = document.getElementById("pause");
pausebtn.addEventListener('click', function(e) {
    e.preventDefault();
    paused = true;
});
var restartbtn = document.getElementById("restart");
restartbtn.addEventListener('click', function(e) {
    winner = 0;
    e.preventDefault();
    sourceSupplied = false;
    gameWorld = new world.World();
    paused = true;
    tickNum = 0;
    tc.textContent = "t = " + tickNum;
    tlcount.textContent = gameWorld.map.getSugar('tl');
    brcount.textContent = gameWorld.map.getSugar('br');
    outputleft.setValue("~~ Pink Program Log ~~");
    outputright.setValue("~~ Blue Program Log ~~");
    display.render(gameWorld);
});
display.render(gameWorld);
outputleft.setValue("~~ Pink Program Log ~~");
outputright.setValue("~~ Blue Program Log ~~");


var fileuploadleft = document.getElementById("fileuploadleft");
fileuploadleft.addEventListener('change', function(e) {
  var files = e.target.files; // FileList object

  var reader = new FileReader();
  reader.onload = function(e) {
    inputleft.setValue(e.target.result);
  };

  reader.readAsText(files[0]);
});

var fileuploadright = document.getElementById("fileuploadright");
fileuploadright.addEventListener('change', function(e) {
  var files = e.target.files; // FileList object

  var reader = new FileReader();
  reader.onload = function(e) {
    inputright.setValue(e.target.result);
  };

  reader.readAsText(files[0]);
});
