var vector = require('./vector');

var Empty = function() {
    this.type = 'empty';
    this.pheromone = null;
}

var Wall = function(strength) {
    this.type = 'wall';
    this.strength = strength;
}

var Sugar = function(amount) {
    this.type = 'sugar';
    this.amount = amount;
}

var Home = function(team) {
    this.type = 'home';
    this.team = team;
    this.stored = 0;
}


var Ant = function(team, position) {
    this.team = team;
    this.position = position // vector
    this.hasFood = false;
    this.isTrampled = false;
    this.direction = "left" // chosen from "right", "up", "down"
}

var Map = function(width, height, sugars) {
    this.map = newMap(width, height, sugars);
    this.tl = vector.Vec2(2, 2)
    this.br = vector.Vec2(width-3, height-3);
}

function newMap(width, height, sugars) {
    if(height < 10) {
        height = 10;
    }
    if(width < 10) {
        width = 10;
    }

    var map = new Array(height);
    for (var y = 0; y < height; y++) {
        map[y] = new Array(width);
    }

    for (var y = 0; y < width; y++) {
        for (var x = 0; x < width; x++) {
            map[y][x] = new Wall();
        }
    }

    for(var i = 0; i < sugars; i++) {
        var x = Math.floor(Math.random() * height);
        var y = Math.floor(Math.random() * width);
        map[y][x] = new Sugar(10);
    }

    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
            map[i][j] = new Empty();
            map[height-i-1][width-j-1] = new Empty();
        }
    }

    map[2][2] = new Home("tl");
    map[height-3][width-3] = new Home("br");

    return map;
}

module.exports = {
    Empty: Empty,
    Wall: Wall,
    Sugar: Sugar,
    Home: Home,
    Ant: Ant,
    Map: Map
};
