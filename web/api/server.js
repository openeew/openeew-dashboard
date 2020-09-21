const { GraphQLServer } = require('graphql-yoga');
const { Query, initRESTEndpoints } = require('./resolvers');
const path = require('path');
const express = require('express');

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

server.express.use(express.static(path.join(__dirname, '../client/build')));

server.express.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

initRESTEndpoints(server);

server.start(PORT, () => console.log(`Server is running on ${PORT}`));
