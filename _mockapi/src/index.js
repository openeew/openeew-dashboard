const { GraphQLServer, PubSub } = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Subscription = require('./resolvers/Subscription');
const { PrismaClient } = require('@prisma/client');

const _mockData = require('./_mockData.json');

const prisma = new PrismaClient();

const pubsub = new PubSub();

const resolvers = {
  Query,
  Subscription,
};

let accCounter = 0;
let streamRunning = false;
let intervalId;

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma,
      pubsub,
    };
  },
});

server.express.put('/_stream', (req, res) => {
  if (streamRunning) {
    streamRunning = false;

    clearInterval(intervalId);

    return res.send(streamRunning);
  }

  streamRunning = true;

  intervalId = setInterval(() => {
    pubsub.publish('NEW_ACC_DATA', {
      ..._mockData[accCounter],
      // eslint-disable-next-line camelcase
      device_t: Date.now(),
    });
    accCounter++;

    if (accCounter === _mockData.length - 1) {
      accCounter = 0;
    }
  }, 1000);

  res.send(streamRunning);
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
