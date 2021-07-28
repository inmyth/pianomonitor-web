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
      dispatch("progress/fire", {}, { root: true });
      const res = await axios({
        method: "GET",
        url: `${this.$config.gatewayEndpoint}/device/list`,
        headers: { Authorization: await getAuthHeader(dispatch) }
      });
      commit("SET_DEVICES", res.data);
      dispatch("progress/success", {}, { root: true });
      return true;
    } catch (error) {
      dispatch("progress/clear", {}, { root: true });
      dispatch("notification/error", `エラーが発生しました：${error}`, { root: true });
      return false;
    }
  },

  async createDevice({ dispatch }, { name } = {}) {
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
  },

  async deleteDevice({ dispatch }, { deviceId }) {
    try {
      await axios({
        method: "DELETE",
        url: `${this.$config.gatewayEndpoint}/device/delete`,
        headers: { Authorization: await getAuthHeader(dispatch) },
        data: {
          deviceId: deviceId
        }
      });
      return true;
    } catch (error) {
      dispatch("notification/error", `エラーが発生しました：${error}`, { root: true });
      return false;
    }
  },

  async getDevice({ dispatch }, { deviceId } = {}) {
    try {
      dispatch("progress/fire", {}, { root: true });
      const res = await axios({
        method: "GET",
        url: `${this.$config.gatewayEndpoint}/device/get?deviceId=${deviceId}`,
        headers: { Authorization: await getAuthHeader(dispatch) }
      });
      dispatch("progress/success", {}, { root: true });
      return res.data;
    } catch (error) {
      dispatch("progress/clear", {}, { root: true });
      dispatch("notification/error", `エラーが発生しました：${error}`, { root: true });
      return null;
    }
  },

  removeDeviceFromState({ commit, state }, { deviceId } = {}) {
    const x = [...state.devices].filter(p => p.deviceId != deviceId);
    commit("SET_DEVICES", x);
  }
};

async function getAuthHeader(dispatch) {
  const session = await dispatch("auth/getAuthToken", null, { root: true });
  return session.idToken.jwtToken;
}
