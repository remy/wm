export function get() {
  console.log('api/index/get');
  return {
    json: {
      title: 'docs :: webmention.app',
    },
  };
}
