<template>
  <main>
    <header>
      <Navigation/>
    </header>
    <div class="content">
      <Nuxt/>
    </div>

    <footer>
      <ul>
        <li>
          Built by
          <a href="https://remysharp.com">@rem</a>
        </li>
        <li>
          <n-link to="/about">About</n-link>
        </li>
        <li>
          <a href="https://github.com/remy/wm">Source on Github</a>
        </li>
      </ul>
    </footer>
  </main>
</template>

<script>
import Navigation from "../components/Navigation";
export default {
  components: {
    Navigation
  },
  head: {
    title: "webmention.app",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Home page description"
      }
    ],
    link: [
      {
        rel: "icon",
        sizes: "192x192",
        href: "/favicon.png"
      },
      {
        href: "https://fonts.googleapis.com/css?family=Rubik",
        rel: "stylesheet"
      },
      { href: "/style.css", rel: "stylesheet" }
    ]
    // script: [{ defer: true, async: true, src: "/check.js" }]
  }
};
</script>
