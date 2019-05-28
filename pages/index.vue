<template>
  <div>
    <h1>webmention.app</h1>
    <div class="flex-grow">
      <p>This is a micro service that will check a given URL for links to other sites, discover if those links support webmentions and will send a webmention POST to the target.</p>

      <p>The API is reasonably simplistic:</p>

      <ul>
        <li>
          GET https://webmention.app/check/:url
          <br>
          <span>Perform a dry run, discovering all links and valid Webmention endpoints</span>
        </li>
        <li>
          POST https://webmention.app/check/:url
          <br>
          <span>Sends the full webmention requests</span>
        </li>
      </ul>

      <p>
        📘
        <n-link to="/docs">Documentation &amp; usage</n-link>
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
  }
};
</script>
