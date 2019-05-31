// const admin = require('firebase-admin');

// admin.initializeApp({
//   credential: admin.credential.cert(credential),

// });

// const db = admin.database();

// module.exports = db;

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

// Authenticate a JWT client with the service account.
var jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

// Use the JWT client to generate an access token.
const token = new Promise((resolve, reject) => {
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

const dbURL = 'https://webmetion-app.firebaseio.com';

function put({ path, data }) {
  return token.then(token => {
    return fetch(`${dbURL}/${path}?access_token=${token}`, {
      method: 'put',
      body: JSON.stringify(data),
    });
  });
}

function get({ path }) {
  return token.then(token => {
    return fetch(`${dbURL}/${path}?access_token=${token}`).then(res =>
      res.json()
    );
  });
}

module.exports = {
  refs(path) {
    return {
      async transaction(transform) {
        const res = await get({ path });
        return put({ path, data: transform(res) });
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
