export default function GettingStarted({ html }) {
  return html`
    <style>
      .highlight {
        border: 1px solid #616161;
        padding: 0 20px;
        border-radius: 2px;
        margin-bottom: 36px;
      }

      .center {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      input:checked + span {
        font-weight: bold;
      }

      label input {
        margin-right: 8px;
      }

      label {
        cursor: pointer;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      [data-name] {
        display: none;
      }

      [selected='feed'] [data-name='feed'],
      [selected='url'] [data-name='url'],
      [selected='cli'] [data-name='cli'],
      [selected='complicated'] [data-name='complicated'],
      [selected='docs'] [data-name='docs'] {
        display: block;
      }
    </style>

    <div>
      <p>Which best describes your site:</p>
      <ul>
        <li>
          <label>
            <input name="type" value="feed" type="radio" />
            <span>I have an RSS feed</span>
          </label>
        </li>
        <li>
          <label>
            <input name="type" value="url" type="radio" />
            <span>I have my latest post on my homepage</span>
          </label>
        </li>
        <li>
          <label>
            <input name="type" value="cli" type="radio" />
            <span>I prefer to run command line tools</span>
          </label>
        </li>
        <li>
          <label>
            <input name="type" value="cli" type="radio" />
            <span>I don't want to rely on 3rd party services</span>
          </label>
        </li>
        <li>
          <label>
            <input name="type" value="complicated" type="radio" />
            <span
              >It's complicated, I can make webmention notifications
              manually</span
            >
          </label>
        </li>
        <li>
          <label>
            <input name="type" value="docs" type="radio" />
            <span>None of this matches me</span>
          </label>
        </li>
      </ul>
    </div>

    <started-docs id="started-docs"></started-docs>

    <script type="module" src="/_public/browser/getting-started.mjs"></script>
  `;
}
