var vector = require('./vector');

var Empty = function() {
    this.type = 'empty';
    this.tl_pher = null;
    this.br_pher = null;
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

            if(world.map[new_y][new_x].type === 'Empty') {
                this.position.x += direction.x;
            } else {
                return false;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            new_x = this.position.x;
            new_y = this.position.y + direction.y;

            if(world.map[new_y][new_x].type === 'Empty') {
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

            if(world.map[wall_y][wall_x].type === 'Wall') {
                world.map[wall_y][wall_x].strength--;
            }

            if(world.map[wall_y][wall_x].type === 'Wall'
               && world.map[wall_y][wall_x].strength === 0) {
                return true;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            wall_x = this.position.x;
            wall_y = this.position.y + direction.y;

            if(world.map[wall_y][wall_x].type == 'Wall') {
                world.map[wall_y][wall_x].strength--;
            }

            if(world.map[wall_y][wall_x].type == 'Wall'
               && world.map[wall_y][wall_x].strength === 0) {
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
    this.tl = new vector.Vec2(2, 2);
    this.br = new vector.Vec2(width-3, height-3);

    this.setPher = function (team, position, value ) {
        if(!typeof(this.map[position.y][position.x]) === 'Empty'){
            return false;
        }

        if(team === 'br') {
            this.map[position.y][position.x].br_pher = value;
        } else if(team === 'tl') {
            this.map[position.y][position.x].tl_pher = value;
        } else {
            console.log("Weird input to Map.setPher()!\n");
            return false;
        }
        return true;
    };

    this.pherAt = function (team, position) {
        if(!typeof(this.map[position.y][position.x]) === 'Empty') {
            return null;
        }

        if(team === 'br') {
            return this.map[position.y][position.x].br_pher;
        } else if(team === 'tl') {
            return this.map[position.y][position.x].tl_pher;
        } else {
            console.log("Weird input to Map.pherAt()!\n");
            return null;
        }
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

    var map = [];
    for (y = 0; y < height; y++) {
        map[y] = [];
    }

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            map[y][x] = new Wall();
        }
    }

    for(i = 0; i < sugars; i++) {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
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
