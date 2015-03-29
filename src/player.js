var struct = require('./structure');
var vector = require('./vector');
var sketch = require('./sketch');
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
    // try {
      var compiled = sketch.compile(source, [
        'dig',
        'move',
        'getTeam',
        'log',
        'sniff',
        'spray',
        'hasFood',
        'home',
        'location',
        'wait',
        'look',
        'foodLeft'
      ]);
    // } catch (err) {
    //   debugLog(team, "FATAL ERROR: " + err);
    //   global.paused = true;
    // }

    // Add an ant to the player object
    this.addAnt = function(location) {
      // Create the ant
      var ant = new struct.Ant(this.team, location, world);
      this.ants.push(ant);

      ant.genState = new sketch.GenState(compiled, function(yv, yld, raw) {
        var args = yv.args;
        switch (yv.type) {
        case 'dig':
          return yld(ant.dig(args[0]));
        case 'move':
          if (! ant.move(args[0])) {
            return yld(ant.dig(args[0]));
          }
          return yld(true);
        case 'getTeam':
          return raw(team);
        case 'log':
          debugLog(team, args.join(' '));
          return raw();
        case 'sniff':
          return raw(world.map.pherAt(team,
                                      new Vec2(ant.position.x, ant.position.y)));
        case 'spray':
          world.map.setPherAt(team,
                              new Vec2(ant.position.x, ant.position.y),
                              // Ensure that the object is valid JSON
                              JSON.parse(JSON.stringify(args[0])));
          return raw();
        case 'hasFood':
          return raw(ant.hasFood);
        case 'home':
          console.log('Home called', homeLocation.clone());
          return raw(homeLocation.clone());
        case 'location':
          return raw(ant.position.clone());
        case 'wait':
          return yld();
        case 'look':
          if (args[0] === 'up' && ant.position.y-1 > 0) {
            return raw(world.map.map[ant.position.y-1][ant.position.x].type);
          } else if (args[0] === 'down' && ant.position.y+1 < world.map.map.length) {
            return raw(world.map.map[ant.position.y+1][ant.position.x].type);
          } else if (args[0] === 'left' && ant.position.x-1 > 0) {
            return raw(world.map.map[ant.position.y][ant.position.x-1].type);
          } else if (args[0] === 'right' && ant.position.x+1 < world.map.map[0].length) {
            return raw(world.map.map[ant.position.y][ant.position.x+1].type);
          } else if (args[0] === 'here') {
            return raw(world.map.map[ant.position.y][ant.position.x].type);
          } else {
            return raw(false);
          }
        case 'foodLeft':
          if (args[0] === 'up' && ant.position.y-1 > 0) {
            if (world.map.map[ant.position.y-1][ant.position.x].type === 'sugar') {
              return raw(world.map.map[ant.position.y-1][ant.position.x].amount);
            } else {
              return raw(false);
            }
          } else if (args[0] === 'down' && ant.position.y+1 < world.map.map.length) {
            if (world.map.map[ant.position.y+1][ant.position.x].type === 'sugar') {
              return raw(world.map.map[ant.position.y+1][ant.position.x].amount);
            } else {
              return raw(false);
            }
          } else if (args[0] === 'left' && ant.position.x-1 > 0) {
            if (world.map.map[ant.position.y][ant.position.x-1].type === 'sugar') {
              return raw(world.map.map[ant.position.y][ant.position.x-1].amount);
            } else {
              return raw(false);
            }
          } else if (args[0] === 'right' && ant.position.x+1 < world.map.map[0].length) {
            if (world.map.map[ant.position.y][ant.position.x+1].type === 'sugar') {
              return raw(world.map.map[ant.position.y][ant.position.x+1].amount);
            } else {
              return raw(false);
            }
          } else if (args[0] == 'here') {
            if (world.map.map[ant.position.y][ant.position.x].type === 'sugar') {
              return raw(world.map.map[ant.position.y][ant.position.x].amount);
            } else {
              return raw(false);
            }
          } else {
            return raw(false);
          }
        default:
          throw new Error("Unrecognized yield function type: " + yv.type);
        }
      });
    };

    // Iterate over each of the ants, performing an action
    // var counter = 0; // TODO(michael): Rename
    var spawnCounter = 0;
    this.step = function() {
      this.ants.forEach(function(ant, index) {
        try {
          // Run a single step
          if (ant.dead) { return; }
          var rslt = ant.genState.step();
          if (rslt.done) { ant.dead = true; }
        } catch (err) {
          debugLog(team, "FATAL RT ERROR: " + err);
          ant.dead = true;
        }
      });

      spawnCounter++;
      var maxAnts = 5 + (world.map.getSugar(this.team)/2);
      if (spawnCounter > 60 && this.ants.length < maxAnts) {
        this.addAnt(homeLocation.clone());
        spawnCounter = 0;
      }
    };

    this.addAnt(homeLocation.clone());
  };
}

module.exports = {
  Player: Player
};
