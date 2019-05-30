<template lang="md">
# TODO

- [ ] Support wordpress `hentry` (not "valid" microformat)
- [ ] [web] Auth / token
- [ ] Add backend db (firebase?) to prevent re-sending same mentions
- [ ] Allow self mentions & pings
- [ ] Process: reads local RSS file, compares to live RSS file, delta has web mention send applied
- [ ] Provide `require('@remy/webmention')` support
- [ ] [web] More docs?!
- [ ] [web] Add open-connection/comet style chunks for progress
- [ ] Support JSON Feed (╯°□°)╯︵ ┻━┻

## As of v1.2.0 / 2019-05-30

- [x] Atom
- [x] Better feedback on non-200 requests
- [x] Support XML RPC pingbacks

---

[Please help and contribute with pull requests ❤️](https://github.com/remy/wm)

</template>

<script>
export default {
  head() {
    return { bodyAttrs: { id: "docs" }, title: "todo :: webmention.app" };
  }
};
</script>
