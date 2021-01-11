const passportClient = require('../utils/passport.js');

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send('Unauthorized');
};

module.exports = (server) => {
  server.express.post('/api/login', (req, res, next) => {
    passportClient.authenticate((err, user, info) => {
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
