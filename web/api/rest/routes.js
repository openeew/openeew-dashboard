const validator = require('email-validator');

const passportService = require('../services/passport.js');
const AppIdManagement = require('../services/appId');

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
    let results;

    if (!email || !validator.validate(email)) {
      return res.status(422).send('Email is missing or invalid');
    }

    try {
      results = await AppIdManagement.verifyUserByEmail(email);

      // If no user, create user
      if (results.totalResults === 0) {
        const user = await AppIdManagement.createUser(email);

        return res.json({
          verified: false,
          firstName: null,
          lastName: null,
          email,
          userId: user.id,
        });
      }

      return res.json({
        verified: true,
        firstName: results.Resources[0].name
          ? results.Resources[0].name.givenName
          : null,
        lastName: results.Resources[0].name
          ? results.Resources[0].name.familyName
          : null,
        userId: results.Resources[0].id,
        email,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(503)
        .send('There was an error verifying or creating a user.');
    }
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
