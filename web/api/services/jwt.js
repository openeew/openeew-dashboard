const jwt = require('jsonwebtoken');

let secret;

if (process.env.VCAP_APPLICATION) {
  secret = process.env.JWT_SECRET;
} else {
  secret = require('../vcap-local.json').user_vars.jwt_secret;
}

if (!secret) {
  throw new Error(
    'No JWT secret found. If this is a dev environment, add required secrets to a copy of vcap-local.template.json named vcap-local.json.',
  );
}

const encode = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { algorithm: 'HS256' }, function (err, token) {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });

const decode = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (error, decoded) {
      if (error) {
        return reject(error);
      }
      return resolve(decoded);
    });
  });

module.exports = {
  encode,
  decode,
};
