export default {
  loading: "~/components/Loading.vue",
  // router: {
  //   extendRoutes(routes) {
  //     routes.push({
  //       path: "/",
  //       component: "~/pages/dashboard/sales/index.vue"
  //     });
  //   }
  // },
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: false,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Global CSS
   */
  css: ["~/assets/scss/app.scss", "quill/dist/quill.core.css", "quill/dist/quill.snow.css", "quill/dist/quill.bubble.css"],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    "~/plugins/amplify.js",
    "~/plugins/simplebar.js",
    "~/plugins/vue-click-outside.js",
    "~/plugins/vuelidate.js",
    "~/plugins/draggable.js",
    "~/plugins/vue-slidebar.js",
    // "~/plugins/tour.js",
    "~/plugins/vue-lightbox.js",
    "~/plugins/mask.js",
    "~/plugins/quill-editor.js",
    "~/plugins/chartist.js",
    "~/plugins/vue-googlemap.js",
    "~/plugins/string-filter",
    "~/plugins/vue-content-placeholder"
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    "bootstrap-vue/nuxt",
    "nuxt-i18n"
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    vueI18n: {
      fallbackLocale: "en",
      messages: {
        en: require("./locales/en.json")
      }
    }
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  publicRuntimeConfig: {
    gatewayEndpoint: process.env.VUE_APP_API_GATEWAY_ENDPOINT,
    iotEndpont: process.env.VUE_APP_IOT_ENDPOINT,
    auth: process.env.VUE_APP_DEFAULT_AUTH
  }
  // privateRuntimeConfig: {
  //   apiSecret: process.env.API_SECRET
  // }
  // env: {
  //   auth: process.env.VUE_APP_DEFAULT_AUTH,
  //   apikey: process.env.VUE_APP_APIKEY,
  //   authdomain: process.env.VUE_APP_AUTHDOMAIN,
  //   databaseurl: process.env.VUE_APP_DATABASEURL,
  //   projectid: process.env.VUE_APP_PROJECTId,
  //   storgebucket: process.env.VUE_APP_STORAGEBUCKET,
  //   message: process.env.VUE_APP_MESSAGINGSENDERID,
  //   appid: process.env.VUE_APP_APPId,
  //   measurement: process.env.VUE_APP_MEASUREMENTID,
  //   gatewayEndpoint: process.env.VUE_APP_API_GATEWAY_ENDPOINT
  // }
};
