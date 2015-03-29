var struct = require('./structure');
var vector = require('./vector');
var Vec2 = vector.Vec2;

function debugLog(team, message) {
  // TODO(michael): This only works on the client. Make it a no-op on the server
  var msg = "\n" + message;

  if (team == 'tl') {
    global.outputleft.navigateFileEnd();
    global.outputleft.insert(msg);
  } else {
    global.outputright.navigateFileEnd();
    global.outputright.insert(msg);
  }
}

function Player(team, homeLocation, world) {
  this.team = team;
  this.ants = [];
  this.homeLocation = homeLocation;
  this.world = world;

  this.setSource = function(source) {
    var aether = this.aether = new Aether({
      yieldAutomatically: true,
      includeFlow: false,
      includeMetrics: false
    });

    aether.lint(source);
    aether.problems.infos.forEach(function(info) {
      debugLog(team, "INFO: " + info);
    });
    aether.problems.warnings.forEach(function(warning) {
      debugLog(team, "WARN: " + warning);
    });
    aether.problems.errors.forEach(function(error) {
      debugLog(team, "ERROR: " + error);
    });

    // TODO(michael): Check for any problems

    try {
      aether.transpile(source);
      this.func = aether.createFunction();
    } catch (err) {
      debugLog(team, "FATAL ERROR: " + err);
      global.paused = true;
    }

    var actionComplete = false;
    // Add an ant to the player object
    this.addAnt = function(location) {
      // Create the ant
      var ant = new struct.Ant(this.team, location, world);
      this.ants.push(ant);

      var shim = Object.create(null);

      shim.dig = function(direction) {
        actionComplete = true;
        return ant.dig(direction);
      };

      shim.move = function(direction) {
        actionComplete = true;
        if (! ant.move(direction)) {
          return shim.dig(direction);
        }
        return true;
      };

      shim.getTeam = function() {
        return team;
      };

      shim.log = function(message) {
        debugLog(team, message);
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

      shim.home = function() {
        return homeLocation.clone();
      };

      shim.location = function() {
        return ant.position.clone();
      };

      shim.goto = function(point) {
        if (this.home().x > this.location().x) {
            this.moveDig('right');
        }
        if (this.home().x < this.location().x) {
            this.moveDig('left');
        }
        if (this.home().y > this.location().y) {
            this.moveDig('down');
        }
        if (this.home().y < this.location().y) {
            this.moveDig('up');
        }
      }

      shim.look = function(direction) {
        if (direction === 'up' && ant.position.y-1 > 0) {
          return world.map.map[ant.position.y-1][ant.position.x].type;
        } else if (direction === 'down' && ant.position.y+1 < world.map.map.length) {
          return world.map.map[ant.position.y+1][ant.position.x].type;
        } else if (direction === 'left' && ant.position.x-1 > 0) {
          return world.map.map[ant.position.y][ant.position.x-1].type;
        } else if (direction === 'right' && ant.position.x+1 < world.map.map[0].length) {
          return world.map.map[ant.position.y][ant.position.x+1].type;
        } else if (direction === 'here') {
          return world.map.map[ant.position.y][ant.position.x].type;
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
        try {
          actionComplete = false;
          for (var i=0; i<500; i++) {
            var next = ant.state.next();
            if (next.done) { // Nuke the state object
              ant.state = {
                next: function() { return {}; }
              };
              break;
            }
            if (actionComplete) {
              break;
            }
          }
        } catch (err) {
          debugLog(team, "FATAL RT ERROR: " + err);
          ant.state = {
            next: function() { return {}; }
          };
        }
      });

      spawnCounter++;
      var maxAnts = 5 + (world.map.getSugar(this.team)/2)
      if (spawnCounter > 60 && this.ants.length < maxAnts) {
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
