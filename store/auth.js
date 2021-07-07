// import { getFirebaseBackend } from '../helpers/firebase/authUtils'

import { Auth } from "aws-amplify";

export const state = () => ({
  currentUser: sessionStorage.getItem("authUser"),
  signinUser: sessionStorage.getItem("signinUser")
});

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue;
    saveState("auth.currentUser", newValue);
  },
  SET_SIGNIN_USER(state, newValue) {
    state.signinUser = newValue;
    saveState("auth.signinUser", newValue);
  }
};

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.currentUser;
  },
  signinUser(state) {
    return state.signinUser;
  }
};

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  // eslint-disable-next-line no-unused-vars
  init({ state, dispatch }) {
    dispatch("validate");
  },

  // Logs in the current user
  async logIn({ commit, dispatch, getters }, { email } = {}) {
    if (getters.loggedIn) return dispatch("validate");
    try {
      await Auth.signUp({
        username: email,
        password: getRandomString(16),
        attributes: {
          email: email
        },
        validationData: []
      });
    } catch (error) {
      console.log(error);
      if (error.code != "UsernameExistsException") {
        throw error.message;
      }
    }
    let user = await Auth.signIn(email);
    commit("SET_SIGNIN_USER", user);
    return user;
  },

  async verify({ commit, dispatch, getters }, { code } = {}) {
    let verifiedUser = await Auth.sendCustomChallengeAnswer(getters.signinUser, code);
    await Auth.currentSession();
    commit("SET_CURRENT_USER", verifiedUser);
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

function getRandomString(number) {
  const randomValues = new Uint8Array(number);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join("");
}

function intToHex(nr) {
  return nr.toString(16).padStart(2, "0");
}
