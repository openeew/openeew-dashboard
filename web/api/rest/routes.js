const validator = require('email-validator');
const qs = require('qs');

const passportService = require('../services/passport.js');
const AppIdManagement = require('../services/appId');
const jwt = require('../services/jwt');

let dashboardURL;

if (process.env.DASHBOARD_URL) {
  dashboardURL = process.env.DASHBOARD_URL;
} else {
  dashboardURL = 'http://localhost:3000';
}

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

module.exports = (app) => {
  /**
   * POST /verification
   * Calls AppID management API and verifies if email belongs to existing user
   * @param {email} The user's email
   * @returns {Object} User information and new account link (if new user)
   */
  app.post('/api/verification', apiKeyAuth, async (req, res) => {
    const { email, givenName, familyName } = req.body;
    let link;
    let results;
    let user;

    if (!email || !validator.validate(email)) {
      return res.status(400).json({ message: 'Email missing' });
    }

    try {
      results = await AppIdManagement.verifyUserByEmail(email);

      // If no user, create user
      if (results.totalResults === 0) {
        user = await AppIdManagement.createUser(email, givenName, familyName);

        link = `${dashboardURL}/onboard?${qs.stringify({
          token: await jwt.encode({ id: user.id }),
        })}`;

        return res.json({
          verified: false,
          new: true,
          active: false,
          givenName,
          familyName,
          email,
          uuid: user.id,
          link,
        });
      }

      user = results.Resources[0];

      // If user has account, but has not finished
      // onboarding, generate new link & token
      if (!user.active) {
        link = `${dashboardURL}/onboard?${qs.stringify({
          token: await jwt.encode({ id: user.id }),
        })}`;
      }

      await jwt.encode({ id: user.id });
      return res.json({
        verified: true,
        new: false,
        active: user.active,
        givenName: user.name ? user.name.givenName : null,
        familyName: user.name ? user.name.familyName : null,
        uuid: user.id,
        email,
        link: !user.active ? link : null,
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
  app.get('/api/user/token', async (req, res) => {
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
  app.post('/api/user/onboard', async (req, res) => {
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
  app.post('/api/login', (req, res, next) => {
    passportService.authenticate((err, user, info) => {
      if (err || info) {
        if (info.code === 'invalid_grant') {
          return res.status(401).json({
            message: 'Unauthorized',
            clientCode: 'unauthorized',
          });
        }

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

  app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Missing email.' });
    }

    try {
      await AppIdManagement.forgotPassword(email);

      return res.json({ success: true });
    } catch (e) {
      // To not indicate whether a user exists in db,
      // a success message is returned if the user is not found
      if (e.message === 'user_not_found') {
        return res.json({ success: true });
      }

      return res.status(500).json({
        message: 'Error processing forgot password.',
        clientCode: 'error_forgot_password',
      });
    }
  });

  app.post('/api/logout', (req, res) => {
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

  app.get('/api/user', isAuth, (req, res) => {
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
