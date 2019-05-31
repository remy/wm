const Strategy = require('passport-github2').Strategy;
const uuid = require('./uuid');
const db = require('../lib/db');

exports.github = new Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
    // callbackURL: process.env.GITHUB_CALLBACK,
  },
  async (accessToken, refreshToken, profile, done) => {
    const token = uuid();

    try {
      const users = db.ref('users');
      users.child(token).set({
        username: `github:${profile.id}`,
      });
    } catch (e) {
      console.log('ERRRR');
      console.log(e.message);
    }

    return done(null, token);
  }
);
