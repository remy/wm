<template>
  <nav id="navigation">
    <ul>
      <li class="logo">
        <n-link to="/">
          <Logo width="36px"/>
        </n-link>
      </li>
      <li>
        <n-link to="/token">Get token</n-link>
      </li>
      <li>
        <n-link to="/test">Test a URL</n-link>
      </li>
      <li>
        <n-link to="/docs">Docs</n-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import Logo from "./Logo.vue";
export default {
  components: { Logo }
};
</script>
