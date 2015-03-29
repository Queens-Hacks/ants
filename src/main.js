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
var paused = true;
var sourceSupplied = false;
var gameWorld = new world.World();
var winner = 0;

function run() {
    if (paused) {
        return;
    }
    if (winner === 0) winner = gameWorld.step();
    display.render(gameWorld, winner);
    tickNum++;
    tc.textContent = "t = " + tickNum;
    tlcount.textContent = gameWorld.map.getSugar('tl');
    brcount.textContent = gameWorld.map.getSugar('br');
    requestAnimFrame(run);
}
var playbtn = document.getElementById("play");
playbtn.addEventListener('click', function(e) {
    if (!paused) {
        return;
    }
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