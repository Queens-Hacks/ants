var vector = require('./vector');
var Vec2 = vector.Vec2;

function Player(team, source, homeLocation, world) {
  this.team = team;
  this.ants = [];
  this.homeLocation = homeLocation;
  this.world = world;
  var aether = this.aether = new Aether({
    yieldConditionally: true
  });

  aether.lint(source);
  // TODO(michael): Check for any problems

  aether.transpile(source);
  this.func = aether.createFunction();

  // TODO(michael): Debug
  console.log(aether.pure);

  // Add an ant to the player object
  this.addAnt = function(location) {
    // Create the ant
    var ant = new struct.Ant(this.team, location.x, location.y);
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

    // Start the script
    ant.state = this.func.call(shim);
  };

  // Iterate over each of the ants, performing an action
  this.step = function() {
    var self = this;
    this.ants.forEach(function(ant, index) {
      // TODO(michael): Prevent infinite loops
      var next = ant.state.next();

      if (next.done) { // Yay!
        ant.state = {
          next: function() { return {}; }
        };
      }
    });
  };
}

module.exports = {
  Player: Player
};
