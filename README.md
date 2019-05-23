This is a micro service that will check a given URL for links to other sites,
discover if those links support webmentions and will send a webmention POST
to the target.

The API is simplistic for now:

- https://wm.isthe.link/check/:url - performs a dry run, showing what will be sent
- https://wm.isthe.link/check/:url&doSend=1 - sends the webmention requests

[Source](https://github.com/remy/wm)

Built by [@rem](https://remysharp.com)
