<template>
  <div class="b-files-collection">
    <div class="b-files-collection__name">{{ collection.name }}</div>
    <div
      class="b-files-collection__description"
      v-html="collection.description"
    ></div>

    <hr />

    <div v-for="formControl in collection.files" :key="formControl.id">
      <hr />

      <form-control-multy
        v-if="formControl.multiple"
        :formControl="formControl"
        :collection="collection"
        :collectIndex="collectIndex"
      ></form-control-multy>

      <form-control-cols
        v-else
        :formControl="formControl"
        :collection="collection"
        :collectIndex="collectIndex"
      ></form-control-cols>
    </div>
  </div>
</template>

<script>
import FormControlMulty from './FormControlMulty.vue';
import FormControlCols from './FormControlCols.vue';

export default {
  data() {
    return {};
  },
  props: ['block', 'collection', 'collectIndex'],
  components: {
    FormControlMulty,
    FormControlCols,
  },
};
</script>
