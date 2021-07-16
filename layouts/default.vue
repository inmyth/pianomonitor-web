<script>
import { mapState } from "vuex";

import Horizontal from "./horizontal";

/**
 * Default Layout
 */
export default {
  components: {
    Horizontal
  },
  data() {
    return {};
  },
  computed: mapState(["layout"]),
  mounted() {
    if (this.$route.query.layout) {
      this.$store.dispatch("layout/changeLayoutType", {
        layoutType: this.$route.query.layout
      });
    }
  }
};
</script>

<template>
  <div>
    <Horizontal v-if="layout.layoutType === 'horizontal'" :layout="layout.layoutType">
      <slot />
    </Horizontal>
  </div>
</template>
