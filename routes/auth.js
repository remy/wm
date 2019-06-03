const passport = require('passport');
const qs = require('../lib/query-string');
passport.use('github', require('../lib/passport').github);

const auth = passport.authenticate('github', {
  scope: ['gist'],
  session: false,
  failureRedirect: '/token-failure',
  successRedirect: '/',
});

module.exports = (req, res) => {
  req.query = qs(req);

  res.redirect = url => {
    res.writeHead(302, { location: url });
    res.end();
  };
  auth(req, res, data => {
    console.log(data);

    res.redirect('/');
  });
};
