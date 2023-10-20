<template>
  <div>
    <h1>Latest stats</h1>
    <p><strong>Webmentions sent: {{ checks.sent }}.</strong><br>Total unique scanned: {{ checks.total }}</p>
    <ol>
      <li
        v-bind:key="check.url"
        v-for="check in checks.data"
      ><a target="_blank" v-bind:href="check.url">{{ check.url | host }}</a> @ {{ check.requested | ms }} ago ({{ check.hits }} requests)</li>
    </ol>
  </div>
</template>

<script>
import ms from "ms";
const now = Date.now();
const API = process.env.API;
export default {
  filters: {
    ms: function(value) {
      return ms(now - new Date(value).getTime());
    },
    host: function(value) {
      try {
        const url = new URL(value);
        return url.hostname + (url.pathname === '/' ? '' : url.pathname);
      } catch (e) {
        return value.replace(/^http.?:\/\/(.*?)\/?/, "$1");
      }
    }
  },
  data() {
    return {
      checks: {
        total: 0,
        sent: 0,
      }
    }
  },
  async mounted() {
    const res = await fetch(API + "/stats", { method: "post" });
    this.checks = await res.json();
  },
};
</script>
