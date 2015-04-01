var World = require('./world');
var Control = require('./control');
var Display = require('./graphics');

var controlOptions = {
    display: new Display(document.getElementById("canvas")),

    tc: document.getElementById("tickCounter"),
    tlcount: document.getElementById("tlCount"),
    brcount: document.getElementById("brCount"),
    tickNum: 0,
    
    outputleft: ace.edit("logboxleft"),
    outputright: ace.edit("logboxright"),

    // create the ace editors
    inputleft: ace.edit("inputleft"),
    inputright: ace.edit("inputright"),

    sourceSupplied: false,
    gameWorld: new World.World(),
    winner: 0
};

Control.init(controlOptions);

global.paused = true; // TODO export by control

controlOptions.outputleft.setTheme("ace/theme/monokai");
controlOptions.outputleft.setReadOnly(true);
global.outputleft = controlOptions.outputleft; // TODO export by control

controlOptions.outputright.setTheme("ace/theme/monokai");
controlOptions.outputright.setReadOnly(true);
global.outputright = controlOptions.outputright; // TODO export by control

controlOptions.inputleft.setTheme("ace/theme/monokai");
controlOptions.inputleft.getSession().setMode("ace/mode/javascript");

controlOptions.inputright.setTheme("ace/theme/monokai");
controlOptions.inputright.getSession().setMode("ace/mode/javascript");

controlOptions.display.render(controlOptions.gameWorld);
controlOptions.outputleft.setValue("~~ Pink Program Log ~~");
controlOptions.outputright.setValue("~~ Blue Program Log ~~");

var pausebtn = document.getElementById("play-pause");
pausebtn.addEventListener('click', function(e) {
    e.preventDefault();
    Control.pause();
});

var restartbtn = document.getElementById("restart");
restartbtn.addEventListener('click', function(e) {
    e.preventDefault();
    Control.restart();
});

var fileuploadleft = document.getElementById("fileuploadleft");
fileuploadleft.addEventListener('change', function(e) {
  var files = e.target.files; // FileList object

  var reader = new FileReader();
  reader.onload = function(e) {
    controlOptions.inputleft.setValue(e.target.result);
  };

  reader.readAsText(files[0]);
});

var fileuploadright = document.getElementById("fileuploadright");
fileuploadright.addEventListener('change', function(e) {
  var files = e.target.files; // FileList object

  var reader = new FileReader();
  reader.onload = function(e) {
    controlOptions.inputright.setValue(e.target.result);
  };

  reader.readAsText(files[0]);
});
