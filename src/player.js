function Player(team, source, homeLocation) {
  this.team = team;
  this.ants = [];
  this.homeLocation = homeLocation;
  var aether = this.aether = new Aether({
    yieldConditionally: true
  });

  aether.lint(source);
  // TODO(michael): Check for any problems

  aether.transpile(source);
  this.func = aether.createFunction();

  // TODO(michael): Debug
  console.log(aether.pure);
}

Player.prototype.addAnt = function(location) {
  // Create the ant
  var ant = new struct.Ant(this.team, location.x, location.y);
  this.ants.push(ant);

  var shim = Object.create(null);
  // MOVEMENT
  shim.moveLeft = function() {
  };
  shim.moveRight = function() {
  };
  shim.moveUp = function() {
  };
  shim.moveDown = function() {
  };

  shim.digLeft = function() {
  };
  shim.digRight = function() {
  };
  shim.digUp = function() {
  };
  shim.digDown = function() {
  };

  shim.moveDigLeft = function() {
  };
  shim.moveDigRight = function() {
  };
  shim.moveDigUp = function() {
  };
  shim.moveDigDown = function() {
  };

  // Checking or laying pheramones
  shim.sniff = function() {
  };
  shim.spray = function(pheramone) {
  };

  // Start the script
  this.func.call(

  );
};

Player.prototype.step = function() {
  var self = this;
  this.ants.forEach(function(ant, index) {
  });
};

module.exports = {
  Player: Player
};
