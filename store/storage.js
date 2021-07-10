import { Storage } from "aws-amplify";

export const state = () => ({});

export const mutations = {};

export const getters = {};

export const actions = {
  async upload({}, { name, file, callback } = {}) {
    await Storage.put(name, file, {
      level: "private",
      progressCallback(progress) {
        let completed = progress.loaded / progress.total;
        callback(completed);
      }
    });
  },

  async list({}, { prefix } = {}) {
    return await Storage.list(prefix, { level: "private" });
  },

  async delete({}, { name } = {}) {
    await Storage.remove(name, { level: "private" });
  }
};
