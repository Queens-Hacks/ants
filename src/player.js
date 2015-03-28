var struct = require('./structure');
var vector = require('./vector');
var Vec2 = vector.Vec2;

function Player(team, homeLocation, world) {
  this.team = team;
  this.ants = [];
  this.homeLocation = homeLocation;
  this.world = world;

  this.setSource = function(source) {
    var aether = this.aether = new Aether({
      yieldAutomatically: true
      // yieldConditionally: true
    });

    aether.lint(source);
    // TODO(michael): Check for any problems

    aether.transpile(source);
    this.func = aether.createFunction();

    var actionComplete = false;
    // Add an ant to the player object
    this.addAnt = function(location) {
      // Create the ant
      var ant = new struct.Ant(this.team, location, world);
      this.ants.push(ant);

      var shim = Object.create(null);
      // MOVEMENT
      shim.moveLeft = function() {
        actionComplete = true;
        return ant.move(new Vec2(-1, 0));
      };
      shim.moveRight = function() {
        actionComplete = true;
        return ant.move(new Vec2(1, 0));
      };
      shim.moveUp = function() {
        actionComplete = true;
        return ant.move(new Vec2(0, -1));
      };
      shim.moveDown = function() {
        actionComplete = true;
        return ant.move(new Vec2(0, 1));
      };

      shim.digLeft = function() {
        actionComplete = true;
        return ant.dig(new Vec2(-1, 0));
      };
      shim.digRight = function() {
        actionComplete = true;
        return ant.dig(new Vec2(1, 0));
      };
      shim.digUp = function() {
        actionComplete = true;
        return ant.dig(new Vec2(0, -1));
      };
      shim.digDown = function() {
        actionComplete = true;
        return ant.dig(new Vec2(0, 1));
      };

      shim.moveDigLeft = function() {
        if (! shim.moveLeft()) {
          return shim.digLeft();
        }
        return true;
      };
      shim.moveDigRight = function() {
        if (! shim.moveRight()) {
          return shim.digRight();
        }
        return true;
      };
      shim.moveDigUp = function() {
        if (! shim.moveUp()) {
          return shim.digUp();
        }
        return true;
      };
      shim.moveDigDown = function() {
        if (! shim.moveDown()) {
          return shim.digDown();
        }
        return true;
      };

      shim.getTeam = function() {
        return team;
      };

      shim.log = function(message) {
        // TODO(michael): This only works on the client. Make it a no-op on the server
        var msg = "\n" + message;

        if (team == 'tl') {
          global.outputleft.navigateFileEnd();
          global.outputleft.insert(msg);
        } else {
          global.outputright.navigateFileEnd();
          global.outputright.insert(msg);
        }
      };

      // Checking or laying pheramones
      // NOTE(michael): Temporarially not working
      shim.sniff = function() {
        return world.map.pherAt(team,
                                new Vec2(ant.position.x, ant.position.y));
      };
      shim.spray = function(pheramone) {
        world.map.setPherAt(team,
                            new Vec2(ant.position.x, ant.position.y),
                            // Ensure that the object is valid JSON
                            JSON.parse(JSON.stringify(pheramone)));
      };

      shim.hasFood = function() {
        return ant.hasFood;
      };

      shim.homeLocation = function() {
        return homeLocation.clone();
      };

      shim.location = function() {
        return ant.position.clone();
      };

      shim.look = function(direction) {
        if (direction === 'up' && ant.position.y-1 > 0) {
          return world.map.map[ant.position.y-1][ant.position.x].type;
        } else if (direction === 'down' && ant.position.y+1 < world.map.map.length) {
          return world.map.map[ant.position.y+1][ant.position.x].type;
        } else if (direction === 'left' && ant.position.x-1 > 0) {
          return world.map.map[ant.position.y][ant.position.x-1].type;
        } else if (direction === 'right' && ant.position.x+1 < world.map.map[0].length) {
          return world.map.map[ant.position.y][ant.position.x+1].type;
        } else {
          return false;
        }
      };

      shim.foodLeft = function(direction) {
        if (direction === 'up' && ant.position.y-1 > 0) {
          if (world.map.map[ant.position.y-1][ant.position.x].type === 'sugar') {
            return world.map.map[ant.position.y-1][ant.position.x].amount;
          } else {
            return false;
          }
        } else if (direction === 'down' && ant.position.y+1 < world.map.map.length) {
          if (world.map.map[ant.position.y+1][ant.position.x].type === 'sugar') {
            return world.map.map[ant.position.y+1][ant.position.x].amount;
          } else {
            return false;
          }
        } else if (direction === 'left' && ant.position.x-1 > 0) {
          if (world.map.map[ant.position.y][ant.position.x-1].type === 'sugar') {
            return world.map.map[ant.position.y][ant.position.x-1].amount;
          } else {
            return false;
          }
        } else if (direction === 'right' && ant.position.x+1 < world.map.map[0].length) {
          if (world.map.map[ant.position.y][ant.position.x+1].type === 'sugar') {
            return world.map.map[ant.position.y][ant.position.x+1].amount;
          } else {
            return false;
          }
        } else if (direction == 'here') {
          if (world.map.map[ant.position.y][ant.position.x].type === 'sugar') {
            return world.map.map[ant.position.y][ant.position.x].amount;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      // Start the script
      var func = aether.createFunction();
      ant.state = func.call(shim);
    };

    // Iterate over each of the ants, performing an action
    // var counter = 0; // TODO(michael): Rename
    var spawnCounter = 0;
    this.step = function() {
      this.ants.forEach(function(ant, index) {
        actionComplete = false;
        for (var i=0; i<500; i++) {
          var next = ant.state.next();
          if (next.done) { // Nuke the state object
            ant.state = {
              next: function() { }
            };
            break;
          }
          if (actionComplete) {
            break;
          }
        }
      });

      spawnCounter++;
      if (spawnCounter > 60) {
        this.addAnt(homeLocation.clone());
        spawnCounter = 0;
      }

      // Ant adding
      /* counter++;
       if (counter > 5) {
       console.log("Added an ant!");
       this.addAnt(homeLocation);
       counter = 0;
       } */
    };

    this.addAnt(homeLocation.clone());
  }
}

module.exports = {
  Player: Player
};
