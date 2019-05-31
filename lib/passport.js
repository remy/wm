const Strategy = require('passport-github2').Strategy;
const uuid = require('./uuid');
const db = require('../lib/db');

exports.github = new Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
  },
  (accessToken, refreshToken, profile, done) => {
    const username = `github-${profile.id}`;
    const users = db.ref('users');

    users.find('username', username).then(user => {
      if (user) {
        return done(null, user.token);
      }

      const token = uuid();

      users.child(token).set({ username, token });
      return done(null, token);
    });
  }
);
