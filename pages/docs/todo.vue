<template lang="md">
# TODO

- [ ] Allow self mentions & pings
- [ ] Process: reads local RSS file, compares to live RSS file, delta has web mention send applied
- [ ] Provide `require('@remy/webmention')` support
- [ ] [web] Add open-connection/comet style chunks for progress
- [ ] Support JSON Feed (╯°□°)╯︵ ┻━┻

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
