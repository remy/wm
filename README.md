This is a micro service that will check a given URL for links to other sites, discover if those links support webmentions and will send a webmention POST to the target.

The API is simplistic for now:

- GET  https://webmention.app/check/:url - performs a dry run, showing what will be sent
- POST https://webmention.app/check/:url - sends the webmention requests

Please note: the current host URL is temporary for the short term.

[Source](https://github.com/remy/wm)

Built by [@rem](https://remysharp.com)
