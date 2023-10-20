import passport from 'passport';
import qs from '../lib/query-string';
import { github } from '../lib/passport';

passport.use('github', github);

export default (req, res) => {
  req.query = qs(req);

  res.redirect = (url) => {
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
