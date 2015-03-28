var vector = require('./vector');

var Empty = function() {
    this.type = 'empty';
    this.pheromone = null;
};

var Wall = function(strength) {
    this.type = 'wall';
    this.strength = strength;
};

var Sugar = function(amount) {
    this.type = 'sugar';
    this.amount = amount;
};

var Home = function(team) {
    this.type = 'home';
    this.team = team;
    this.stored = 0;
};

var Ant = function(team, position, world) {
    this.world = world;
    this.team = team;
    this.position = position; // vector
    this.hasFood = false;
    this.isTrampled = false;
    this.direction = "left"; // chosen from "right", "up", "down"

    /* assume sanitized */
    this.move = function(direction) {
        var new_x, new_y;
        if(direction.x === 1 || direction.x === -1) {
            new_x = this.position.x + direction.x;
            new_y = this.position.y;

            if(typeof(world.map[new_x][new_y]) === 'Empty') {
                this.position.x += direction.x;
            } else {
                return false;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            new_x = this.position.x;
            new_y = this.position.y + direction.y;

            if(typeof(world.map[new_x][new_y]) === 'Empty') {
                position.y += direction.y;
            } else {
                return false;
            }
        } else {
            console.log("Weird input to Ant.move()!\n");
            return false;
        }

        return true;
    };

    this.dig = function(direction) {
        var wall_x, wall_y;
        if(direction.x === 1 || direction.x === -1) {
            wall_x = this.position.x + direction.x;
            wall_y = this.position.y;

            if(typeof(world.map[wall_x][wall_y] === 'Wall')) {
                world.map[wall_x][wall_y].strength--;
            }

            if(world.map[wall_x][wall_y] === 'Wall'
               && world.map[wall_x][wall_y].strength === 0) {
                return true;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            wall_x = this.position.x;
            wall_y = this.position.y + direction.y;

            if(typeof(world.map[wall_x][wall_y]) == 'Wall') {
                world.map[wall_x][wall_y].strength--;
            }

            if(world.map[wall_x][wall_y] == 'Wall'
               && world.map[wall_x][wall_y].strength === 0) {
                return true;
            }

        } else {
            console.log("Weird input to Ant.dig()!\n");
            return false;
        }

        return false;
    };
};

function Map(width, height, sugars) {
    this.map = newMap(width, height, sugars);
    this.tl = vector.Vec2(2, 2);
    this.br = vector.Vec2(width-3, height-3);

    this.setPher = function (team, position, value ) {

    };

    this.pherAt = function (team, position) {

    };
}

function newMap(width, height, sugars) {
    var i, j, x, y;

    if(height < 10) {
        height = 10;
    }
    if(width < 10) {
        width = 10;
    }

    var map = new Array(height);
    for (y = 0; y < height; y++) {
        map[y] = new Array(width);
    }

    for (y = 0; y < width; y++) {
        for (x = 0; x < width; x++) {
            map[y][x] = new Wall();
        }
    }

    for(i = 0; i < sugars; i++) {
        x = Math.floor(Math.random() * height);
        y = Math.floor(Math.random() * width);
        map[y][x] = new Sugar(10);
    }

    for(i = 0; i < 5; i++) {
        for(j = 0; j < 5; j++) {
            map[i][j] = new Empty();
            map[height-i-1][width-j-1] = new Empty();
        }
    }

    map[2][2] = new Home("tl");
    map[height-3][width-3] = new Home("br");

    return map;
};

module.exports = {
    Empty: Empty,
    Wall: Wall,
    Sugar: Sugar,
    Home: Home,
    Ant: Ant,
    Map: Map
};
