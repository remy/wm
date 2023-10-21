export default function AppNavigation({ html }) {
  return html`<nav id="navigation">
    <ul>
      <li class="logo">
        <a href="/">
          <app-logo width="36px" />
        </a>
      </li>
      <li>
        <a href="/token">Get token</a>
      </li>
      <li>
        <a href="/check">Test a URL</a>
      </li>
      <li>
        <a href="/docs">Docs</a>
      </li>
    </ul>
  </nav> `;
}
