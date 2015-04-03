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
        2, 2, 1, 0, 1, 0, 1, 1, 1, 0,
        2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
        2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
        2, 2, 1, 0, 1, 0, 1, 1, 1, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    ];
    var HillSprite = [0, 0, 0, 0, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 1, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 1, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 1, 1, 0, 0,
    ];

    function Display(canvas1, canvas2) {
        this.canvas = canvas1;
        this.canvas2 = canvas2;
        width = canvas1.getAttribute('width');
        height = canvas1.getAttribute('height');
        this.scale = 10;
        this.paradeStep = 0;
        this.context = this.canvas.getContext('2d');
        this.context2 = this.canvas2.getContext('2d');
        this.then = +Date.now();
        this.TileSprites = this.PrepareTiles();
        this.drawBorder = true;
        // this.ParadeAnts = initParade();
    }
    Display.prototype = {
        WritePixel: function(i, color) {
            this.imageData.data[i] = Math.floor(color[0] * 255);
            this.imageData.data[i + 1] = Math.floor(color[1] * 255);
            this.imageData.data[i + 2] = Math.floor(color[2] * 255);
            this.imageData.data[i + 3] = 255;
        },
        PrepareTiles: function() {
            List = [];
            for (var s = 0; s < 5; s++) {
                var TileImage = this.context.createImageData(10, 10);
                var d = TileImage.data;
                color = husl.p.toRGB(40, 100, 11 * (s + 2));
                for (var sx = 0; sx < 10; sx++) {
                    for (var sy = 0; sy < 10; sy++) {
                        var i = (sy + (sx * 10)) * 4;
                        d[i] = Math.floor(color[0] * 255);
                        d[i + 1] = Math.floor(color[1] * 255);
                        d[i + 2] = Math.floor(color[2] * 255);
                        d[i + 3] = 255;
                    }
                }
                List.push(TileImage);
            }
            return List;
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
                    if (!this.drawBorder && (x == 0 || x == 79 || y == 0 || y == 49)) return;
                    this.context2.putImageData(this.TileSprites[Tile.strength - 1], x * 10, y * 10);
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
                            if (HillSprite[sx + (10 * sy)] > 0) this.WritePixel(i, color);
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
                color = husl.p.toRGB(188, 50, 66);
            } else {
                color = husl.p.toRGB(355, 75, 66);
            }
            var facing = Ant.direction;
            var sprite = AntSprite;
            // var sps = Math.sqrt(sprite.length) - 1;
            var xpos = function(x, y) {
                if (facing == 'right') return (9 - x);
                else if (facing == 'left') return (x);
                else if (facing == 'down') return (9 - y);
                else return (y);
            };
            var ypos = function(x, y) {
                if (facing == 'right') return (y);
                else if (facing == 'left') return (y);
                else if (facing == 'down') return (9 - x);
                else return (x);
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
        parade: function(winner) {
            var pAnt = {
                team: winner,
                position: {
                    x: 0,
                    y: 0
                },
            }
            for (var a = 0; a < (80 + 50 + 80 + 50); a += 1) {
                switch (true) {
                    case a < 80:
                        if (((a + this.paradeStep) % 5) != 0) continue;
                        pAnt.direction = 'right';
                        pAnt.position.y = 0;
                        pAnt.position.x = a;
                        this.drawAnt(pAnt)
                        break;
                    case a < (50 + 80):
                        if (((a + this.paradeStep) % 5) != 0) continue;
                        pAnt.direction = 'down';
                        pAnt.position.x = 79;
                        pAnt.position.y = a - 80;
                        this.drawAnt(pAnt);
                        break;
                    case a < (80 + 50 + 80):
                        if (((a - this.paradeStep) % 5) != 0) continue;
                        pAnt.direction = 'left';
                        pAnt.position.y = 49;
                        pAnt.position.x = a - (80 + 50);
                        this.drawAnt(pAnt)
                        break;
                    default:
                        if (((a - this.paradeStep) % 5) != 0) continue;
                        pAnt.position.x = 0;
                        pAnt.position.y = a - (80 + 50 + 80);
                        pAnt.direction = 'up';
                        this.drawAnt(pAnt);
                }
            }
        },
        render: function(world, winner) {
            // Fill it all with BLACK (paint it black)
            // console.log(
            this.context2.clearRect(0, 0, width, height);
            this.context.fillStyle = husl.p.toHex(40, 60, 24).toString(16); //'#ffffff'//husl.p.toHex(40, 60, 2); ////+offset.toString(16);
            this.context.fill();
            this.context.fillRect(0, 0, width, height);
            this.imageData = this.context.getImageData(0, 0, width, height);
            this.imageData2 = this.context2.getImageData(0, 0, width, height);
            // Loop over every tile
            if (winner === 'br' || winner === 'tl') {
                this.drawBorder = false;
            } else this.drawBorder = true;
            var self = this;
            world.map.map.forEach(function(row, y) {
                row.forEach(function(tile, x) {
                    self.drawTile(tile, x, y);
                });
            });
            if (winner === 'br' || winner === 'tl') {
                this.context2.fillStyle = "white";
                this.context2.font = "bold 46px Arial";
                if (winner == 'br') {
                    txt = "BLUE";
                } else {
                    txt = "PINK";
                }
                this.context2.fillText("WINNER " + txt, 230, 250);
                this.parade(winner);
                this.paradeStep++;
            }
            // Draw all of the ants
            world.tl.ants.forEach(this.drawAnt.bind(this));
            world.br.ants.forEach(this.drawAnt.bind(this));
            this.context.putImageData(this.imageData, 0, 0);
        }
    };
    return Display;
})();