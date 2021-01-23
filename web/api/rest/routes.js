const fetch = require('node-fetch');
const validator = require('email-validator');

const passportService = require('../utils/passport.js');
const IBMCloudIAM = require('../utils/IBMCloudIam');

let TENET_ID;
let services = null;

if (process.env.VCAP_APPLICATION) {
  services = JSON.parse(process.env.VCAP_SERVICES);
  TENET_ID = services.AppID[0].credentials.tenantId;
} else {
  TENET_ID = require('../vcap-local.json').services.AppID.credentials.tenantId;
}

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send('Unauthorized');
};

module.exports = (server) => {
  /**
   * POST /verification
   * Calls AppID management API and verifies if email belongs to existing user
   * @param {email} The user's email
   * @returns {Object} User information and new account link (if new user)
   */
  server.express.post('/api/verification', async (req, res) => {
    const { email } = req.body;
    let token;

    if (!email || !validator.validate(email)) {
      return res.status(422).send('Email is missing or invalid');
    }

    try {
      token = await IBMCloudIAM.getAccessToken();
    } catch (e) {
      return res
        .status(503)
        .send('Error authenticating API. This is an error with the server.');
    }

    const formattedEmail = email.replace('@', '%40');

    const response = await fetch(
      `https://us-south.appid.cloud.ibm.com/management/v4/${TENET_ID}/cloud_directory/Users?query=${formattedEmail}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(response);
      return res
        .status(503)
        .send('There was an error verifying the email (Dependency failed)');
    }

    const json = await response.json();

    if (json.totalResults === 0) {
      return res.json({
        verified: false,
        firstName: '',
        lastName: '',
      });
    }

    return res.json({
      verified: true,
      firstName: json.Resources[0].name.givenName,
      lastName: json.Resources[0].name.familyName,
    });
  });

  /**
   * POST /login
   * Logins in a user, creates express session
   * @param {string} email
   * @param {string} password
   * @returns {Object} User information
   */
  server.express.post('/api/login', (req, res, next) => {
    passportService.authenticate((err, user, info) => {
      if (err || info) {
        return res.status(info.statusCode).json({
          errorCode: info.code,
        });
      }

      req.logIn(user, (e) => {
        if (e) {
          return res.status(500).json({
            errorCode: 'login_error',
          });
        }

        return res.json({
          success: true,
          email: req.user.email,
          firstName: req.user.given_name,
          lastName: req.user.family_name,
        });
      });
    })(req, res, next);
  });

  server.express.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          errorCode: 'logout_error',
        });
      }

      res.clearCookie('connect.sid');
      res.send(true);
    });
  });

  server.express.post('/api/user', (req, res) => {
    res.send('Success');
  });

  server.express.get('/api/user', isAuth, (req, res) => {
    const user = {};

    if (req.user) {
      user.username = req.user.username;
      user.email = req.user.email;
      user.firstName = req.user.given_name;
      user.lastName = req.user.family_name;
    }

    res.json({ ...user, success: true });
  });
};
