<template>
  <div class="root">
    <div>
      <p>Which best describes your site:</p>
      <ul v-on:change.capture="handleChange">
        <li><label><input name="type" value="feed" type="radio"><span>I have an RSS feed</span></label></li>
        <li><label><input name="type" value="url" type="radio"><span>I have my latest post on my homepage</span></label></li>
        <li><label><input name="type" value="cli" type="radio"><span>I prefer to run command line tools</span></label></li>
        <li><label><input name="type" value="cli" type="radio"><span>I don't want to rely on 3rd party services</span></label></li>
        <li><label><input name="type" value="complicated" type="radio"><span>It's complicated, I can visit a website manually</span></label></li>
        <li><label><input name="type" value="docs" type="radio"><span>None of this matches me</span></label></li>
      </ul>
    </div>

    <div v-show="selected" class="highlight">
      <div v-if="selected === 'feed'">
        <p>Your ideal approach is to use IFTTT to run a recipe when a new item is published to your feed and to trigger a webhook call to webmention.app.</p>
        <p><n-link to="/docs#using-ifttt-to-trigger-checks">Read the full walk through can be seen here.</n-link></p>
      </div>

      <div v-if="selected === 'url'">
        <p>There's two options here:</p>
        <p>You can <n-link to="/docs#send-webmentions-using-the-web-service">call this web site's webhook</n-link> when your site is updated pointing to the URL of your homepage.</p>
        <p>Alternatively you can use <n-link to="/docs#scheduling-repeating-checks">IFTTT to run a repeating and scheduled recipe</n-link> to check your homepage for new content.</p>
      </div>

      <div v-if="selected === 'cli'">
        <p>Your ideal approach is to use the <code>webmention</code> command line tool. It doesn't rely on this web site at all and can be executed on Windows, Mac and Unix-based platforms.</p>
        <p><n-link to="/docs#using-the-command-line">Read how to install and use the command line tool.</n-link></p>
      </div>

      <div v-if="selected === 'complicated'">
        <p>You can visit this site whenever you need and test your new content given any URL and once the "dry-run" has completed, if any webmentions have been found, you'll be able to send those outgoing notifications.</p>
        <p><n-link to="/test">Use the manual test and send tool.</n-link></p>
      </div>

      <div v-if="selected === 'docs'">
        <p>Take a peruse of the documentation and see if there's anything that matches. If not, feel free to <a href="https://github.com/remy/wm/issues/new" target="_blank">open an issue</a> to see if there's something can be solved for you.</p>
        <p><n-link to="/docs">Browse the documentation and recipes.</n-link></p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: null
    }
  },
  methods: {
    handleChange(e) {
      this.selected = e.target.value;
    }
  }
}
</script>


<style scoped>
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

ul {
  list-style: none;
  padding: 0;
}
</style>
