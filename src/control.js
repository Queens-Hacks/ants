var World = require('./world');

var display;
var tc, tlcount, brcount, tickNum;
var outputleft, ouputright;
var inputleft, inputright;
var sourceSupplied, gameWorld, winner;

function init(options) {
    display = options.display;
    tc = options.tc;
    tlcount = options.tlcount;
    brcount = options.brcount;
    tickNum = options.tickNum;
    outputleft = options.outputleft;
    outputright = options.ouputright;
    inputleft = options.inputleft;
    inputright = options.inputright;
    sourceSupplied = options.sourceSupplied;
    gameWorld = options.gameWorld;
    winner = options.winner;
}

function pause() {
    var imageTag = document.querySelector("#play-pause > img");
    if (paused) {
        if (winner != 0) {
            return;
        }
        imageTag.setAttribute("src", "pause.png");
        imageTag.setAttribute("alt", "pause");
        paused = false;
        if (!sourceSupplied) {
            gameWorld.setSources(inputleft.getValue(), inputright.getValue());
            sourceSupplied = true;
        }
        run();
    } else {
        paused = true;
        imageTag.setAttribute("src", "play.png");
        imageTag.setAttribute("alt", "play");
    }
}

function restart() {
    winner = 0;
    sourceSupplied = false;
    gameWorld = new World.World();
    paused = true;
    tickNum = 0;
    tc.textContent = "Tick Number " + tickNum;
    tlcount.textContent = gameWorld.map.getSugar('tl');
    brcount.textContent = gameWorld.map.getSugar('br');
    outputleft.setValue("~~ Pink Program Log ~~");
    outputright.setValue("~~ Blue Program Log ~~");
    display.render(gameWorld);
}

var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 100);
};

function run() {
    if (paused) {
        return;
    }
    if (winner === 0) {
        winner = gameWorld.step();
        tickNum++;
    } else {
        pause();
    }
    display.render(gameWorld, winner);
    tc.textContent = "Tick Number " + tickNum;
    tlcount.textContent = gameWorld.map.getSugar('tl');
    brcount.textContent = gameWorld.map.getSugar('br');
    requestAnimFrame(run);
}

module.exports = {
    restart: restart,
    pause: pause,
    run: run,
    init: init
};
