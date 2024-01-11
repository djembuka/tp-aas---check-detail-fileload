<template>
  <div>
    <div v-if="formControl.type === 'file'">
      <transition-group name="list" tag="div">
        <div
          v-for="(valueObject, idx) in values"
          :key="valueObject.id"
          class="multy-control-wrapper"
        >
          <div
            v-if="btnDeleteVisible"
            @click="remove(idx)"
            class="multy-control-wrapper__remove btn-delete"
          ></div>

          <form-control-cols
            :formControl="formControl"
            :controlIndex="idx"
            :collection="collection"
            :collectIndex="collectIndex"
          ></form-control-cols>

          <hr />
        </div>
      </transition-group>
    </div>
    <button
      class="btn btn-success btn-md"
      :class="{ disabled: isBtnDisabled }"
      @click.prevent="add"
    >
      Добавить еще
    </button>
    <hr class="hr--sl" />
  </div>
</template>

<script>
import FormControlCols from './FormControlCols.vue';

export default {
  data() {
    return {};
  },
  props: ['formControl', 'collection', 'collectIndex'],
  computed: {
    btnDeleteVisible() {
      if (this.collection.multiple) {
        return (
          this.collection.value[this.collectIndex].files[
            `id${this.formControl.id}`
          ].length > 1
        );
      } else {
        return this.formControl.value.length > 1;
      }
    },
    values() {
      if (this.collection.multiple) {
        return this.collection.value[this.collectIndex].files[
          `id${this.formControl.id}`
        ];
      } else {
        return this.formControl.value;
      }
    },
    isBtnDisabled() {
      if (
        this.formControl.maxfiles &&
        typeof this.formControl.maxfiles === 'number'
      ) {
        if (this.collection.multiple) {
          return (
            this.collection.value[this.collectIndex].files[
              `id${this.formControl.id}`
            ].length >= this.formControl.maxfiles
          );
        } else {
          return this.formControl.value.length >= this.formControl.maxfiles;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    validate() {
      if (this.required && !this.controlValue) {
        this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
    },
    add() {
      let controlIndex = this.formControl.value.length;

      if (this.collection && this.collection.multiple) {
        controlIndex =
          this.collection.value[this.collectIndex].files[
            `id${this.formControl.id}`
          ].length;
      }

      this.$store.dispatch('setControlValue', {
        control: this.formControl,
        controlIndex,
        collection: this.collection,
        collectIndex: this.collectIndex,
        value: '',
      });
    },
    remove(idx) {
      this.$store.commit('removeControl', {
        control: this.formControl,
        controlIndex: idx,
        collection: this.collection,
        collectIndex: this.collectIndex,
      });
    },
  },
  beforeMount() {
    this.$store.commit('createControlMultyProps', {
      control: this.formControl,
    });
  },
  components: {
    FormControlCols,
  },
};
</script>
