export default function CheckMention({ html, state }) {
  const { store = {} } = state;
  const { urls = [], url = '', sent = false } = store;

  const error = false;

  return html`<script
      type="module"
      src="/_public/browser/check-mention.mjs"
    ></script>
    <script type="module" src="/_public/browser/web-mention.mjs"></script>
    <form method="GET" action="/check">
      <div class="flex-fields">
        <label class="label" for="url">URL:</label>
        <input required name="url" type="text" value="${url}" />
        <button id="submit-button" type="submit" class="btn">Start</button>
      </div>
      <div id="mention-wrapper">
        ${mentionWrapper({ html, sent, urls, error, url })}
      </div>
    </form>`;
}

export function mentionWrapper({ html, sent, urls, error, url }) {
  const hasResult = urls.length > 0;
  const webMentions = urls
    .map(
      ({ source, target }) =>
        html`<web-mention source="${source}" target="${target}"></web-mention>`
    )
    .join('');

  const errorMessage = error ? `<p><strong>${error}</strong></p>` : '';
  const sentNotifications = sent
    ? html`<p>
        <strong>
          Sent ${urls.map((_) => _.status < 400).length} webmention
          notifications.
        </strong>
      </p>`
    : '';

  return html`${sentNotifications}
    ${url &&
    html`<p>
      <strong>
        ${urls.length === 0 ? 'No' : urls.length} webmention supported links
        found.
      </strong>
    </p>`}
    ${errorMessage}

    <ol id="mentions">
      ${webMentions}
    </ol>

    <p id="send-mentions" ${!hasResult && 'hidden'}>
      <button class="btn cta">Send all webmentions</button>
    </p>`;
}
