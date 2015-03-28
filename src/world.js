var struct = require('./structure');
var vector = require('./vector');
var player = require('./player');


function World(tlSource, brSource) {
    this.map = new struct.Map(80, 50, 25); // goldenish ratio
    this.tl = new player.Player("tl", tlSource, map.tl, world);
    this.br = new player.Player("br", brSource, map.br, world);

    this.step = function() {
        this.tl.step();
        this.br.step();
    }
}

module.exports = {
    World: World
};
