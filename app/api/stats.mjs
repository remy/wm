import db from '../../shared/lib/db.js';

export function get() {
  // TODO work out how this fails…
  return db.getRecentURLs().then(({ Items: data }) => {
    return {
      json: {
        data: data
          .filter((_) => _.url !== '__sent')
          .sort((a, b) => (a.requested < b.requested ? 1 : -1))
          .slice(0, 20),
        total: data.length - 1,
        sent: data.find((_) => _.url === '__sent').hits,
      },
    };
  });
}
