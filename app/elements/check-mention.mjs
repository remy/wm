export default function CheckMention({ html, state }) {
  const { store = {} } = state;
  const { urls = [], url = '', sent = false } = store;
  const hasResult = urls.length > 0;

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
    </form>
    <div id="mention-wrapper">
      ${mentionWrapper({ html, sent, urls, error, url })}
    </div>

    <form ${hasResult || sent ? '' : 'hidden'} method="post" action="/check">
      <input type="hidden" name="url" value="${url}" />
      <button class="btn cta">Send all webmentions</button>
    </form> `;
}

export function mentionWrapper({ html, sent, urls, error, url }) {
  const webMentions = urls
    .map(
      ({ source, target, status, error }) =>
        html`<web-mention
          status="${status || ''}"
          error="${error ? 'Failed to send' : ''}"
          source="${source}"
          target="${target}"
        ></web-mention>`
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

  const foundCount =
    url && !sent
      ? html`<p>
          <strong>
            ${urls.length === 0 ? 'No' : urls.length} webmention supported links
            found.
          </strong>
        </p>`
      : '';

  // Note: this form is part of the partial because _only_ this part of the
  // component gets updated, so the `hasResult` and `sent` are changed
  return html`${sentNotifications} ${foundCount} ${errorMessage}
  ${`<ol id="mentions">${webMentions}</ol>`}`;
}
