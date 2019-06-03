var DynamoDB = require('aws-sdk/clients/dynamodb');

let client = new DynamoDB.DocumentClient({
  region: 'eu-west-2',
  accessKeyId: process.env.DB_KEY_ID,
  secretAccessKey: process.env.DB_ACCESS_KEY,
});

function _(TableName) {
  return {
    get(Key) {
      return client
        .get({ TableName, Key })
        .promise()
        .then(res => res.Item);
    },
    put(Item) {
      return client.put({ TableName, Item }).promise();
    },
  };
}

function getRequestCount(url) {
  return _('wm-requests').get({ url });
}

async function updateRequestCount(url) {
  const lastRequested = new Date().toJSON();

  const update = {
    Key: { url },
    TableName: 'wm-requests',
    UpdateExpression: 'set hits = hits + :val, lastRequested = :lastRequested',
    ExpressionAttributeValues: {
      ':val': 1,
      ':lastRequested': lastRequested,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return client
    .update(update)
    .promise()
    .catch(err => {
      console.log(err);

      if (err && err.code === 'ValidationException') {
        // make it
        return _('wm-requests').put({
          url,
          lastRequested,
          hits: 1,
        });
      }
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      );
      throw err;
    });
}

function getByUsername(username) {
  return _('wm-users')
    .get({
      username,
    })
    .catch(e => {
      console.log('catch on getByUsername', username, e.message);
      return null;
    });
}

function createUser({ username, token }) {
  return _('wm-users').put({ username, token, requests: 0 });
}

function updateTokenRequestCount(token) {
  const update = {
    Key: { token },
    TableName: 'wm-users',
    UpdateExpression: 'set requests = requests + :val',
    ExpressionAttributeValues: {
      ':val': 1,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return client
    .update(update)
    .promise()
    .catch(() => null);
}

module.exports = {
  updateRequestCount,
  getByUsername,
  createUser,
  updateTokenRequestCount,
  getRequestCount,
  _,
};
