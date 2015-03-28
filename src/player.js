var struct = require('./structure');
var vector = require('./vector');
var Vec2 = vector.Vec2;

function Player(team, source, homeLocation, world) {
  this.team = team;
  this.ants = [];
  this.homeLocation = homeLocation;
  this.world = world;

  var aether = this.aether = new Aether({
    yieldAutomatically: true
    // yieldConditionally: true
  });

  aether.lint(source);
  // TODO(michael): Check for any problems

  aether.transpile(source);
  this.func = aether.createFunction();

  // TODO(michael): Debug
  console.log(aether.pure);

  var actionComplete = false;
  // Add an ant to the player object
  this.addAnt = function(location) {
    console.log("Adding an ant");
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

    // Checking or laying pheramones
    // NOTE(michael): Temporarially not working
    shim.sniff = function() {
      return world.map.pherAt(team,
                              Vec2(ant.x, ant.y));
    };
    shim.spray = function(pheramone) {
      world.map.setPherAt(team,
                          Vec2(ant.x, ant.y),
                          // Ensure that the object is valid JSON
                          JSON.parse(JSON.stringify(pheramone)));
    };

    shim.waffle = function() {
      console.log("WAFFLE");
    };

    shim.hasFood = function() {
        return ant.hasFood;
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

module.exports = {
  Player: Player
};
