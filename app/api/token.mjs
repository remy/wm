export function get({ session }) {
  const token = session.token || null;
  return {
    json: {
      token,
    },
  };
}
