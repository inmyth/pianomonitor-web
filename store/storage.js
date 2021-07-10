import { Storage } from "aws-amplify";

export const state = () => ({
  // signinUser: sessionStorage.getItem("signinUser")
  // signinUser: null
});

export const mutations = {
  // SET_SIGNIN_USER(state, newValue) {
  //   state.signinUser = newValue;
  // }
};

export const getters = {
  // signinUser(state) {
  //   return state.signinUser;
  // }
};

export const actions = {
  async upload({}, { name, file, callback } = {}) {
    await Storage.put(name, file, {
      level: "private",
      progressCallback(progress) {
        let completed = progress.loaded / progress.total;
        callback(completed);
        console.log(`Uploaded: ${completed}`);
      }
    });
  },

  async list({}, { prefix } = {}) {
    return await Storage.list(prefix, { level: "private" });
  },

  async delete({}, { name } = {}) {
    return await Storage.remove(name, { level: "private" });
  }
  // async verifyCode({ commit, dispatch, getters }, { code } = {}) {
  //   const signinUser = getters.signinUser;
  //   commit("SET_SIGNIN_USER", null); // we have to do this because Auth is side effecting the input user
  //   await Auth.sendCustomChallengeAnswer(signinUser, code);
  //   let success = await dispatch("isAuthenticated");
  //   if (!success) {
  //     commit("SET_SIGNIN_USER", signinUser);
  //     throw "Authentication failed.";
  //   } else {
  //     commit("SET_SIGNIN_USER", null);
  //   }
  // },

  // signOut({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     Auth.signOut()
  //       .then(_ => {
  //         resolve(true);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         reject(this._handleError(error));
  //       });
  //   });
  // }
};
