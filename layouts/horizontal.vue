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
        msg: "aaaa",
        bg: "bg-success",
        show: false
      }
    };
  },
  // watch: {
  //   notificationState(s, old) {
  //     console.log("caadasd");
  //     this.alert.msg = s.message;
  //     this.alert.show = 3;
  //     if (s.type == "success") {
  //       this.alert.bg = "bg-success";
  //     } else if (s.type == "error") {
  //       this.alert.bg = "bg-danger";
  //     } else {
  //       this.alert.bg = "bg-primary";
  //     }
  //     // console.log(this.$store.state.drawer)
  //   }
  // },
  computed: {
    notificationState() {
      let s = this.$store.state.notification;
      this.alert.msg = s.message;
      if (s.type === null) {
        this.alert.show = false;
        return s;
      }
      this.alert.show = 3;

      if (s.type == "success") {
        this.alert.bg = "bg-success";
      } else if (s.type == "danger") {
        this.alert.bg = "bg-danger";
      }
      return s;
    },
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
    <Rightbar />
  </div>
</template>

<style></style>
