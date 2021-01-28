const { GraphQLServer } = require('graphql-yoga');
const { Query } = require('./graphql/resolvers');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const helmet = require('helmet');

const routes = require('./rest/routes');
const passportClient = require('./services/passport');

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

server.express.use(helmet());

server.express.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
server.express.use(bodyParser.json());

let secret = null;
// If running on Cloud Foundry, set secret to env var
if (process.env.VCAP_APPLICATION) {
  secret = process.env.SESSION_SECRET;
} else {
  // In dev, set to user-defined secret in vcap-local.json
  secret = require('./vcap-local.json').user_vars.session_secret;
}

server.express.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
  }),
);

server.express.use(passportClient.initPassport());
server.express.use(passportClient.initSession());
passportClient.connectStrategy();

let allowedOrigin = null;
if (process.env.VCAP_APPLICATION) {
  allowedOrigin = 'https://openeew-dashboard.mybluemix.net';
} else {
  allowedOrigin = 'http://localhost:3000';
}

server.express.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// USE_STATIC env var added by docker
if (process.env.USE_STATIC) {
  server.express.use(express.static(path.join(__dirname, './build')));

  server.express.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
}

routes(server);

server.start(PORT, () => console.log(`Server is running on ${PORT}`));
