/* eslint-env node */
import '@remy/envy';
import passport from 'passport';
import { github } from '../../../shared/lib/passport.js';

passport.use('github', github);

export async function get(req) {
  console.log('/auth/get');
  return new Promise((resolve) => {
    let location = '';
    passport.authenticate('github', (err, user) => {
      console.log('passport auth', { err: err ? err.__type : null, user });
      if (err) {
        console.log(err);
        return resolve({ location: '/token-failure' });
      }

      if (!user) {
        return resolve({ location: '/token-failure' });
      }

      resolve({
        session: { token: user },
        location: '/token',
      });
    })(req, {
      setHeader: (key, value) => {
        console.log('setHeader', { key, value });
        if (key.toLowerCase() === 'location') {
          location = value;
        }
      },
      end: (...args) => {
        console.log('end', args);
        if (location) {
          resolve({
            location,
          });
        }
      },
    });
  });
}
