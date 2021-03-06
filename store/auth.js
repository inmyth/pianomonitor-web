import { Auth } from "aws-amplify";

export const state = () => ({
  // signinUser: sessionStorage.getItem("signinUser")
  signinUser: null
});

export const mutations = {
  SET_SIGNIN_USER(state, newValue) {
    state.signinUser = newValue;
    // state.signinUser = JSON.parse(JSON.stringify(newValue));
    // saveState("auth.signinUser", newValue);
    // state.signinUser = Object.assign({}, newValue);
  }
};

export const getters = {
  signinUser(state) {
    return state.signinUser;
  }
};

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  // eslint-disable-next-line no-unused-vars
  init({ dispatch }) {
    dispatch("getAuthToken");
  },

  async getAuthToken({}) {
    try {
      return await Auth.currentSession();
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getCurrentCredentials({ commit }) {
    try {
      return await Auth.currentCredentials();
    } catch (error) {
      return null;
    }
  },

  async signIn({ commit, dispatch, getters }, { email } = {}) {
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
      if (error.code != "UsernameExistsException") {
        throw error.message;
      }
    }
    const user = await Auth.signIn(email);
    try {
      commit("SET_SIGNIN_USER", user);
    } catch (error) {
      console.error(error);
    }
  },

  async verifyCode({ commit, dispatch, getters }, { code } = {}) {
    const signinUser = getters.signinUser;
    commit("SET_SIGNIN_USER", null); // we have to do this because Auth is side effecting the input user
    await Auth.sendCustomChallengeAnswer(signinUser, code);
    let success = await dispatch("getAuthToken");
    if (!success) {
      commit("SET_SIGNIN_USER", signinUser);
      throw "Authentication failed.";
    } else {
      commit("SET_SIGNIN_USER", null);
    }
  },

  async signOut() {
    return await Auth.signOut();
  }
};

// function saveState(key, state) {
//   if (process.browser) {
//     localStorage.setItem(key, JSON.stringify(state));
//   }
// }

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
