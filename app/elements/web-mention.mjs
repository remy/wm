export default function WebMention({ html, state }) {
  const { attrs = {} } = state;
  const { webmention } = attrs;
  const { source = '', status = null, error = false, target = '' } = webmention;

  let statusClassName = '';

  if (status) {
    statusClassName = [
      'status',
      'status-' + status.toString().slice(0, 1),
    ].join(' ');
  }

  return html`<li>
    <span>source=</span>
    <a href="${source}">${source}</a>
    <br />
    <span>target=</span>
    ${status &&
    `<span>
      <span
        class="${statusClassName}"
        >${status}</span
      >
    </span>`}
    <a href="${target}">${target}</a>
    ${error &&
    `<span>
      <br />
      ${error}
    </span>`}
  </li>`;
}
