<template lang="md">
# TODO

- [ ] Support proper host encoding, so https://i❤️.ws works
- [ ] Allow self mentions & pings
- [ ] Provide `require('@remy/webmention')` support
- [ ] Support JSON feed (if there's requests for it)
- [ ] Support other sign in methods, such as indieauth

## As of v1.3.1 / 2019-06-13

- [x] If both pingback & webmention found, prioritise webmention
- [x] Support nested `h-entry` (such as nested in `h-feed`s)


## As of 2019-06-04

- [x] [web] More docs?!
- [x] [web] Auth / token
- [x] Add backend db to prevent (potential) abuse

## As of v1.2.0 / 2019-05-30

- [x] Support wordpress `hentry` (not "valid" microformat)
- [x] Atom
- [x] Better feedback on non-200 requests
- [x] Support XML RPC pingbacks

---

[Please help and contribute with pull requests ❤️](https://github.com/remy/wm)

</template>

<style scoped>
h2 {
  margin-top: 36px;
}
</style>


<script>
export default {
  head() {
    return { bodyAttrs: { id: "docs" }, title: "todo :: webmention.app" };
  }
};
</script>
