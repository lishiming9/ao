// Generated by CoffeeScript 1.12.7
(function() {
  var fullFillWrite, arrow, arrowShow, bycolumns, columns, cosHeightOffset, cosOffset, cycleShows, distort, flashShow, fullFill, height, npm_opc, rainbowShow, sinOffset, sinShow, splitSinWave, strand, stream, strip, width;

  npm_opc = require("./opc_init.js");

  width = npm_opc.width;

  height = npm_opc.height;

  strand = npm_opc.strand;

  columns = npm_opc.columns;

  stream = npm_opc.stream;

  distort = function(color) {
    var c, d, index, k, len, mod;
    mod = [0, 0, 0];
    for (index = k = 0, len = color.length; k < len; index = ++k) {
      c = color[index];
      d = Math.random() - .5;
      mod[index] = parseInt(c) + parseInt(100 * d);
      if (mod[index] > 255) {
        mod[index] = 255;
      }
      if (mod[index] < 0) {
        mod[index] = 0;
      }
    }
    return mod;
  };

  bycolumns = function(colors, fill) {
    var ci, d, di, i, j, l, results;
    l = colors.length;
    i = 0;
    results = [];
    while (i < height) {
      j = 0;
      while (j < width) {
        d = Math.random();
        if (d < fill) {
          ci = j % l;
          di = distort(colors[ci]);
          columns[j].setPixel(i, di[1], di[0], di[2]);
        } else {
          columns[j].setPixel(i, 0, 0, 0);
        }
        j++;
      }
      results.push(i++);
    }
    return results;
  };

  fullFill = function(color, fill) {
    var di, results, x, y;
    y = 0;
    results = [];
    while (y < height) {
      x = 0;
      while (x < width) {
        if (Math.random() < fill) {
          di = distort(color);
          columns[x].setPixel(y, di[1], di[0], di[2]);
        } else {
          columns[x].setPixel(y, 0, 0, 0);
        }
        x++;
      }
      results.push(y++);
    }
    return results;
  };

  fullFillWrite = function(color, fill) {
    var di, results, x, y;
    y = 0;
    results = [];
    while (y < height) {
      x = 0;
      while (x < width) {
        if (Math.random() < fill) {
          columns[x].setPixel(y, color[1], color[0], color[2]);
        } else {
          columns[x].setPixel(y, 0, 0, 0);
        }
        x++;
      }
      results.push(y++);
    }
    stream.writePixels(0, strand.buffer);
    stream.writePixels(0, strand.buffer);
    return results;
  };


  strip = function(color, position, size) {
    var di, ref, results, x, y;
    y = 0;
    results = [];
    while (y < height) {
      x = 0;
      while (x < width) {
        di = color;
        if ((0 < (ref = y - position) && ref < size)) {
          columns[x].setPixel(y, di[1], di[0], di[2]);
        } else {
          columns[x].setPixel(y, 0, 0, 0);
        }
        x++;
      }
      results.push(y++);
    }
    return results;
  };

  arrowShow = function(colors, speed) {
    var c, drawArrow, j, l;
    l = colors.length;
    j = 0;
    c = 0;
    drawArrow = function() {
      var ci, position;
      position = j % height;
      if (position === height - 1) {
        c++;
      }
      ci = c % l;
      arrow(colors[ci], position);
      stream.writePixels(0, strand.buffer);
      j++;
      if (j > 1000) {
        return j = 0;
      }
    };
    return setInterval(drawArrow, speed);
  };

  arrow = function(color, position) {
    var di, rel, results, x, y;
    y = 0;
    results = [];
    while (y < height) {
      x = 0;
      while (x < width) {
        di = color;
        rel = y - position;
        if (rel < 0) {
          columns[parseInt(width / 2)].setPixel(y, di[1], di[0], di[2]);
        }
        if (x > rel && width - x > rel && rel > 0) {
          columns[x].setPixel(y, di[1], di[0], di[2]);
        } else {
          columns[x].setPixel(y, 0, 0, 0);
        }
        x++;
      }
      results.push(y++);
    }
    return results;
  };

  cosOffset = 0;

  sinOffset = 0;

  cosHeightOffset = 1;

  splitSinWave = function(color1, color2, position) {
    var cosx, di1, di2, ref, ref1, results, sinx, x, y;
    cosOffset++;
    sinOffset++;
    sinOffset++;
    if (cosOffset > 10000) {
      cosOffset = 0;
    }
    if (cosOffset < -10000) {
      sinOffset = 0;
    }
    if (Math.random() < .6) {
      cosHeightOffset -= 0.05;
    }
    if (Math.random() > .4) {
      cosHeightOffset += 0.05;
    }
    if (cosHeightOffset <= -1) {
      cosHeightOffset = 1;
    }
    y = 0;
    results = [];
    while (y < height) {
      x = 0;
      while (x < width) {
        di1 = distort(color1);
        di2 = distort(color2);
        cosx = 6.5 * Math.cos((y + position + cosOffset) / 5) + 6.5 * cosHeightOffset;
        sinx = 6.5 * Math.sin((y + position + sinOffset) / 5) + 6.5;
        if ((-.5 < (ref = cosx - x) && ref < .5)) {
          columns[x].setPixel(y, di1[0], di1[1], di1[2]);
        } else if ((-.5 < (ref1 = sinx - x) && ref1 < .5)) {
          columns[x].setPixel(y, di2[0], di2[1], di2[2]);
        } else {
          columns[x].setPixel(y, 0, 0, 0);
        }
        x++;
      }
      results.push(y++);
    }
    return results;
  };

  sinShow = function(colors) {
    var j, l, position;
    l = colors.length;
    j = 0;
    position = 0;
    return setInterval(function() {
      var ci;
      ci = j % (l - 1);
      splitSinWave(colors[ci], colors[ci + 1], position);
      stream.writePixels(0, strand.buffer);
      position++;
      if (position > 1000) {
        position = 0;
      }
      if (position % 50 === 0) {
        j++;
        if (j > 1000) {
          return j = 0;
        }
      }
    }, 200);
  };

  rainbowShow = function(colors, fill, speed) {
    return setInterval(function() {
      bycolumns(colors, fill);
      return stream.writePixels(0, strand.buffer);
    }, speed);
  };

  flashShow = function(colors, fill, speed) {
    var j, l;
    l = colors.length;
    j = 0;
    return setInterval(function() {
      var ci;
      ci = j % l;
      fullFill(colors[ci], fill);
      stream.writePixels(0, strand.buffer);
      j++;
      if (j > 1000) {
        return j = 0;
      }
    }, speed);
  };

  cycleShows = function() {};

  module.exports = {
    rainbowShow: rainbowShow,
    flashShow: flashShow,
    arrowShow: arrowShow,
    sinShow: sinShow,
    cycleShows: cycleShows,
    fullFillWrite: fullFillWrite,
  };

}).call(this);
