<template>
  <div>
    <hr class="hr--md" style="margin-top: 0" />
    <transition-group name="list" tag="div">
      <div
        v-for="(valueObject, idx) in collection.value"
        :key="valueObject.id"
        class="multy-collection-wrapper"
      >
        <div
          v-if="collection.value.length > 1"
          @click="remove(idx)"
          class="multy-collection-wrapper__remove btn-delete"
        ></div>

        <files-collection
          :collection="collection"
          :collectIndex="idx"
          :block="block"
        ></files-collection>

        <hr />
      </div>
    </transition-group>

    <hr class="hr--xxxl hr--line" style="margin-top: 0" />

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
import FilesCollection from './FilesCollection.vue';

export default {
  data() {
    return {};
  },
  props: ['block', 'collection'],
  computed: {
    isBtnDisabled() {
      if (
        this.collection.maxcollections &&
        typeof this.collection.maxcollections === 'number'
      ) {
        return this.collection.value.length >= this.collection.maxcollections;
      } else {
        return false;
      }
    },
  },
  methods: {
    add() {
      this.$store.dispatch('setCollectionValue', {
        collection: this.collection,
        collectIndex: this.collection.value.length,
      });
    },
    remove(idx) {
      this.$store.dispatch('removeCollectionValue', {
        collection: this.collection,
        collectIndex: idx,
      });
    },
  },
  beforeMount() {
    this.$store.dispatch('setCollectionValue', {
      collection: this.collection,
      collectIndex: null,
    });
  },
  components: {
    FilesCollection,
  },
};
</script>
