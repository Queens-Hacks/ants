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

  // Add an ant to the player object
  this.addAnt = function(location) {
    console.log("Adding an ant");
    // Create the ant
    var ant = new struct.Ant(this.team, location, world);
    this.ants.push(ant);

    var aether = this.aether;
    var world = this.world;
    var team = this.team;

    var shim = Object.create(null);
    // MOVEMENT
    shim.moveLeft = function() {
      ant.move(Vec2(ant.x - 1, ant.y));
      aether._shouldYield = true;
    };
    shim.moveRight = function() {
      ant.move(Vec2(ant.x + 1, ant.y));
      aether._shouldYield = true;
    };
    shim.moveUp = function() {
      ant.move(Vec2(ant.x, ant.y - 1));
      aether._shouldYield = true;
    };
    shim.moveDown = function() {
      ant.move(Vec2(ant.x, ant.y + 1));
      aether._shouldYield = true;
    };

    shim.digLeft = function() {
      ant.dig(Vec2(ant.x - 1, ant.y));
      aether._shouldYield = true;
    };
    shim.digRight = function() {
      ant.dig(Vec2(ant.x + 1, ant.y));
      aether._shouldYield = true;
    };
    shim.digUp = function() {
      ant.dig(Vec2(ant.x, ant.y - 1));
      aether._shouldYield = true;
    };
    shim.digDown = function() {
      ant.dig(Vec2(ant.x, ant.y + 1));
      aether._shouldYield = true;
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

    // Start the script
    var func = aether.createFunction();
    ant.state = func.call(shim);
  };

  // Iterate over each of the ants, performing an action
  var counter = 0; // TODO(michael): Rename
  this.step = function() {
    this.ants.forEach(function(ant, index) {
      // console.log("An ant");
      // TODO(michael): Prevent infinite loops
      var next = ant.state.next();
      // console.log("Right after waffling");

      if (next.done) { // Yay!
        ant.state = {
          next: function() { return {}; }
        };
      }
    });

    // Ant adding
    counter++;
    if (counter > 5) {
      console.log("Added an ant!");
      this.addAnt(homeLocation);
      counter = 0;
    }
  };
}

module.exports = {
  Player: Player
};
