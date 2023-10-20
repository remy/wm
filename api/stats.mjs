const db = require('../lib/db');

module.exports = (req, res) => {
  db.getRecentURLs()
    .then(({ Items: data }) => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          data: data
            .filter(_ => _.url !== '__sent')
            .sort((a, b) => (a.requested < b.requested ? 1 : -1))
            .slice(0, 20),
          total: data.length - 1,
          sent: data.find(_ => _.url === '__sent').hits,
        })
      );
    })
    .catch(E => {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify(E));
    });
};
