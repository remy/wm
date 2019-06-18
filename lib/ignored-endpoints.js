/*
Add known websites that do not and are unlikely ever to have
a webmention or pingback endpoint.

If it's an exact hostname, then use it's name, if you want
to match all cnames off the hostname, use a leading period,
e.g. .github.com will match both github.com and gist.github.com
*/

module.exports = `
.amazon.com
.cloudfront.net
.facebook.com
.flickr.com
.github.com
.google.com
.instagram.com
.linkedin.com
.mapbox.com
.medium.com
.gravatar.com
.npmjs.com
.stackoverflow.com
.swarmapp.com
.twimg.com
.twitter.com
.wordpress.org
.wp.com
.youtube.com
.w3.org
bit.ly
developer.mozilla.org
gitlab.com
html.spec.whatwg.org
httparchive.org
ifttt.com
ind.ie
indieauth.com
instagram.com
microformats.org
www.brid.gy
www.complexity-explorables.org
www.frontendunited.org
www.meltingasphalt.com
www.newyorker.com
www.wired.com
youtu.be
${/* here begin known 404s */ ''}
pipes.yahoo.com
andreaarbogast.org
`
  .split('\n')
  .map(_ => _.trim())
  .filter(Boolean);
