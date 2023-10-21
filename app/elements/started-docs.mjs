function feed(html) {
  return html`<div data-name="feed">
    <p>
      Your ideal approach is to use IFTTT to run a recipe when a new item is
      published to your feed and to trigger a call to webmention.app.
    </p>
    <p>
      <a href="/docs#using-ifttt-to-trigger-checks">
        Read the full walk through can be seen here.
      </a>
    </p>
  </div>`;
}

function url(html) {
  return html`<div data-name="url">
    <p>There's two options here:</p>
    <p>
      You can
      <a href="/docs#send-webmentions-using-the-web-service">
        call this web site's webhook
      </a>
      when your site is updated pointing to the URL of your homepage.
    </p>
    <p>
      Alternatively you can use
      <a href="/docs#scheduling-repeating-checks"
        >IFTTT to run a repeating and scheduled recipe</a
      >
      to check your homepage for new content.
    </p>
  </div>`;
}

function cli(html) {
  return html`<div data-name="cli">
    <p>
      Your ideal approach is to use the
      <code>webmention</code> command line tool. It doesn't rely on this web
      site at all and can be executed on Windows, Mac and Unix-based platforms.
    </p>
    <p>
      <a href="/docs#using-the-command-line"
        >Read how to install and use the command line tool.</a
      >
    </p>
  </div>`;
}

function complicated(html) {
  return html`<div data-name="complicated">
    <p>
      You can visit this site whenever you need and test your new content given
      any URL and once the "dry-run" has completed, if any webmentions have been
      found, you'll be able to send those outgoing notifications.
    </p>
    <p>
      <a href="/check">Use the manual test and send tool.</a>
    </p>
  </div>`;
}

function docs(html) {
  return html`<div data-name="docs">
    <p>
      Take a peruse of the documentation and see if there's anything that
      matches. If not, feel free to
      <a href="https://github.com/remy/wm/issues/new" target="_blank"
        >open an issue</a
      >
      to see if there's something can be solved for you.
    </p>
    <p>
      <a href="/docs">Browse the documentation and recipes.</a>
    </p>
  </div>`;
}

const selection = {
  feed,
  docs,
  cli,
  complicated,
  url,
};

export default function GettingStartedDocs({ html, state }) {
  const { attrs = {} } = state;
  const { selected = '' } = attrs;

  const body = selected ? selection[selected](html) : '';
  return html`<div ${!selected && 'hidden'} class="highlight">${body}</div>
    <script type="module" src="/_public/browser/started-docs.mjs"></script>`;
}
