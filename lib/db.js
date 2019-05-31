const fetch = require('node-fetch');
const { google } = require('googleapis');

// Load the service account key JSON file.
const serviceAccount = JSON.parse(
  Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64')
);

// Define the required scopes.
var scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/firebase.database',
];

// Use the JWT client to generate an access token.
const token = () =>
  new Promise((resolve, reject) => {
    // Authenticate a JWT client with the service account.
    var jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      scopes
    );

    jwtClient.authorize(function(error, tokens) {
      if (error) {
        reject(
          new Error(
            'Error making request to generate access token: ' + error.message
          )
        );
      } else if (tokens.access_token === null) {
        reject(
          new Error(
            'Provided service account does not have permission to generate access tokens'
          )
        );
      } else {
        resolve(tokens.access_token);
      }
    });
  });

const dbURL = 'https://webmetion-app.firebaseio.com/';

function put({ path, data }) {
  return token().then(token => {
    return fetch(`${dbURL}/${path}.json?access_token=${token}`, {
      method: 'put',
      body: JSON.stringify(data),
    }).then(res => res.json());
  });
}

function get({ path, query = '' }) {
  return token().then(token => {
    return fetch(`${dbURL}/${path}.json?${query}&access_token=${token}`).then(
      res => res.json()
    );
  });
}

module.exports = {
  ref(path) {
    return {
      transaction(transform) {
        return get({ path }).then(res => {
          return put({ path, data: transform(res) });
        });
      },
      find(key, value) {
        const query = `orderBy=${JSON.stringify(key)}&equalTo=${JSON.stringify(
          value
        )}`;
        return get({ path, query }).then(res => {
          const keys = Object.keys(res);
          return res[keys[0]];
        });
      },
      child(key) {
        return {
          set(data) {
            return put({ path: `${path}/${key}`, data });
          },
        };
      },
    };
  },
};
