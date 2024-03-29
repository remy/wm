const Strategy = require('passport-github2').Strategy;
const uuid = require('./uuid');
const db = require('./db');

const config = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
};

exports.github = new Strategy(
  config,
  (accessToken, refreshToken, profile, done) => {
    const username = `github-${profile.id}`;

    db.getByUsername(username)
      .then((user) => {
        if (user) {
          return done(null, user.token);
        }

        const token = uuid();

        db.createUser({ username, token, service: 'github', id: profile.id })
          .then(() => done(null, token))
          .catch((e) => done(e));
      })
      .catch(done);
  }
);
