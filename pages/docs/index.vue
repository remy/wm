<template lang="md">
# Documentation

## Platform agnostic webmentions

webmention.app relies entirely on your markup and not your software, so no matter how your content is generated, you can notify other web sites of their webmentions.

Supported formats include: plain HTML, `h-entry` (and `hentry`) Microformat markup, RSS and Atom.

## Using the web service

You can send either URLs with HTML or RSS feeds. The service supports single entries and multiple entries. Multiple entries are found with well formed markup, specifically using [`.h-entry`](https://indieweb.org/h-entry) classnames.

## Using the command line

The command line doesn't rely on https://webmention.app at all - so you can run it locally with the knowledge that if your site outlives this one, the tool will still work.

The tool uses [nodejs](https://nodejs.com) and once nodejs installed, you can install the tool using:

<pre><code><span class="prompt">$</span> npm install @remy/webmention</code></pre>

This provides an executable under the command `webmention` (also available as `wm`). Default usage allows you to pass a file (like a newly generated RSS feed) or a specific URL. It will default to the 10 most recent entries found (using `item` for RSS and `h-entry` for HTML).

By default, the command will perform a dry-run/discovery only on the latest 10 entries found.

The options available are:

- `--send` (default: false) send the webmention to all valid endpoints
- `--limit n` (default: 10) limit to `n` entries found
- `--debug` (default: false) print internal debugging

Using `npx` you can invoke the tool to read the latest entry in your RSS feed:

<pre><code><span class="prompt">$</span> npx webmention https://yoursite.com/feed.xml --limit 1 --send</code></pre>

Altneratively, you can make the tool part of your build workflow and have it execute during a `postbuild` phase:

```
{
  "scripts": {
    "postbuild": "webmention dist/feed.xml --limit 1 --send"
  }
}
```

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
