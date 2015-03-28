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
        1, 1, 1, 0, 1, 0, 1, 1, 2, 0,
        1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 1, 2, 2, 2,
        1, 1, 1, 0, 1, 0, 1, 1, 2, 0,
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
        WritePixel: function(i, color) {
            this.imageData.data[i] = Math.floor(color[0] * 255);
            this.imageData.data[i + 1] = Math.floor(color[1] * 255);
            this.imageData.data[i + 2] = Math.floor(color[2] * 255);
            this.imageData.data[i + 3] = 255;
        },
        drawTile: function(Tile, x, y) {
            switch (Tile.type) {
                case 'empty':
                    if (Tile.tl_pher) {
                        color = husl.p.toRGB(188 + 90, 100, 66);
                        for (var p = 0; p < 5; p++) {
                            sx = Math.floor(x * p * 947 * Tile.tl_pher_seed) % 10;
                            sy = Math.floor(y * p * 953 * Tile.tl_pher_seed) % 10;
                            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
                            this.WritePixel(i, color);
                        }
                    }
                    if (Tile.br_pher) {
                        color = husl.p.toRGB(355 + 90, 100, 66);
                        for (var p = 0; p < 5; p++) {
                            sx = Math.floor(x * p * 967 * Tile.br_pher_seed) % 10;
                            sy = Math.floor(y * p * 971 * Tile.br_pher_seed) % 10;
                            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
                            this.WritePixel(i, color);
                        }
                    }
                    break;
                case 'wall':
                    color = husl.p.toRGB(40, 100, 16 * (Tile.strength + 1));
                    for (var sx = 0; sx < 10; sx++) {
                        for (var sy = 0; sy < 10; sy++) {
                            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
                            this.WritePixel(i, color);
                        }
                    }
                    break;
                case 'sugar':
                    color = husl.p.toRGB((x * y * 9999) % 360, 100, 50);
                    for (var sx = 0; sx < 10; sx++) {
                        for (var sy = 0; sy < 10; sy++) {
                            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
                            if ((Tile.amount - (Math.abs(sx - 4.5) * Math.abs(sy - 4.5))) > 0) {
                                this.WritePixel(i, color);
                            }
                        }
                    }
                    break;
                case 'home':
                    if (x > 50) {
                        color = husl.p.toRGB(188, 100, 66);
                    } else {
                        color = husl.p.toRGB(355, 100, 66);
                    }
                    for (var sx = 0; sx < 10; sx++) {
                        for (var sy = 0; sy < 10; sy++) {
                            var i = ((((y * 10) + (sy)) * width) + ((x * 10) + (sx))) * 4;
                            if ((2.5 - Math.sqrt(Math.abs(sx - 4.5) * Math.abs(sy - 4.5))) < 0) {
                                this.WritePixel(i, color);
                            }
                        }
                    }
                    break;
                default:
                    throw new Error("WHATTTT");
            }
            // var sprite = Tile.sprite;
            // var sps = Math.sqrt(sprite.length) - 1;
        },
        drawAnt: function(Ant) {
            var x = Ant.position.x;
            var y = Ant.position.y;
            var color;
            if (Ant.team == 'br') {
                color = husl.p.toRGB(188, 100, 66);
            } else {
                color = husl.p.toRGB(355, 100, 66);
            }
            var facing = Ant.direction;
            var sprite = AntSprite;
            // var sps = Math.sqrt(sprite.length) - 1;
            var xpos = function(x, y) {
                if (facing == 'left') return (9 - x);
                else if (facing == 'right') return (x);
                else if (facing == 'down') return (y);
                else return (9 - y);
            };
            var ypos = function(x, y) {
                if (facing == 'left') return (y);
                else if (facing == 'right') return (9 - y);
                else if (facing == 'down') return (x);
                else return (9 - x);
            };
            for (var sx = 0; sx < 10; sx++) {
                for (var sy = 0; sy < 10; sy++) {
                    var i = ((((y * 10) + sy) * width) + ((x * 10) + sx)) * 4;
                    if (Ant.hasFood && sprite[xpos(sx, sy) + (10 * ypos(sx, sy))] == 2) {
                        this.WritePixel(i, husl.p.toRGB(66, 50, 100));
                    } else if (sprite[xpos(sx, sy) + (10 * ypos(sx, sy))] > 0) {
                        this.WritePixel(i, color);
                    }
                }
            }
        },
        render: function(world) {
            // Fill it all with BLACK (paint it black)
            this.context.fillRect(0, 0, width, height);
            // console.log(
            this.context.fillStyle = husl.p.toHex(40, 60, 24).toString(16); //'#ffffff'//husl.p.toHex(40, 60, 2); ////+offset.toString(16);
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