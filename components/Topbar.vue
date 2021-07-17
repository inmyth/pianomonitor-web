<script>
/**
 * Topbar component
 */
export default {
  data() {
    return {
      languages: [
        {
          flag: require("~/assets/images/flags/us.jpg"),
          language: "en",
          title: "English"
        },
        {
          flag: require("~/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French"
        },
        {
          flag: require("~/assets/images/flags/spain.jpg"),
          language: "es",
          title: "Spanish"
        },
        {
          flag: require("~/assets/images/flags/china.png"),
          language: "zh",
          title: "Chinese"
        },
        {
          flag: require("~/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic"
        }
      ],
      current_language: this.$i18n.locale,
      text: null,
      flag: null,
      value: null
    };
  },
  mounted() {
    this.value = this.languages.find(x => x.language === this.$i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;
  },
  methods: {
    /**
     * Toggle menu
     */
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    /**
     * Full screen
     */
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    /**
     * Toggle rightbar
     */
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    /**
     * Set languages
     */
    setLanguage(locale, country, flag) {
      this.$i18n.locale = locale;
      this.current_language = locale;
      this.text = country;
      this.flag = flag;
    },
    /**
     * Horizontal-toggle menu
     */
    horizonalmenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    /**
     * Logout user
     */
    logoutUser() {
      if (process.env.auth === "cognito") {
        this.$store.dispatch("auth/signOut");
      } else if (process.env.auth === "fakebackend") {
        this.$store.dispatch("authfack/logout");
      }
      this.$router.push(this.localePath({ name: "auth-login" }));
    }
  }
};
</script>

<template>
  <!-- Topbar Start -->
  <div class="navbar-custom">
    <div class="container-fluid">
      <ul class="list-unstyled topnav-menu float-right mb-0">
        <b-nav-item-dropdown right class="notification-list topbar-dropdown" menu-class="profile-dropdown" toggle-class="p-0">
          <template slot="button-content" class="nav-link dropdown-toggle">
            <div class="nav-user mr-0">
              <span class="pro-user-name ml-1">
                {{ $t("navbar.dropdown.name.text") }}
                <i class="mdi mdi-chevron-down"></i>
              </span>
            </div>
          </template>

          <b-dropdown-item href="#">
            <i class="remixicon-settings-3-line"></i>
            <span>{{ $t("navbar.dropdown.name.list.settings") }}</span>
          </b-dropdown-item>

          <b-dropdown-divider></b-dropdown-divider>
          <a class="dropdown-item" @click="logoutUser" href="jvascript: void(0);">
            <i class="fe-log-out mr-1"></i>
            <span>{{ $t("navbar.dropdown.name.list.logout") }}</span>
          </a>
        </b-nav-item-dropdown>
      </ul>

      <!-- LOGO -->
      <div class="logo-box">
        <nuxt-link to="/" class="logo logo-dark text-center">
          <span class="logo-sm">
            <img src="~/assets/images/logo-sm-dark.png" alt height="24" />
            <!-- <span class="logo-lg-text-light">Minton</span> -->
          </span>
          <span class="logo-lg">
            <img src="~/assets/images/logo-dark.png" alt height="20" />
            <!-- <span class="logo-lg-text-light">M</span> -->
          </span>
        </nuxt-link>

        <nuxt-link to="/" class="logo logo-light text-center">
          <span class="logo-sm">
            <img src="~/assets/images/logo-sm.png" alt height="24" />
          </span>
          <span class="logo-lg">
            <img src="~/assets/images/logo-light.png" alt height="20" />
          </span>
        </nuxt-link>
      </div>

      <div class="clearfix"></div>
    </div>
  </div>
  <!-- end Topbar -->
</template>
