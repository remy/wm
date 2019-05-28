<template lang="md">
# Documentation
## Platform agnostic webmentions

## How to check for webmentions

## How to send webmentions automatically

## Using the command line

The command line doesn't rely on https://webmention.app at all - so you can run it locally with the knowledge that if your site outlives this one, the tool will stil work.

The tool uses [nodejs](https://nodejs.com) and is installed using:

```
npm install -g @remy/webmention
```

This a global executable under the command `webmention` (also available as `wm`). Default usage allows you to pass a file (like a newly generated RSS feed) or a specific URL. It will default to the 10 most recent entries found (using `item` for RSS and `h-entry` for HTML).
</template>

<script>
export default {
  head() {
    return { bodyAttrs: { id: "docs" }, title: "docs" };
  }
};
</script>
