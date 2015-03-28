var husl = require('husl');
var struct = require('./structure');

module.exports = (function() {
  // Constant properties
  var width;
  var height;
  var frame = 1;
  var AntSprite = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                   0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                   0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                   1, 1, 1, 0, 1, 0, 1, 1, 1, 0,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                   1, 1, 1, 0, 1, 0, 1, 1, 1, 0,
                   0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                   0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
                   0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                  ];

  function Display(canvas) {
    this.canvas = canvas;
    width = canvas.getAttribute('width');
    height = canvas.getAttribute('height');
    this.scale = 10;
    this.context = canvas.getContext('2d');
    this.then = +Date.now();
    this.paused = false;
  }

  Display.prototype = {
    drawTile: function(Tile, x, y) {
      var color;
      switch (Tile.type) {
      case 'empty':
        return; // TODO(max): Make this prettyyyyy
      case 'wall':
        color = husl.p.toRGB(40, 100, 66);
        break;
      case 'sugar':
        color = husl.p.toRGB(/* Math.random() * */ 360, 100, 50);
        break;
      case 'home':
        color = husl.p.toRGB(/* Math.random() * */ 100, 100, 50);
        break;
      default:
        throw new Error("WHATTTT");
      }
      var R = Math.floor(color[0] * 255);
      var G = Math.floor(color[1] * 255);
      var B = Math.floor(color[2] * 255);
      // var sprite = Tile.sprite;
      // var sps = Math.sqrt(sprite.length) - 1;
      if (Tile.type == 'wall') {
        for (var sx = 0; sx < 10; sx++) {
          for (var sy = 0; sy < 10; sy++) {
            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
            this.imageData.data[i] = R % 255;
            this.imageData.data[i + 1] = G % 255;
            this.imageData.data[i + 2] = B % 255;
            this.imageData.data[i + 3] = 255;
          }
        }
      } else if (Tile.type == 'sugar') {
        for (var sx = 0; sx < 10; sx++) {
          for (var sy = 0; sy < 10; sy++) {
            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
            if ((Tile.amount - (Math.abs(sx - 4.5) * Math.abs(sy - 4.5))) > 0) {
              this.imageData.data[i] = R % 255;
              this.imageData.data[i + 1] = G % 255;
              this.imageData.data[i + 2] = B % 255;
              this.imageData.data[i + 3] = 255;
            }
          }
        }
      }
    },
    drawAnt: function(Ant) {
      console.log("Drawing an ant?");
      var x = Ant.position.x;
      var y = Ant.position.y;
      console.log(x, y);

      var color;
      if (Ant.team == 'br') {
        color = husl.p.toRGB(188, 50, 66);
      } else {
        color = husl.p.toRGB(123, 50, 66);
      }

      var facing = Ant.direction;
      var R = Math.floor(color[0] * 255);
      var G = Math.floor(color[1] * 255);
      var B = Math.floor(color[2] * 255);
      var sprite = AntSprite;
      // var sps = Math.sqrt(sprite.length) - 1;
      var xpos = function(x) {
        if (facing == 0 || facing == 2) return (x);
        else return (9 - x);
      };
      var ypos = function(y) {
        if (facing == 1 || facing == 3) return (y);
        else return (9 - y);
      };
      for (var sx = 0; sx < 10; sx++) {
        for (var sy = 0; sy < 10; sy++) {
          var i = ((((y * 10) + sy) * width) + ((x * 10) + sx)) * 4;
          if (sprite[xpos(sx) + (10 * ypos(sy))]) {
            this.imageData.data[i] = R % 255;
            this.imageData.data[i + 1] = G % 255;
            this.imageData.data[i + 2] = B % 255;
            this.imageData.data[i + 3] = 255;
          }
        }
      }
    },
    render: function(world) {
      // Fill it all with BLACK (paint it black)
      this.context.fillRect(0, 0, width, height);
      this.context.fillStyle = husl.p.toHex(40, 60, 2); ////t'#0010'+offset.toString(16);
      this.context.fill();
      this.imageData = this.context.getImageData(0, 0, width, height);

      // Loop over every tile
      var self = this;
      world.map.map.forEach(function(row, y) {
        row.forEach(function(tile, x) {
          self.drawTile(tile, x, y);
        });
      });

      // Draw all of the ants
      world.tl.ants.forEach(this.drawAnt.bind(this));
      world.br.ants.forEach(this.drawAnt.bind(this));

      this.context.putImageData(this.imageData, 0, 0);
    }
  };

  return Display;
})();
