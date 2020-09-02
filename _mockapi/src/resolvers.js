const _mockData = require('./_mockData/2.json');

let pool = [..._mockData];
let stream = [];

function resetStream() {
  pool = [..._mockData];
  stream.length = 0;
}

function addToStream() {
  if (pool.length === 0) {
    resetStream();
  }

  const next = pool.shift();

  stream = stream.concat(next);

  if (stream.length > 50) {
    stream.shift();
  }

  console.log('pool', pool.length);
}

setInterval(addToStream, 1000);

function allSensors(parent, args, context) {
  return context.prisma.sensors.findMany();
}

function accStream() {
  return stream;
}

function initRESTEndpoints(server) {
  server.express.put('/_stream', (req, res) => {
    resetStream();

    res.send(true);
  });
}

const Query = {
  accStream,
  allSensors,
};

module.exports = {
  Query,
  initRESTEndpoints,
};
