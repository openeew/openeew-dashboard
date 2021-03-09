const { GraphQLServer } = require('graphql-yoga');

const supertest = require('supertest');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('../rest/routes');
const bearerToken = require('express-bearer-token');
const { Query } = require('../graphql/resolvers');
const faker = require('faker');

const jwt = require('../services/jwt');
const AppIdManagement = require('../services/appId');

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

server.express.use(bearerToken());

server.express.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
server.express.use(bodyParser.json());

routes(server);

/**
 * RUN TESTS
 */

const request = supertest(server.express);
let mockUser;
let validToken;

beforeAll(async () => {
  mockUser = await AppIdManagement.createUser(
    faker.internet.email(),
    faker.name.firstName(),
    faker.name.lastName(),
  );

  validToken = await jwt.encode({
    id: mockUser.id,
  });
});

afterAll(() => {
  AppIdManagement.removeUser(mockUser.id);
});

describe('Created user', () => {
  it('has active set to false', () => {
    expect(mockUser.active).toBe(false);
  });

  it('has status set to pending', () => {
    expect(mockUser.active).toBe(false);
  });
});

describe('GET /user/token', () => {
  it('responds with uuid, givenName and 200 if sent valid token as auth method', async (done) => {
    const response = await request
      .get(`/api/user/token`)
      .set('Authorization', 'Bearer ' + validToken);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      uuid: mockUser.id,
      givenName: mockUser.name.givenName,
    });

    done();
  });

  it('responds with 400, message & clientCode if token missing', async (done) => {
    const response = await request.get(`/api/user/token`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Token is missing',
      clientCode: 'onboardTokenMissing',
    });

    done();
  });

  it('responds with 401 if sent with altered token', async (done) => {
    const badToken = validToken.slice(10);

    const response = await request
      .get(`/api/user/token`)
      .set('Authorization', 'Bearer ' + badToken);

    expect(response.status).toBe(401);

    done();
  });
});

describe('GET /user/onboard', () => {
  it('responds with user and 200 if onboarding successful', async (done) => {
    const response = await request
      .post(`/api/user/onboard`)
      .set('Authorization', 'Bearer ' + validToken)
      .send({
        password: faker.internet.password(),
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      uuid: mockUser.id,
      emailVerified: false,
    });

    done();
  });
});
