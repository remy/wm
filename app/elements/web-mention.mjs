export default function WebMention({ html, state }) {
  const { attrs = {} } = state;
  const { source = '', status = null, error = false, target = '' } = attrs;

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
    ${(status &&
      html`<span>
        <span class="${statusClassName}">${status}</span>
      </span>`) ||
    ''}
    <a href="${target}">${target}</a>
    ${(error &&
      html`<span>
        <br />
        ${error}
      </span>`) ||
    ''}
  </li>`;
}
