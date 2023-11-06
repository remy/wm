export default function Index({ html, state }) {
  const { store = { total: '?' } } = state;
  const { total } = store;
  return html`<style>
      h2 {
        margin-top: 48px;
      }

      h1 + h2 {
        margin-top: 20px;
      }
    </style>

    <app-layout id="index">
      <div>
        <h1>webmention.app</h1>
        <h2>Automate your outgoing webmentions</h2>
        <h3>
          <strong
            >${total.toLocaleString()} webmentions delivered so far.</strong
          >
        </h3>
        <div class="flex-grow">
          <p>
            This is a platform agnostic service that will check a given URL for
            links to other sites, discover if they support webmentions, then
            send a webmention to the target.
          </p>

          <p>The notification API is reasonably simplistic:</p>

          <ul>
            <li>
              POST https://webmention.app/check/?url=:url
              <p>
                Finds all links in your given URL, discovers those with valid
                Webmention endpoints, and sends the full webmention
                notifications.
              </p>
              <p>
                The URL should be escaped (though the protocol is not required),
                and an
                <a href="/token">optional token</a> can be used to avoid the
                rate limit.
              </p>
            </li>
            <li>
              GET https://webmention.app/check/?url=:url
              <br />
              <span
                >Perform a dry run, reporting on all discovered Webmention
                endpoints</span
              >
            </li>
          </ul>

          <h2>Getting started</h2>

          <getting-started />
        </div>
        <div>
          <hr />
          <h3>Want to just try it out? Check a URL for webmentions</h3>
          <check-mention />
        </div>
      </div>
    </app-layout>`;
}
