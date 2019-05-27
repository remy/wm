/* eslint-env browser */
/* global Vue */
var app = new Vue({
  el: '#app',
  data: {
    mentions: [],
    url: '',
    loading: false,
    hasResult: false,
  },
  methods: {
    async findMentions(event) {
      event.preventDefault();
      this.loading = true;
      const res = await fetch('/check/' + this.url);
      const json = await res.json();
      this.mentions = json;
      this.loading = false;
      this.hasResult = true;
    },
  },
});
