const { GraphQLServer, PubSub } = require('graphql-yoga');
const { Query, initRESTEndpoints } = require('./resolvers');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pubsub = new PubSub();

const resolvers = {
  Query,
};

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

server.express.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

initRESTEndpoints(server);

server.start(() => console.log(`Server is running on http://localhost:4000`));
