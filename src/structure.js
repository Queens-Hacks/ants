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

    /* direction is a unit vector */
    this.move = function(direct) {
        var new_x, new_y, new_obj;
        
        if(direct === 'up') {
            new_x = this.position.x;
            new_y = this.position.y - 1;
        } else if(direct === 'down') { 
            new_x = this.position.x;
            new_y = this.position.y + 1;
        } else if(direct === 'left') {
            new_x = this.position.x - 1;
            new_y = this.position.y;
        } else if(direct === 'right') {
            new_x = this.position.x + 1;
            new_y = this.position.y;
        } else {
            console.log("ERROR: Ant.move() dosn't understand direct: " + direct);
            return false;
        }

        /* Bounds Checking */
        if(new_x >= world.map.width || new_x < 0
           || new_y >= world.map.height || new_y < 0) {
            return false;
        }

        this.direction = direct;
        new_obj = this.world.map.map[new_y][new_x];

        if(new_obj.type === 'empty' || new_obj.type === 'sugar') {
            this.position.x = new_x;
            this.position.y = new_y;

            if(new_obj.type == 'sugar' && this.hasFood === false){
                new_obj.amount--;
                this.hasFood = true;
                
                if(new_obj.amount === 0) {
                    world.map.map[new_y][new_x] = new Empty();
                }
            }
        } else {
            return false;
        }

        return true;
    };

    this.dig = function(direction) {
        var wall_x, wall_y, new_obj;
        if(direction === 'up') {
            wall_x = this.position.x;
            wall_y = this.position.y - 1;
        } else if(direction === 'down') { 
            wall_x = this.position.x;
            wall_y = this.position.y + 1;
        } else if(direction === 'left') {
            wall_x = this.position.x - 1;
            wall_y = this.position.y;
        } else if(direction === 'right') {
            wall_x = this.position.x + 1;
            wall_y = this.position.y;
        } else {
            console.log("ERROR: Ant.dig() dosn't understand direction: " + direction);
            return false;
        }

        /* Bounds Checking */
        if(wall_x >= world.map.width || wall_x < 0
           || wall_y >= world.map.height || wall_y < 0) {
            return false;
        }

        new_obj = world.map.map[wall_y][wall_x];

        if(new_obj.type === 'wall') {
            new_obj.strength--;
        } else if(new_obj.type === 'home' && this.hasFood === true) {
            new_obj.stored++;
            this.hasFood = false;
        }
        
        if(new_obj.type === 'wall' && new_obj.strength === 0) {
            world.map.map[wall_y][wall_x] = new Empty();
            return true;
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

    this.getTLSugar = function(team) {
        if(team === 'tl') {
            return map[2][2].stored;
        } else {
            return map[width-2][height-2].stored;
        }
    }

    this.setPherAt = function (team, position, value ) {
        var cell = this.map[position.y][position.x];

        if (!cell.type == 'empty') {
            return false;
        }

        if(team === 'br') {
            cell.br_pher = value;
            cell.br_pher_seed = Math.random();
        } else if(team === 'tl') {
            cell.tl_pher = value;
            cell.tl_pher_seed = Math.random();
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
            map[y][x] = new Wall(5);
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

        map[y][x] = new Sugar(20);
        map[height-y-1][width-x-1] = new Sugar(20);
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
