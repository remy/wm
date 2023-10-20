<template>
  <div>
    <h1>Test and send webmentions</h1>
    <p>Keep in mind that this test page only scans the 10 most recent <code>h-entry</code> elements on the target.</p>
    <Check v-on:input="handleInput" v-bind:query="url"/>
  </div>
</template>

<script>
import Check from "../components/Check";
export default {
  data() {
    return { url: this.$route.query.url }
  },
  components: { Check },
  methods: {
    handleInput(e) {
      const url = e.target.value.trim();
      window.history.replaceState(null, null, url ? '?url=' + url : './');
    }
  }
};
</script>

<style>
</style>
