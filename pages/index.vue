<template>
  <div>
    <h1>webmention.app</h1>
    <h2>Automatically notify others of your webmentions</h2>
    <div class="flex-grow">
      <p>This is a platform agnostic service that will check a given URL for links to other sites, discover if they support webmentions, then send a webmention to the target.</p>

      <p>The API is reasonably simplistic:</p>

      <ul>
        <li>
          POST https://webmention.app/api/check/?url=:url
          <p>Finds all links in your given URL, discovers those with valid Webmention endpoints, and sends the full webmention notifications.</p>
          <p>
            The URL should be escaped (though the protocol is not required), and an
            <n-link to="/token">optional token</n-link>
            {{" "}}can be used to avoid the rate limit.
          </p>
        </li>
        <li>
          GET https://webmention.app/api/check/?url=:url
          <br>
          <span>Perform a dry run, reporting on all discovered Webmention endpoints</span>
        </li>
      </ul>

      <p>
        If you don't want to rely on an online service, you can alternatively use the
        <n-link to="/docs#using-the-command-line">command line tool</n-link>.
      </p>
    </div>
    <div>
      <hr>
      <h3>Check a website or blog post</h3>
      <Check/>
    </div>
  </div>
</template>

<script>
import Check from "../components/Check";
export default {
  components: {
    Check
  },
  head() {
    return { bodyAttrs: { id: "index" } };
  }
};
</script>
