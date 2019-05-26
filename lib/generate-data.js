const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;

function parse(type) {
  const data = readFileSync(__dirname + `/../data/${type}-hosts.txt`, 'utf8');
  return data
    .split('\n')
    .filter(Boolean)
    .map(_ => {
      const [source, endpoint = null] = _.replace(/\s+/g, ' ')
        .split(' ')
        .filter(Boolean);
      return { source, endpoint };
    });
}

const hosts = []
  .concat(parse('known'), parse('unknown'), parse('bad'))
  .reduce(
    (acc, curr) => Object.assign(acc, { [curr.source]: curr.endpoint }),
    {}
  );

writeFileSync(
  __dirname + '/../generated/hosts.json',
  JSON.stringify(hosts),
  'utf8'
);
