<template>
  <div>
    <form ref="fileload-form" action="" method="" enctype="multipart/form-data">
      <div v-for="collection in collections" :key="collection.id">
        <files-collection-multy
          v-if="collection.multiple"
          :collection="collection"
          :block="block"
        ></files-collection-multy>

        <files-collection
          v-else
          :collection="collection"
          :block="block"
        ></files-collection>

        <hr />
      </div>
    </form>

    <hr />

    <div
      class="btn btn-secondary btn-lg"
      :class="{ disabled: isBtnDisabled }"
      href=""
      @click="submit"
    >
      Отправить
    </div>
  </div>
</template>

<script>
import FilesCollectionMulty from './FilesCollectionMulty.vue';
import FilesCollection from './FilesCollection.vue';

export default {
  data() {
    return {};
  },
  props: ['collections', 'block'],
  computed: {
    isBtnDisabled() {
      let result;
      result = this.collections.every((c) => {
        if (c.multiple) {
          if (c.value) {
            return c.value.every((cObj) => {
              return Object.values(cObj.files).every((v) => {
                if (typeof v === 'object') {
                  return v.every((obj) => !!obj.val);
                } else {
                  return !!v;
                }
              });
            });
          } else {
            return false;
          }
        } else {
          return c.files.every((f) => {
            if (
              f.multiple &&
              typeof f.filename === 'object' &&
              f.filename !== null &&
              f.filename.every((n) => n)
            ) {
              return true;
            } else if (!f.multiple && f.filename) {
              return true;
            } else {
              return false;
            }
          });
        }
      });

      return !result;
    },
  },
  methods: {
    submit() {
      const formData = new FormData(this.$refs['fileload-form']);
      formData.append('vkkr_id', this.$store.state.vkkrId);
      formData.append('block_id', this.block.id);
      formData.append('sessid', window.BX.bitrix_sessid());

      const pr = this.$store.dispatch('saveBlockBX', { formData });
      pr.then(
        (r) => {
          if (r.status === 'success') {
            return this.$store.dispatch('blockBX', {
              blockId: this.block.id,
            });
          } else {
            this.$store.commit('showError', { error: 'Server error' });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  components: {
    FilesCollectionMulty,
    FilesCollection,
  },
};
</script>
