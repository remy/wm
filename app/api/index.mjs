import db from '../../shared/lib/db.js';

export function get() {
  return db.getRequestCount('__sent').then((data) => {
    return { json: { total: data.hits } };
  });
}
