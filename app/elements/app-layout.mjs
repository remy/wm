export default function AppLayout({ html }) {
  return html`
    <main>
      <header>
        <app-navigation></app-navigation>
      </header>
      <div class="content app-container">
        <slot></slot>
      </div>

      <footer>
        <app-footer></app-footer>
      </footer>
    </main>
  `;
}
