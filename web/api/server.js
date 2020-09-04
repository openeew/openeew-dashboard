const { GraphQLServer } = require('graphql-yoga');
const { Query, initRESTEndpoints } = require('./resolvers');

const PORT = process.env.PORT || 4000;

const resolvers = {
  Query,
};

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
    };
  },
});

server.express.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

initRESTEndpoints(server);

server.start(PORT, () => console.log(`Server is running on ${PORT}`));
