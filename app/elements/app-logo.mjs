export default function Logo({ html, state }) {
  const { attrs } = state;
  const { width } = attrs;

  let hover = false;

  return html`<svg
      width="${width}"
      height="${width}"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      onmouseover="hover = true"
      onmouseleave="hover = false"
    >
      <defs>
        <linearGradient id="grd" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff2400"></stop>
          <stop offset="11%" stop-color="#e81d1d"></stop>
          <stop offset="22%" stop-color="#e8b71d"></stop>
          <stop offset="33%" stop-color="#e3e81d"></stop>
          <stop offset="44%" stop-color="#1de840"></stop>
          <stop offset="55%" stop-color="#2b1de8"></stop>
          <stop offset="66%" stop-color="#ff2400"></stop>
          <stop offset="77%" stop-color="#dd00f3"></stop>
          <stop offset="88%" stop-color="#e8b71d"></stop>
          <stop offset="100%" stop-color="#dd00f3"></stop>
        </linearGradient>
        <mask id="msk">
          <circle fill="white" cx="96" cy="96" r="96"></circle>
        </mask>
      </defs>
      <g fill="none" style="mask: url(#msk)" fill-rule="evenodd">
        <rect
          width="2000"
          height="1000"
          fill="${hover ? 'url(#grd)' : '#03A9F4'}"
          cx="96"
          cy="96"
          r="96"
        >
          <animateTransform
            attributeType="XML"
            attributeName="transform"
            type="translate"
            values="0,0; -1808,0; 0,0;"
            dur="20s"
            repeatCount="indefinite"
          ></animateTransform>
        </rect>
        <path
          fill="#FFF"
          id="logo-path"
          d="M111.066 148.31l-15.47-47.3h-.257l-15.212 47.3H59.804L35.644 56.98h20.069l14.444 62.166h.255l15.853-47.3h18.792l15.594 48.065h.257l11.145-48.034-14.518-.031 30.094-27.972 18.673 28.008-14.788-.01-20.51 76.437z"
        ></path>
      </g>
    </svg>

    <script type="X_module">
      class AppLogo extends HTMLElement {
        constructor() {
          super();
          this.heading = this.querySelector('h1');
        }

        static get observedAttributes() {
          return ['message'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
          if (oldValue !== newValue) {
            if (name === 'message') {
              this.heading.textContent = newValue;
            }
          }
        }
      }

      customElements.define('my-message', MyMessage);
    </script>`;
}

{
  /* <script>
export default {
  data() {
    return {
      hover: false
    };
  },
  props: ["width"]
};
</script> */
}
