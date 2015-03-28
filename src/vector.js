function Vec2(x, y) {
  this.x = x;
  this.y = y;
}

Vec2.prototype.norm = function() {
  return Math.sqrt(this.x * this.x, this.y * this.y);
};

Vec2.prototype.add = function(v) {
  return new Vec2(this.x + v.x, this.y + v.y);
};

Vec2.prototype.sub = function(v) {
  return new Vec2(this.x - v.x, this.y - v.y);
};

Vec2.prototype.scale = function(amount) {
  return new Vec2(amount * this.x, amount * this.y);
};

Vec2.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y;
};

Vec2.prototype.clone = function() {
  return new Vec2(this.x, this.y);
};

module.exports = {
  Vec2: Vec2
};
