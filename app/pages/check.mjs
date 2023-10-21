export default function Check({ html }) {
  return html`<app-layout id="test">
      <div>
        <h1>Test and send webmentions</h1>
        <p>
          Keep in mind that this test page only scans the 10 most recent
          <code>h-entry</code> elements on the target.
        </p>
        <check-mention id="url-to-check"></check-mention>
      </div>
    </app-layout>

    <script>
      document.querySelector('#url-to-check').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        window.history.replaceState(
          null,
          null,
          url ? '?url=' + encodeURIComponent(url) : './'
        );
      });
    </script> `;
}
