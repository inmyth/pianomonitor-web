<script>
import { required } from "vuelidate/lib/validators";

/**
 * Login component
 */
export default {
  data() {
    return {
      code: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    notificationAutoCloseDuration() {
      return this.$store && this.$store.state.notification ? 5 : 0;
    }
  },
  created() {},
  validations: {
    code: {
      required
    }
  },
  methods: {
    async tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        if (process.env.auth === "cognito") {
          this.tryingToLogIn = true;
          this.authError = null;
          try {
            await this.$store.dispatch("auth/verifyCode", {
              code: this.code
            });
            this.tryingToLogIn = false;
            this.isAuthError = false;
            this.$router.push("/");
          } catch (error) {
            this.tryingToLogIn = false;
            this.authError = error ? error : "";
            this.isAuthError = true;
          }
        }
      }
    }
  },
  layout: "auth"
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6 col-xl-5">
      <div class="card">
        <div class="card-body p-4">
          <div class="text-center w-75 m-auto">
            <div class="auth-logo">
              <nuxt-link to="/" class="logo logo-dark text-center">
                <span class="logo-lg">
                  <img src="~/assets/images/logo-dark.png" alt="" height="22" />
                </span>
              </nuxt-link>

              <nuxt-link to="/" class="logo logo-light text-center">
                <span class="logo-lg">
                  <img src="~/assets/images/logo-light.png" alt="" height="22" />
                </span>
              </nuxt-link>
            </div>
            <p class="mb-4 mt-3">Check the email we sent you and enter the code.</p>
          </div>

          <form action="#" @submit.prevent="tryToLogIn">
            <b-alert :variant="notification.type" class="mt-3" v-if="notification.message" :show="notificationAutoCloseDuration" dismissible>{{ notification.message }}</b-alert>

            <b-alert variant="danger" class="mt-3" v-model="isAuthError" :show="notificationAutoCloseDuration" dismissible>{{ authError }}</b-alert>
            <div class="form-group mb-3">
              <input class="form-control" v-model="code" type="text" id="code" placeholder="Enter the code" :class="{ 'is-invalid': submitted && $v.code.$error }" />
              <div v-if="submitted && $v.code.$error" class="invalid-feedback">
                <span v-if="!$v.code.required">Code is required.</span>
              </div>
            </div>

            <div class="form-group mb-0 text-center">
              <button class="btn btn-primary btn-block" type="submit">Log In</button>
            </div>
          </form>

          <div class="text-center">
            <h5 class="mt-3 text-muted">Sign in with</h5>
            <ul class="social-list list-inline mt-3 mb-0">
              <li class="list-inline-item">
                <a href="javascript: void(0);" class="social-list-item border-purple text-purple"><i class="mdi mdi-facebook"></i></a>
              </li>
              <li class="list-inline-item">
                <a href="javascript: void(0);" class="social-list-item border-danger text-danger"><i class="mdi mdi-google"></i></a>
              </li>
              <li class="list-inline-item">
                <a href="javascript: void(0);" class="social-list-item border-info text-info"><i class="mdi mdi-twitter"></i></a>
              </li>
              <li class="list-inline-item">
                <a href="javascript: void(0);" class="social-list-item border-secondary text-secondary"><i class="mdi mdi-github"></i></a>
              </li>
            </ul>
          </div>
        </div>
        <!-- end card-body -->
      </div>
      <!-- end card -->
      <!-- end row -->
    </div>
    <!-- end col -->
  </div>
  <!-- end row -->
</template>
