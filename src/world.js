var struct = require('./structure');
var vector = require('./vector');
var player = require('./player');


function World(tlSource, brSource) {
    this.map = new struct.Map(80, 50, 25); // goldenish ratio
  console.log(this.map, this.map);
    this.tl = new player.Player("tl", tlSource, this.map.tl, this);
    this.br = new player.Player("br", brSource, this.map.br, this);

    this.step = function() {
        this.tl.step();
        this.br.step();
    };
}

module.exports = {
    World: World
};
