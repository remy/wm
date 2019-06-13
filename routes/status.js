const db = require('../lib/db');

module.exports = (req, res) => {
  db.getRecentURLs()
    .then(({ Items: data }) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify(
          data.sort((a, b) => (a.lastRequested < b.lastRequested ? 1 : -1))
        )
      );
    })
    .catch(E => {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify(E));
    });
};
