export default async function({ store, route, redirect }) {
  // Check if auth is required on this route
  // (including nested routes).
  // const authRequired = route.matched.some(route => route.meta.authRequired);

  // // If auth isn't required for the route, just continue.
  // if (!authRequired) return next();

  // If auth is required and the user is logged in...
  // if (store.getters["auth/loggedIn"]) {
  // Validate the local user token...
  // return store.dispatch("auth/isAuthenticated").then(validSession => {
  //   // Then continue if the token still represents a valid user,
  //   // otherwise redirect to login.
  //   validSession ? redirect() : redirectToLogin();
  // });
  // }

  const session = await store.dispatch("auth/getAuthToken");
  if (session != null) {
    redirect();
  } else {
    redirectToLogin();
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  // redirectToLogin();

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-inner-declarations
  function redirectToLogin() {
    // Pass the original route to the login component
    redirect("/auth/login");
  }
  //  else if (process.env.auth === "fakebackend") {
  //   const publicPages = ["/account/login", "/account/register", "/account/forgot-password"];
  //   const authpage = !publicPages.includes(route.path);
  //   const loggeduser = localStorage.getItem("user");

  //   if (authpage && !loggeduser) {
  //     return redirect("/account/login");
  //   }

  //   redirect();
  // }
}
