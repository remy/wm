<template>
  <div>
    <h1>Your token</h1>
    <p>Including a token in your requests allows you to avoid rate limits on sources.</p>

    <div v-if="token">
      <p class="token">
        {{ token }}
        <button v-on:click="copyToken">
          <img src="/copy.svg" width="16"> copy
        </button>
      </p>
      <p>This token doesn't provide any write access, and is only used to identify you as a real person wanting to use this service.</p>
      <h2>Usage</h2>
      <p>Include your token as a URL parameter in your calls to the check API:</p>
      <pre><code>curl -X POST https://webmention.app?token=<span>{{ token }}</span>&amp;url=…</code></pre>
      <p>
        Remember, if you use the
        <abbr title="command line interface">CLI</abbr> tool you don't need a token as it runs entirely on your own machine.
      </p>
    </div>
    <div v-else>
      <p>
        <a href="/auth">Sign in using Github</a>
        - the sign in process asks for no private data (nor email) and is used to assign you a unique token that will allow you to make as many request as you need against this service.
      </p>
    </div>
  </div>
</template>

<style scoped>
.token {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 4px 8px;
}

.token button {
  opacity: 0.3;
  border: 0;
  background: 0;
  padding: 0;
  margin-left: 10px;
  cursor: pointer;
  transition: opacity 100ms ease-out;
}

button img {
  vertical-align: middle;
}

button:hover {
  opacity: 1;
}
</style>


<script>
export default {
  data() {
    return {
      token: this.$cookies.get("token")
    };
  },
  methods: {
    async copyToken() {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(this.token);
      } else {
        const input = document.createElement("input");
        input.value = this.token;
        input.style.opacity = "0";
        input.style.position = "fixed";
        document.body.appendChild(input);
        input.focus();
        input.select();

        try {
          var successful = document.execCommand("copy");
          console.log("worked");
        } catch (err) {
          console.log(err);
        }

        // document.body.removeChild(input);
      }
    }
  }
};
</script>
