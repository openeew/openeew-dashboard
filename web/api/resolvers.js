const _mockData = require('./_mockData/2.json');

let pool = [..._mockData];
let stream = [];
let max = 0;

function resetStream() {
  console.log('Stream reset');

  max = 0;
  pool = [..._mockData];
  stream.length = 0;
}

function addToStream() {
  if (pool.length === 0) {
    resetStream();
  }

  const next = pool.shift();

  const localMax = Math.max(...next.x, ...next.y, ...next.z);

  if (localMax > max) {
    max = localMax;
  }

  stream = stream.concat(next);

  if (stream.length > 50) {
    stream.shift();
  }
}

function maxAcc() {
  return max;
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

setInterval(addToStream, 1000);

const Query = {
  accStream,
  maxAcc,
};

module.exports = {
  Query,
  initRESTEndpoints,
};
