<template>
  <main>
    <header>
      <Navigation/>
    </header>
    <div class="content">
      <Nuxt/>
    </div>

    <footer>
      <Footer/>
    </footer>
  </main>
</template>

<script>
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
export default {
  components: {
    Navigation,
    Footer
  },
  head: {
    title: "webmention.app",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Platform agnostic outgoing webmention service"
      },
      { name: "twitter:creator", content: "@rem" },
      { name: "twitter:title", content: "webmention.app" },
      { name: "twitter:site", content: "@rem" },
      { name: "twitter:domain", content: "webmention.app" },
      {
        name: "twitter:image:src",
        content: "https://webmention.app/webmention-app-card.jpg"
      },
      { name: "twitter:card", content: "summary_large_image" }
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
  }
};
</script>
