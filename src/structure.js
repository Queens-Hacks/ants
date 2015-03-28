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
            if (direction.x === 1) {
                this.direction = "right"
            } else {
                this.direction = "left"
            }
            new_x = this.position.x + direction.x;
            new_y = this.position.y;

            if(new_x >= world.map.width || new_x < 0
               || new_y >= world.map.height || new_y < 0) {
                return false;
            }

            if(world.map.map[new_y][new_x].type === 'empty') {
                this.position.x += direction.x;
            } else {
                return false;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            if (direction.y === 1) {
                this.direction = "down"
            } else {
                this.direction = "up"
            }
            new_x = this.position.x;
            new_y = this.position.y + direction.y;

            if(new_x >= world.map.width || new_x < 0
               || new_y >= world.map.height || new_y < 0) {
                return false;
            }

            if(world.map.map[new_y][new_x].type === 'empty') {
                this.position.y += direction.y;
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

            if(wall_x >= world.map.width || wall_x < 0
               || wall_y >= world.map.height || wall_y < 0) {
                return false;
            }

            if(world.map.map[wall_y][wall_x].type === 'wall') {
                world.map.map[wall_y][wall_x].strength--;
            } else if(world.map.map[wall_y][wall_x].type === 'sugar'
                     && this.hasFood === false){
                world.map.map[wall_y][wall_x].amount--;
                this.hasFood = true;

                if(world.map.map[wall_y][wall_x].amount === 0) {
                    world.map.map[wall_y][wall_x] = new Empty();
                }
            } else if(world.map.map[wall_y][wall_x].type === 'home'
                     && this.hasFood === true) {
                world.map.map[wall_y][wall_x].stored++;
                this.hasFood = false;
            }

            if(world.map.map[wall_y][wall_x].type === 'wall'
               && world.map.map[wall_y][wall_x].strength === 0) {
                world.map.map[wall_y][wall_x] = new Empty();
                return true;
            }
        } else if(direction.y === 1 || direction.y === -1) {
            wall_x = this.position.x;
            wall_y = this.position.y + direction.y;

            if(wall_x >= world.map.width || wall_x < 0
               || wall_y >= world.map.height || wall_y < 0) {
                return false;
            }

            if(world.map.map[wall_y][wall_x].type == 'wall') {
                world.map.map[wall_y][wall_x].strength--;
            } else if(world.map.map[wall_y][wall_x].type === 'sugar'
                     && this.hasFood === false){
                world.map.map[wall_y][wall_x].amount--;
                this.hasFood = true;

                if(world.map.map[wall_y][wall_x].amount === 0) {
                    world.map.map[wall_y][wall_x] = new Empty();
                }
            } else if(world.map.map[wall_y][wall_x].type === 'home'
                     && this.hasFood === true) {
                world.map.map[wall_y][wall_x].stored++;
                this.hasFood = false;
            }

            if(world.map.map[wall_y][wall_x].type == 'wall'
               && world.map.map[wall_y][wall_x].strength === 0) {
                world.map.map[wall_y][wall_x] = new Empty();
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
    this.width = width;
    this.height = height;


    this.setPherAt = function (team, position, value ) {
        var cell = this.map[position.y][position.x];

        if (!cell.type == 'empty') {
            return false;
        }

        if(team === 'br') {
            cell.br_pher = value;
        } else if(team === 'tl') {
            cell.tl_pher = value;
        } else {
            console.log("Weird input to Map.setPher()!\n");
            return false;
        }
        return true;
    };

    this.pherAt = function (team, position) {
        var cell = this.map[position.y][position.x];

        if (!cell.type == 'empty') {
            return null;
        }

        if(team === 'br') {
            return cell.br_pher;
        } else if(team === 'tl') {
            return cell.tl_pher;
        } else {
            console.log("Weird input to Map.pherAt()!\n");
            return null;
        }
    };
}

function newMap(width, height, sugars) {
    var i, j, k, x, y;

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
            map[y][x] = new Wall(3);
        }
    }

    for(k = 0; k < sugars/2; k++) {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);

        for(i = -1; i < 2; i++){
            for(j = -1; j < 2; j++){
                if(x+j >= 0 && x+j < width && y+i >= 0 && y+i < height){
                    map[y+i][x+j] = new Empty();
                }
                if(height-y-1+i >= 0 && height-y-1+i < height
                  && width-x-1+j >= 0 && width-x-1+j < width){
                    map[height-y-1+i][width-x-1+j] = new Empty();
                }
            }
        }

        for(i = -2; i < 3; i++){
            for(j = -2; j < 3; j++){
                if(x+j >= 0 && x+j < width && y+i >= 0 && y+i < height){
                    if(Math.random() < 0.7) {
                        map[y+i][x+j] = new Empty();
                    }
                }
                if(height-y-1+i >= 0 && height-y-1+i < height
                  && width-x-1+j >= 0 && width-x-1+j < width){
                    if(Math.random() < 0.7) {
                        map[height-y-1+i][width-x-1+j] = new Empty();
                    }
                }
            }
        }

        map[y][x] = new Sugar(10);
        map[height-y-1][width-x-1] = new Sugar(10);
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
