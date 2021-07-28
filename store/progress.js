const step = 4;
export const state = () => ({
  value: 0,
  visible: false,
  id: null
});

export const mutations = {
  start(state, id) {
    state.value = 0;
    state.id = id;
    state.visible = true;
  },
  set(state, value) {
    state.value = value;
  },
  clear(state) {
    state.value = 0;
    state.visible = false;
  }
};

export const actions = {
  fire({ commit, state, dispatch }) {
    const id = setInterval(() => {
      let v = state.value;
      if (v >= 100) {
        dispatch("clear");
      } else {
        commit("set", v + step);
      }
    }, 100);
    commit("start", id);
  },

  success({ commit }) {
    commit("set", 100);
  },

  clear({ commit, state }) {
    const id = state.id;
    clearInterval(id);
    commit("clear");
  }
};
