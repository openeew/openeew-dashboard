const express = require('express');
const session = require('express-session');
const path = require('path');
const bearerToken = require('express-bearer-token');
const fs = require('fs');
const cors = require('cors');
const {
  ApolloServer,
  gql,
  AuthenticationError,
} = require('apollo-server-express');

const resolvers = require('./resolvers/resolvers');
const SensorAPI = require('./datasources/sensor');

const typeDefs = gql`
  ${fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf8')}
`;

const helmet = require('helmet');

const routes = require('./rest/routes');
const passportClient = require('./services/passport');

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  }),
);

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bearerToken());

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

let secret = null;
// If running on Cloud Foundry, set secret to env var
if (process.env.VCAP_APPLICATION) {
  secret = process.env.SESSION_SECRET;
} else {
  // In dev, set to user-defined secret in vcap-local.json
  secret = require('./vcap-local.json').user_vars.session_secret;
}

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passportClient.initPassport());
app.use(passportClient.initSession());
passportClient.connectStrategy();

// USE_STATIC env var added by docker
if (process.env.USE_STATIC) {
  app.use(express.static(path.join(__dirname, './build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    sensorAPI: new SensorAPI(),
  }),
  context: ({ req }) => {
    if (!req.user) throw new AuthenticationError('Unauthorized');

    return { user: req.user };
  },
  cors: corsOptions,
});

server.applyMiddleware({ app, cors: corsOptions });

routes(app);

app.listen(PORT, () => {
  console.log(`📡 Server is listening on port ${PORT}`);
});
