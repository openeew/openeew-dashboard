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
        return res.status(500).json({
          message: info.message,
        });
      }

      req.logIn(user, (e) => {
        if (e) {
          return res.status(500).json({
            message: 'Error logging in.',
          });
        }

        return res.json({
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
        });
      });
    })(req, res, next);
  });

  server.express.get('/api/user', isAuth, (req, res) => {
    const user = {};

    if (req.user) {
      user.username = req.user.username;
      user.email = req.user.email;
      user.firstName = req.user.given_name;
      user.lastName = req.user.family_name;
    }

    res.json(user);
  });
};
