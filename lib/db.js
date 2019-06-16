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

function getRecentURLs() {
  return client
    .scan({
      TableName: 'wm-requests',
      ScanIndexForward: true,
    })
    .promise();
}

function getRequestCount(url) {
  return _('wm-requests').get({ url });
}

async function updateRequestCount(url, increment = 1) {
  const requested = new Date().toJSON();

  const update = {
    Key: { url },
    TableName: 'wm-requests',
    UpdateExpression: 'set hits = hits + :val, requested = :requested',
    ExpressionAttributeValues: {
      ':val': increment,
      ':requested': requested,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  return client
    .update(update)
    .promise()
    .catch(err => {
      if (err && err.code === 'ValidationException') {
        // make it
        return _('wm-requests').put({
          url,
          requested,
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
  const ExpressionAttributeValues = { ':username': username };
  const KeyConditionExpression = `username = :username`;

  const params = {
    TableName: 'wm-users',
    IndexName: 'username-index',
    KeyConditionExpression,
    ExpressionAttributeValues,
  };

  return client
    .query(params)
    .promise()
    .then(res => {
      return res.Items[0];
    })
    .catch(() => {
      // console.log('catch on getByUsername(%s): %s', username, e.message);
      return null;
    });
}

function createUser({ username, token, service, id }) {
  return _('wm-users').put({ username, token, requests: 0, [service]: id });
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
  getRecentURLs,
  _,
};
