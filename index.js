const check = require('./routes/check');
const handler = require('serve-handler');

module.exports = async (request, response) => {
  await handler(request, response);
};

module.exports = (req, res) => {
  console.log(req.url);

  if (req.url.startsWith('/check')) {
    if (!req.url.includes('?')) {
      const [a, b] = req.url.split('/check/');
      req.url = a + '/check?url=' + b;
    }
    return check(req, res);
  }

  return handler(req, res, {
    public: './',
    cleanUrls: true,
  });
};
