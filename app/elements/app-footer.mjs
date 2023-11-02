export default function AppFooter({ html }) {
  return html`
    <ul>
      <li>
        Built by
        <a href="https://remysharp.com">@rem</a>
      </li>
      <li>
        <a href="/about">About</a>
      </li>
      <!-- <li>
      <a to="/status">
        Status
      </a>
    </li> -->
      <li>
        <a href="https://github.com/remy/wm">
          Version:
          <span>${'1.5.0'}</span>
        </a>
      </li>
    </ul>

    <style>
      * {
        color: #616161;
      }
    </style>
  `;
}
