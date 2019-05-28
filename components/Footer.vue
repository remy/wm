<template>
  <ul>
    <li>
      Built by
      <a href="https://remysharp.com">@rem</a>
    </li>
    <li>
      <n-link to="/about">About</n-link>
    </li>
    <li>
      <a href="https://github.com/remy/wm">
        Version:
        <span>{{ version}}</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
* {
  color: #616161;
}
</style>


<script>
export default {
  data: () => ({
    version: require("../package.json").version
  })
};
</script>
