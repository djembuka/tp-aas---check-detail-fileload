import { createStore } from 'vuex';

export default createStore({
  state: {
    data: undefined,
  },
  getters: {},
  mutations: {
    showError(state, { error }) {
      state.error = error;
    },
    changeBlockLoad(state, { blockId, load }) {
      const block = state.data.blocks.find(
        (b) => String(b.id) === String(blockId)
      );
      block.load = load;
    },
    setVkkrId(state, { vkkrId }) {
      state.vkkrId = vkkrId;
    },
    setState(state, { data }) {
      state.data = data;
    },
    setStatuses(state, { statuses }) {
      state.statuses = statuses;
    },
    createControlMultyProps(_, { control }) {
      //make filename an array
      const filename = [control.filename];
      control.filename = filename;

      //create value array
      const value = filename.map((val) => {
        return {
          id: parseInt(Math.random() * 100000, 10),
          val,
        };
      });

      control.value = value;
    },
    changeControl(
      _,
      { control, controlIndex, collection, collectIndex, value }
    ) {
      //multiple collection
      if (collection.multiple && collectIndex !== undefined) {
        if (!collection.value || !collection.value[collectIndex]) return;

        if (control.multiple && controlIndex !== undefined) {
          if (!collection.value[collectIndex].files[`id${control.id}`]) {
            //first init
            collection.value[collectIndex].files[`id${control.id}`] = [];

            collection.value[collectIndex].files[`id${control.id}`][
              controlIndex
            ] = {
              id: parseInt(Math.random() * 100000, 10),
              val: value,
            };
          } else {
            //existing file input
            if (
              collection.value[collectIndex].files[`id${control.id}`][
                controlIndex
              ]
            ) {
              collection.value[collectIndex].files[`id${control.id}`][
                controlIndex
              ].val = value;
            } else {
              //add file input
              collection.value[collectIndex].files[
                `id${control.id}`
              ].controlIndex = {
                id: parseInt(Math.random() * 100000, 10),
                val: value,
              };
            }
          }
        } else {
          collection.value[collectIndex].files[`id${control.id}`] = value;
        }
      } else {
        //multy
        if (control.multiple && controlIndex !== undefined) {
          if (!control.value) {
            control.value = [];
          }
          if (!control.value[controlIndex]) {
            control.value.push({
              id: parseInt(Math.random() * 100000, 10),
            });
          }
          control.value[controlIndex].val = value;
          control.filename[controlIndex] = value;
        } else {
          control.value = value;
          control.filename = value;
        }
      }
    },
    removeControl(_, { control, controlIndex, collection, collectIndex }) {
      if (collection.multiple && collectIndex !== undefined) {
        if (!collection.value || !collection.value[collectIndex]) return;

        if (collection.value[collectIndex].files[`id${control.id}`]) {
          collection.value[collectIndex].files[`id${control.id}`].splice(
            controlIndex,
            1
          );
        }
      } else {
        if (control.type === 'file') {
          control.filename.splice(controlIndex, 1);
        }
        control.value.splice(controlIndex, 1);
      }
    },
    //blocks
    setNewBlock(state, { blockId, newBlock }) {
      const index = state.data.blocks.findIndex((b) => b.id === blockId);
      state.data.blocks[index] = newBlock;
    },
    setBlockStatus(state, { blockId, status }) {
      const block = state.data.blocks.find((b) => b.id === blockId);
      block.status = status;
    },
    //collections
    addToMultipleCollection(_, { collection, collectIndex }) {
      if (!collection || !collection.multiple) return;

      if (!collection.value) {
        collection.value = [];
        collectIndex = 0;
      }

      collection.value[collectIndex] = {
        id: parseInt(Math.random() * 100000, 10),
      };

      collection.value[collectIndex].files = {};

      collection.files.forEach((f) => {
        if (f.multiple) {
          collection.value[collectIndex].files[`id${f.id}`] = [
            {
              id: parseInt(Math.random() * 100000, 10),
              val: '',
            },
          ];
        } else {
          collection.value[collectIndex].files[`id${f.id}`] = '';
        }
      });
    },
    removeFromMultipleCollection(_, { collection, collectIndex }) {
      if (!collection || !collection.multiple || !collection.value) return;

      const value = collection.value.slice(0);
      value.splice(collectIndex, 1);
      collection.value = value;
    },
    changeControld(_, { collection, collectIndex }) {
      if (collection.multiple && collectIndex !== undefined) {
        if (!collection.value) {
          collection.value = [];
          collectIndex = 0;
        }
        if (!collection.value[controlIndex]) {
          collection.value.push({
            id: parseInt(Math.random() * 100000, 10),
          });
        }
        control.value[controlIndex].val = value;
        control.filename[controlIndex] = value;
      }
    },
  },
  actions: {
    async loadState({ state, commit }) {
      if (window.BX) {
        window.BX.ajax
          .runComponentAction(`twinpx:vkkr.api`, 'blocks', {
            mode: 'class',
            data: {
              vkkr_id: state.vkkrId,
              sessid: BX.bitrix_sessid(),
            },
            dataType: 'json',
          })
          .then(
            (r) => {
              if (r.status === 'success' && r.data) {
                commit('setState', { data: r.data });
              } else {
                this.$store.commit('showError', { error: 'Server error' });
              }
            },
            (error) => {
              commit('showError', { error });
            }
          );
      }
    },
    async loadStatuses({ commit }) {
      if (window.BX) {
        return window.BX.ajax
          .runComponentAction(`twinpx:vkkr.api`, 'statuses', {
            mode: 'class',
            data: {
              sessid: BX.bitrix_sessid(),
            },
            dataType: 'json',
          })
          .then(
            (r) => {
              if (r.status === 'success' && r.data) {
                commit('setStatuses', { statuses: r.data });
              } else {
                this.$store.commit('showError', { error: 'Server error' });
              }
            },
            (error) => {
              commit('showError', { error });
            }
          );
      }
    },
    async setBlockStatusBX(
      { state, commit },
      { blockId, statusId, statusComment }
    ) {
      commit('changeBlockLoad', { blockId, load: true });
      if (window.BX) {
        return window.BX.ajax.runComponentAction(
          'twinpx:vkkr.api',
          'setBlockStatus',
          {
            mode: 'class',
            data: {
              vkkr_id: state.vkkrId,
              block_id: blockId,
              status: {
                status_id: statusId,
                status_comment: statusComment,
              },
              sessid: BX.bitrix_sessid(),
            },
            dataType: 'json',
          }
        );
      }
    },
    async saveBlockBX(_, { formData }) {
      if (window.BX) {
        return window.BX.ajax
          .runComponentAction(`twinpx:vkkr.api`, 'saveBlock', {
            mode: 'class',
            data: formData,
            dataType: 'json',
          })
          .then(_, (error) => {
            commit('showError', { error });
          });
      }
    },
    async blockBX({ state, commit }, { blockId }) {
      commit('changeBlockLoad', { blockId, load: true });
      if (window.BX) {
        return window.BX.ajax
          .runComponentAction(`twinpx:vkkr.api`, 'block', {
            mode: 'class',
            data: {
              vkkr_id: state.vkkrId,
              block_id: blockId,
            },
            dataType: 'json',
          })
          .then(
            (r) => {
              if (r.status === 'success') {
                commit('changeBlockLoad', { blockId, load: false });
                commit('setNewBlock', { blockId, newBlock: r.data });
              } else {
                this.$store.commit('showError', { error: 'Server error' });
              }
            },
            (error) => {
              commit('showError', { error });
            }
          );
      }
    },
    async historyBX({ state, commit }, { blockId }) {
      if (window.BX) {
        commit('changeBlockLoad', { blockId, load: true });
        return window.BX.ajax
          .runComponentAction(`twinpx:vkkr.api`, 'history', {
            mode: 'class',
            data: {
              vkkr_id: state.vkkrId,
              block_id: blockId,
            },
            dataType: 'json',
          })
          .then(
            (r) => {
              if (r.status === 'success') {
                commit('changeBlockLoad', { blockId, load: false });
              } else {
                commit('showError', { error: 'Server error' });
              }
              return new Promise((res, rej) => {
                res(r);
              });
            },
            (error) => {
              commit('showError', { error });
            }
          );
      }
    },
    setControlValue(
      { commit },
      { control, controlIndex, collection, collectIndex, value }
    ) {
      commit('changeControl', {
        control,
        controlIndex,
        collection,
        collectIndex,
        value,
      });
    },
    setCollectionValue({ commit }, { collection, collectIndex }) {
      commit('addToMultipleCollection', {
        collection,
        collectIndex,
      });
    },
    removeCollectionValue({ commit }, { collection, collectIndex }) {
      commit('removeFromMultipleCollection', {
        collection,
        collectIndex,
      });
    },
  },
  modules: {},
});
