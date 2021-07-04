// import { getFirebaseBackend } from '../helpers/firebase/authUtils'

import { Auth } from "aws-amplify";

export const state = () => ({
  currentUser: sessionStorage.getItem("authUser")
});

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue;
    saveState("auth.currentUser", newValue);
  }
};

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser;
  }
};

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  // eslint-disable-next-line no-unused-vars
  init({ state, dispatch }) {
    dispatch("validate");
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    console.log("aaaa");
    if (getters.loggedIn) return dispatch("validate");

    Auth.signIn(email, password).then(user => {
      commit("SET_CURRENT_USER", user);
      return user;
    });

    // return getFirebaseBackend().loginUser(email, password).then((response) => {
    //     const user = response
    //     commit('SET_CURRENT_USER', user)
    //     return user
    // });
  },

  // Logs out the current user.
  logOut({ commit }) {
    // eslint-disable-next-line no-unused-vars
    commit("SET_CURRENT_USER", null);
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-unused-vars
      Auth.signOut()
        .then(_ => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  },

  // register the user
  register({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch("validate");
    Auth.signUp({
      email,
      password,
      attributes: {
        email // optional
        // other custom attributes
      }
    }).then(response => {
      console.log(response);
    });
  },

  // register the user
  // eslint-disable-next-line no-unused-vars
  resetPassword({ commit, dispatch, getters }, { email } = {}) {
    if (getters.loggedIn) return dispatch("validate");

    // return getFirebaseBackend().forgetPassword(email).then((response) => {
    //     const message = response.data
    //     return message
    // });
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  // eslint-disable-next-line no-unused-vars
  async validate({ commit, state }) {
    if (!state.currentUser) return Promise.resolve(null);

    const { user } = await Auth.currentAuthenticatedUser();
    commit("SET_CURRENT_USER", user);
    return user;
  }
};

// ===
// Private helpers
// ===

function saveState(key, state) {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(state));
  }
}
