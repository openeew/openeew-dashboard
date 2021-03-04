const validator = require('email-validator');
const qs = require('qs');

const passportService = require('../services/passport.js');
const AppIdManagement = require('../services/appId');
const jwt = require('../services/jwt');

const dashboardURL = process.env.VCAP_APPLICATION
  ? process.env.ALLOWED_ORIGIN_URLS.split(',')[0]
  : 'http://localhost:3000';

if (!dashboardURL) throw new Error('No allowed origin found.');

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send('Unauthorized');
};

const apiKeyAuth = (req, res, next) => {
  let apiKey;

  if (process.env.VCAP_APPLICATION) {
    apiKey = process.env.OPENEEW_API_KEY;
  } else {
    apiKey = require('../vcap-local.json').user_vars.openeew_api_key;
  }

  if (!req.token || req.token !== apiKey) {
    return res.status(401).send('Unauthorized');
  }

  next();
};

module.exports = (server) => {
  /**
   * POST /verification
   * Calls AppID management API and verifies if email belongs to existing user
   * @param {email} The user's email
   * @returns {Object} User information and new account link (if new user)
   */
  server.express.post('/api/verification', apiKeyAuth, async (req, res) => {
    const { email, givenName, familyName } = req.body;
    let results;

    if (!email || !validator.validate(email)) {
      return res.status(400).json({ message: 'Email missing' });
    }

    try {
      results = await AppIdManagement.verifyUserByEmail(email);

      // If no user, create user
      if (results.totalResults === 0) {
        const user = await AppIdManagement.createUser(
          email,
          givenName,
          familyName,
        );

        const token = await jwt.encode({ id: user.id });

        const link = `${dashboardURL}/onboard?${qs.stringify({
          token,
        })}`;

        return res.json({
          verified: false,
          givenName,
          familyName,
          email,
          uuid: user.id,
          link,
        });
      }

      return res.json({
        verified: true,
        givenName: results.Resources[0].name
          ? results.Resources[0].name.givenName
          : null,
        familyName: results.Resources[0].name
          ? results.Resources[0].name.familyName
          : null,
        uuid: results.Resources[0].id,
        email,
        link: null,
      });
    } catch (e) {
      return res.status(500).json({ message: 'Error verifying user' });
    }
  });

  /**
   * GET /user/token
   * Gets user id by using a JWT Bearer token as auth
   * @returns {Object} User information
   */
  server.express.get('/api/user/token', async (req, res) => {
    const token = req.token;
    let decoded;
    let user;

    if (!token) {
      return res.status(400).json({
        message: 'Token is missing',
        clientCode: 'onboardTokenMissing',
      });
    }

    try {
      decoded = await jwt.decode(token);
    } catch (e) {
      return res.status(401).json({
        message: 'Unauthorized',
        clientCode: 'unauthorized',
      });
    }

    try {
      user = await AppIdManagement.getUserById(decoded.id);
    } catch (e) {
      if (e.message === 'user_not_found') {
        return res.status(404).json({
          message: 'User not found',
          clientCode: 'userNotFound',
        });
      }

      return res.status(500).json({ message: 'Error locating user' });
    }

    res.send({ uuid: decoded.id, givenName: user.name.givenName });
  });

  /**
   * POST /user/onboard
   * Finalizes acccount creation. Uses token as authentication
   * to update password
   * @param {string} token
   * @returns {Object} User information
   */
  server.express.post('/api/user/onboard', async (req, res) => {
    const { password } = req.body;
    const token = req.token;
    let decoded;

    if (!token) {
      return res.status(400).json({
        message: 'Token not found',
        clientCode: 'onboardTokenNotFound',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'New user password not found',
        clientCode: 'onboardPasswordNotFound',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be greater than 8 characters',
        clientCode: 'passwordInvalid',
      });
    }

    try {
      decoded = await jwt.decode(token);
    } catch (e) {
      return res.status(401).json({
        message: 'Unauthorized',
        clientCode: 'unauthorized',
      });
    }

    try {
      const user = await AppIdManagement.getUserById(decoded.id);

      // If user.active is set to true, account has already
      // been finalized. You cannot use this process to set a password
      // twice
      if (user.active) {
        return res.status(409).json({
          message: 'User has already finalized account',
          clientCode: 'onboardAlreadyFinal',
        });
      }

      await AppIdManagement.changeUserPassword(user.id, password);

      const updatedUser = await AppIdManagement.updateUser(user.id, {
        ...user,
        active: true,
      });

      res.send({
        uuid: updatedUser.id,
        emailVerified: updatedUser.status !== 'PENDING',
      });
    } catch (e) {
      if (e.message === 'user_not_found') {
        return res.status(404).json({
          message: 'User not found',
          clientCode: 'onboardUserNotFound',
        });
      }

      return res.status(500).json({ message: 'Error updating user' });
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
          givenName: req.user.given_name,
          familyName: req.user.family_name,
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

  server.express.get('/api/user', isAuth, (req, res) => {
    const user = {};

    if (req.user) {
      user.username = req.user.username;
      user.email = req.user.email;
      user.givenName = req.user.given_name;
      user.familyName = req.user.family_name;
    }

    res.json({ ...user, success: true });
  });
};
