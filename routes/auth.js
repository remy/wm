const passport = require('passport');
const qs = require('../lib/query-string');
passport.use('github', require('../lib/passport').github);

module.exports = (req, res) => {
  req.query = qs(req);

  res.redirect = url => {
    res.writeHead(302, { location: url });
    res.end();
  };

  passport.authenticate('github', (err, user) => {
    if (err) {
      console.log(err);
      return res.redirect('/token-failure');
    }

    if (!user) {
      return res.redirect('/token-failure');
    }

    res.setHeader('Set-Cookie', 'token=' + user + '; Path=/');
    res.redirect('/token');
  })(req, res);
};
