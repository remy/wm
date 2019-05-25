module.exports = source => {
  source = source.replace(/>\s+</gm, '').trim();
  if (source.startsWith('<?xml')) {
    return true;
  }

  return false;
};
