var struct = require('./structure');
var vector = require('./vector');
var player = require('./player');

function World() {
    this.map = new struct.Map(80, 50, 12); // goldenish ratio
    this.tl = new player.Player("tl", this.map.tl, this);
    this.br = new player.Player("br", this.map.br, this);
    this.step = function() {
        this.tl.step();
        this.br.step();
        if (this.map.getSugar('tl') > 75) return('tl');
        if (this.map.getSugar('br') > 75) return('br');

        return 0;
    };
    this.setSources = function(tlSource, brSource) {
        this.tl.setSource(tlSource);
        this.br.setSource(brSource);
    };
}
module.exports = {
    World: World
};
