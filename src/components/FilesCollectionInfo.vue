<template>
  <div class="b-files-collection-info">
    <div class="b-files-collection__name">{{ collection.name }}</div>
    <div
      class="b-files-collection__description"
      v-html="collection.description"
    ></div>

    <hr />

    <div
      v-if="
        block.state === 'moderating' ||
        block.state === 'filled' ||
        block.type === 'uploaded_files'
      "
    >
      <file-info
        v-for="file in collection.files"
        :key="file.id"
        :block="block"
        :file="file"
        :statusCode="status"
      ></file-info>

      <hr v-if="!last" />
    </div>
    <div v-else-if="block.state === 'empty'">
      <file-info-empty></file-info-empty>

      <hr v-if="!last" />
    </div>
  </div>
</template>

<script>
import FileInfo from './FileInfo.vue';
import FileInfoEmpty from './FileInfoEmpty.vue';

export default {
  data() {
    return {};
  },
  props: ['block', 'collection', 'last', 'status'],
  components: {
    FileInfo,
    FileInfoEmpty,
  },
};
</script>
