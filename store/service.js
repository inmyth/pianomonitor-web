import axios from "axios";

export const state = () => ({
  devices: []
});

export const mutations = {
  SET_DEVICES(state, newValue) {
    state.devices = newValue;
  }
};

export const actions = {
  async refreshDevices({ commit, dispatch }, {} = {}) {
    try {
      const res = await axios({
        method: "GET",
        url: `${this.$config.gatewayEndpoint}/device/list`,
        headers: { Authorization: await getAuthHeader(dispatch) }
      });
      commit("SET_DEVICES", res.data);
      return true;
    } catch (error) {
      dispatch("notification/error", `エラーが発生しました：${error}`, { root: true });
      return false;
    }
  },

  async createDevice({ commit, dispatch }, { name } = {}) {
    try {
      const res = await axios({
        method: "POST",
        url: `${this.$config.gatewayEndpoint}/device/create`,
        headers: { Authorization: await getAuthHeader(dispatch) },
        data: {
          name: name
        }
      });
      return res.data;
    } catch (error) {
      dispatch("notification/error", "デバイスの登録を失敗しますた。", { root: true });
      return null;
    }
  }
};

async function getAuthHeader(dispatch) {
  return await dispatch("auth/getAuthToken", null, { root: true });
}
