// Generated by CoffeeScript 1.12.7
(function() {
  var Socket, columns, createOPCStream, createStrand, height, i, socket, strand, stream, width;

  Socket = require("net").Socket;

  socket = new Socket();
  createOPCStream = require("opc");
  stream = createOPCStream();

  socket.setNoDelay();
  createStrand = require("opc/strand");
  width = 13;
  height = 62;
  strand = createStrand(width * height);
  columns = [];
  i = 0;
  let s = socket.connect(7890, '192.168.0.98');

  stream.pipe(s);

  while (i < width) {
    columns.push(strand.slice(height * i, height * (i + 1)));
    i++;
  }

  s.on('error', (err)=> {
      console.log('err connect socket sidewalk', {err})
  })

  s.on('ready', (err) => {
      console.log('sidewalk connection aquired')
  })

  module.exports = {
    height: height,
    width: width,
    stream: stream,
    strand: strand,
    columns: columns
  };

}).call(this);
