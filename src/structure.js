var Empty = function() {
    this.type = 'empty';
}
var Wall = function(strength) {
    this.type = 'wall';
    this.strength = strength;
    this.dig = function() {
        this.strength--;
    }
}
var Sugar = function(amount) {
    this.type = 'sugar';
    this.amount = amount;
    this.collect = function() {
        this.amount--;
        return amount;
    }
}
var Home = function(team) {
    this.type = 'home';
    this.team = team;
    this.stored = 0;
    this.deposit = function() {
        this.stored++;
    }
}

function newMap(width, height) { // TODO

}


var map = new Array(20);
for (var y = 0; y < 20; y++) {
    map[y] = new Array(20);
}

for (var y = 0; y < 20; y++) {
    for (var x = 0; x < 20; x++) {
        map[y][x] = new Tile();
    }
}
