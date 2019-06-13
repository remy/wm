# webmention.app

## Automate your outgoing webmentions

[webmention.app](https://webmention.app) is a platform agnostic service that will check a given URL for links to other sites, discover if they support webmentions, then send a webmention to the target.

This repository also includes a stand alone command line tool that doesn't rely on [webmention.app](https://webmention.app) at all and doesn't require a token - so you can run it locally with the knowledge that if your site outlives this one, the tool will still work.

### Installation

The tool uses nodejs and once nodejs is installed, you can install the tool using:

```
$ npm install @remy/webmention
```

This provides an executable under the command webmention (also available as wm). Default usage allows you to pass a filename (like a newly generated RSS feed) or a specific URL. It will default to the 10 most recent entries found (using item for RSS and `h-entry` for HTML).

### Usage

By default, the command will perform a dry-run/discovery only. To complete the notification of webmentions use the `--send` flag.

The options available are:

- `--send` (default: false) send the webmention to all valid endpoints
- `--limit n` (default: 10) limit to n entries found
- `--debug` (default: false) print internal debugging
Using npx you can invoke the tool to read the latest entry in your RSS feed:

```
$ npx webmention https://yoursite.com/feed.xml --limit 1 --send
```

Alternatively, you can make the tool part of your build workflow and have it execute during a postbuild phase:

```json
{
  "scripts": {
    "postbuild": "webmention dist/feed.xml --limit 1 --send"
  }
}
```

## Misc

- Further documentation found on [webmention.app/docs](https://webmention.app/docs)
- Built by [@rem](https://remysharp.com)
- MIT / [rem.mit-license.org](https://rem.mit-license.org/)
