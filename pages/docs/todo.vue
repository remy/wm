<template lang="md">
# TODO

- [ ] Support XML RPC?
- [ ] Add backend db (firebase?) to prevent re-sending same mentions
- [ ] Atom?
- [ ] Process: reads local RSS file, compares to live RSS file, delta has web mention send applied
- [ ] Provide `require('@remy/webmention')` support
- [ ] More docs?!

[Please help and contribute with pull requests ❤️](https://github.com/remy/wm)

</template>

<script>
export default {
  head() {
    return { bodyAttrs: { id: "docs" }, title: "todo :: webmention.app" };
  }
};
</script>
