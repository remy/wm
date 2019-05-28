<template>
  <form @submit="findMentions" method="GET" action="/check">
    <div class="flex-fields">
      <label class="label" for="url">URL:</label>
      <input v-model="url" name="url" type="url" id="url">
      <button
        type="submit"
        class="btn"
        v-bind:disabled="loading"
        v-bind:class="{ loading: loading, btn: true }"
      >Start</button>
    </div>
    <ol v-cloak id="mentions">
      <li v-bind:key="mention.target" v-for="mention in mentions">
        <span>source=</span>
        <a v-bind:href="mention.source">{{ mention.source }}</a>
        <br>
        <span>target=</span>
        <a v-bind:href="mention.target">{{ mention.target }}</a>
      </li>
    </ol>
  </form>
</template>


<script>
export default {
  data: () => ({
    url: "",
    loading: false,
    mentions: []
  }),
  methods: {
    async findMentions(event) {
      event.preventDefault();
      this.loading = true;
      const res = await fetch("/check/" + this.url);
      const json = await res.json();
      this.mentions = json;
      this.loading = false;
    }
  }
};
</script>
