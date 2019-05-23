function main($) {
  const anchors = $('a[href^="http"]')
    .map((i, el) => $(el).attr('href'))
    .get();

  // leaving <picture> for the time being
  const images = $('img[src^="http"]')
    .map((i, el) => $(el).attr('src'))
    .get();

  const media = [];
  $('video, audio').each((i, el) => {
    const sources = $(el).find('source');
    if (sources.length) {
      sources.each((i, el) => media.push($(el).attr('src')));
    } else {
      media.push($(el).attr('src'));
    }
  });

  return [].concat(anchors, images, media).filter(_ => _.startsWith('http'));
}

module.exports = main;
