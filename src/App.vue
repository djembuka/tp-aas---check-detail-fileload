<template>
  <div :class="{ 'b-check-detail-fileload-loader': !loaded }">
    <div v-if="error" class="b-check-detail-fileload-error" @click="clickError">
      {{ error }}
    </div>

    <div v-if="loaded">
      <div v-for="block in blocks" :data-id="block.id" :key="block.id">
        <collapse-block
          v-if="blockVisible(block)"
          :block="block"
          :key="block.id"
        ></collapse-block>
      </div>
    </div>
    <div v-else>
      <div class="circle-loader">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-5"></div>
      </div>
    </div>
  </div>
</template>

<script>
import CollapseBlock from './components/CollapseBlock.vue';

export default {
  name: 'FileloadApp',
  computed: {
    loaded() {
      return !!this.$store.state.data && !!this.$store.state.statuses;
    },
    error() {
      return !!this.$store.state.error;
    },
    blocks() {
      if (this.loaded) return this.$store.state.data.blocks;
    },
  },
  methods: {
    blockVisible(block) {
      return (
        block.permissions.moderation ||
        block.permissions.write ||
        (block.permissions.read && block.state === 'filled')
      );
    },
    clickError() {
      this.$store.commit('showError', { error: false });
    },
  },
  beforeMount() {
    const vkkrId = document
      .getElementById('checkDetailFileload')
      .getAttribute('data-vkkrid');
    if (!vkkrId) return;

    this.$store.commit('setVkkrId', { vkkrId });
    this.$store.dispatch('loadStatuses');
    this.$store.dispatch('loadState');
  },
  components: {
    CollapseBlock,
  },
};
</script>
