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
            map[height-i][width-j] = new Empty();
        }
    }

    map[2][2] = new Home(1);
    map[height-1][width-1] = new Home(2);

    return map;
}

var Ant = function(team, x, y) {
    this.team = team;
    this.x = x;
    this.y = y;
    this.hasFood = false;
    this.isTrampled = false;
}


console.log('hi from structure');
