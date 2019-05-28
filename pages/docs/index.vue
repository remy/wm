<template lang="md">
# Documentation

## Platform agnostic webmentions

webmention.app relies entirely on your markup and not your software, so no matter
how your content is generated, you can notify other web sites of their webmentions.

## Using the web service

You can send either URLs with HTML or RSS feeds. The service supports single entries and multiple entries. Multiple entries are found with wellformed markup, specifically using [`.h-entry`](http://microformats.org/wiki/h-entry) classnames.

## Using the command line

The command line doesn't rely on https://webmention.app at all - so you can run it locally with the knowledge that if your site outlives this one, the tool will stil work.

The tool uses [nodejs](https://nodejs.com) and is installed using:

```
npm install -g @remy/webmention
```

This a global executable under the command `webmention` (also available as `wm`). Default usage allows you to pass a file (like a newly generated RSS feed) or a specific URL. It will default to the 10 most recent entries found (using `item` for RSS and `h-entry` for HTML).

## Further reading

- [TODO](/docs/todo)
- [Issues](https://github.com/remy/wm/issues)
- [Source code](https://github.com/remy/wm/)
</template>

<script>
export default {
  head() {
    return { bodyAttrs: { id: "docs" }, title: "docs :: webmention.app" };
  }
};
</script>
