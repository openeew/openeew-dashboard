const _mockData = require('./_mockData/2.json');

let pool = [..._mockData];
let stream = [];

function resetStream() {
  console.log('Stream reset');

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
}

setInterval(addToStream, 1000);

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
};

module.exports = {
  Query,
  initRESTEndpoints,
};
