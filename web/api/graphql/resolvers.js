const _mockData = require('../_mockData/2.json');

let pool = [..._mockData];
let stream = [];
let max = 0;

/**
 * * Currently, this file handles graphql queries made to the mock API, but
 * * in the future it will connect to live data.
 */

function resetStream() {
  console.log('Stream reset');

  max = 0;
  pool = [..._mockData];
  stream.length = 0;
}

/**
 * * When called by setInterval, this will add to
 * * the acclerations stream. Removed for now since
 * * the chart on the client is not rendered.
 */
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

// Temp disabled
// setInterval(addToStream, 1000);

const Query = {
  accStream,
  maxAcc,
};

module.exports = {
  Query,
};
