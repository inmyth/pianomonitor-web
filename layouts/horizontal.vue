<script>
import { mapState } from "vuex";

/**
 * Horizontal layout
 */
export default {
  name: "horizontal",
  data() {
    return {
      alert: {
        msg: "",
        bg: "bg-success",
        show: false
      }
    };
  },
  watch: {
    "$store.state.notification": {
      handler() {
        let s = this.$store.state.notification;
        this.alert.msg = s.message;
        if (s.type === null) {
          this.alert.show = false;
          return s;
        }

        if (s.type == "success") {
          this.alert.bg = "bg-success";
        } else if (s.type == "danger") {
          this.alert.bg = "bg-danger";
        }
        this.alert.show = 3;

        return s;
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState(["layout"])
  },
  mounted() {
    document.body.setAttribute("data-layout-mode", "horizontal");
  },
  methods: {
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    },
    dismissNotification() {
      this.$store.dispatch("notification/clear");
      this.alert.bg = "bg-primary";
      this.alert.msg = null;
      this.alert.show = false;
    }
  }
};
</script>

<template>
  <!-- Begin page -->
  <div id="wrapper">
    <Topbar />
    <HorizontalNavbar :type="layout.topbar" :width="layout.layoutWidth" :menu="layout.menuPosition" />

    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->
    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <b-alert :show="alert.show" fade dismissible class="text-white border-0" :class="alert.bg" @dismissed="dismissNotification"> {{ alert.msg }}</b-alert>
          <Nuxt />
        </div>
      </div>
      <!-- content -->
      <Footer />
    </div>
    <!-- ============================================================== -->
    <!-- End Page content -->
    <!-- ============================================================== -->
  </div>
</template>

<style></style>
