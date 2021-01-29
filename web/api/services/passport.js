const passport = require('passport');
const appId = require('ibmcloud-appid');

const { WebAppStrategy } = appId;

let appStrategy = null;

if (process.env.VCAP_APPLICATION) {
  appStrategy = new WebAppStrategy();
} else {
  const devConfig = require('../vcap-local.json').services.AppID.credentials;
  devConfig.redirectUri = 'http://localhost:3000/ibm/cloud/appid/callback';

  appStrategy = new WebAppStrategy(devConfig);
}

class PassportService {
  constructor() {
    this.passport = passport;
  }

  initPassport() {
    return this.passport.initialize();
  }

  initSession() {
    return this.passport.session();
  }

  connectStrategy() {
    this.passport.use(appStrategy);

    this.passport.serializeUser((user, done) => done(null, user));

    this.passport.deserializeUser((obj, cb) => cb(null, obj));
  }

  authenticate(cb) {
    return this.passport.authenticate(WebAppStrategy.STRATEGY_NAME, cb);
  }
}

const passportClient = new PassportService();

module.exports = passportClient;
