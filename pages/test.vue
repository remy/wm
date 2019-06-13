<template>
  <div>
    <h1>Test and send webmentions</h1>
    <p>Keep in mind that this test page only scans the 10 most recent <code>h-entry</code> elements on the target.</p>
    <Check/>
  </div>
</template>

<script>
import Check from "../components/Check";
export default {
  components: { Check }
};
</script>

<style>
</style>
