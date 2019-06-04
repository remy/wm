<template>
  <form @submit="findMentions" method="GET" action="/check">
    <div class="flex-fields">
      <label class="label" for="url">URL:</label>
      <input v-model="url" name="url" type="text" id="url">
      <button
        type="submit"
        class="btn"
        v-bind:disabled="loading"
        v-bind:class="{ loading: loading, btn: true }"
      >Start</button>
    </div>
    <div v-cloak>
      <p v-if="hasResult">
        <strong>{{ mentions.length === 0 ? 'No' : mentions.length }} webmention supported links found.</strong>
      </p>
      <p v-if="error">
        <strong>{{error}}</strong>
      </p>

      <ol id="mentions">
        <li v-bind:key="mention.target" v-for="mention in mentions">
          <span>source=</span>
          <a v-bind:href="mention.source">{{ mention.source }}</a>
          <br>
          <span>target=</span>
          <a v-bind:href="mention.target">{{ mention.target }}</a>
        </li>
      </ol>
      <p v-if="hasResult && mentions.length">
        <button :click="sendMentions" class="btn cta">Send all webmentions</button>
      </p>
    </div>
  </form>
</template>


<script>
// TODO handle errors / 429 etc
const API = process.env.API;
export default {
  data: () => ({
    url: "",
    loading: false,
    mentions: [],
    hasResult: false,
    error: null
  }),
  methods: {
    async sendMentions(event) {
      event.preventDefault();
      const res = await fetch(`${API}/check/?url=${escape(this.url)}`, {
        method: "post"
      });
    },
    async findMentions(event) {
      event.preventDefault();
      this.loading = true;
      this.hasResult = false;
      this.mentions = [];
      const res = await fetch(`${API}/check/?url=${escape(this.url)}`);

      if (res.status === 200) {
        const json = await res.json();
        this.mentions = json;
        this.loading = false;
        this.hasResult = true;
      } else {
        this.loading = false;
        if (res.status === 429) {
          const json = await res.json();
          this.error = json.message;
        }
      }
    }
  }
};
</script>
