var struct = require('./structure');
var vector = require('./vector');
var player = require('./player');


function World(player1, player2) {
  this.map = struct.newMap();
  this.player1 = player1;
  this.player2 = player2;

  player1.world = this;
  player2.world = this;
}

World.prototype.step = function () {
  this.player1.step();
  this.player2.step();
};

module.exports = {
  World: World
};
