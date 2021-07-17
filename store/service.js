import axios from "axios";

export const state = () => ({});

export const mutations = {};

// const endpoint = this.$config.gatewayEndpoint;

export const actions = {
  async getDevices({ commit, dispatch }, {} = {}) {
    try {
      const res = await axios({
        method: "GET",
        url: `${this.$config.gatewayEndpoint}/device/list`,
        headers: { Authorization: await getAuthHeader(dispatch) }
      });
      return buildMessage(res, null);
    } catch (error) {
      return buildMessage(null, error);
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

function buildMessage(data, error) {
  if (error) {
    return {
      error: error,
      data: null
    };
  } else {
    return {
      error: null,
      data: data
    };
  }
}
