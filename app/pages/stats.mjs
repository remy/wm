import ms from 'ms';

export default function Stats({ html, state }) {
  const { store = {} } = state;
  const { data = [], total = 0, sent = 0 } = store;

  const list = data
    .map(({ url, requested, hits }) => {
      return html`<li>
        <a target="_blank" href="${url}">${asHost(url)}</a>
        @ ${toMs(requested)} ago (${hits.toLocaleString()} requests)
      </li>`;
    })
    .join('');

  return html`<app-layout id="stats">
    <div>
      <h1>Latest stats</h1>
      <p>
        <strong>Webmentions sent: ${sent.toLocaleString()}</strong><br />Total
        unique scanned: ${total.toLocaleString()}
      </p>
      <ol>
        ${list}
      </ol>
    </div>
  </app-layout>`;
}

function asHost(value) {
  const url = new URL(value);
  return url.hostname + (url.pathname === '/' ? '' : url.pathname);
}

function toMs(value) {
  return ms(Date.now() - new Date(value).getTime());
}
