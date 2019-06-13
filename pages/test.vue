<template>
  <div>
    <h1>Test and send webmentions</h1>
    <p>Keep in mind that this test page only scans the 10 most recent <code>h-entry</code> elements on the target.</p>
    <Check :url="url"/>
  </div>
</template>

<script>
import Check from "../components/Check";
export default {
  data() {
    return {
      url: ''
    }
  },
  components: { Check },
  mounted() {
    if (window.location.search) {
      try {
        const q = new URLSearchParams(window.location.search);
        this.url = q.get("url") || ""
      } catch (e) {}
    }
  }
};
</script>

<style>
</style>
