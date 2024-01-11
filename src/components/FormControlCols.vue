<template>
  <div class="b-form-control-cols">
    <div class="b-form-control-cols__control">
      <form-control-file
        :formControl="formControl"
        :controlIndex="controlIndex"
        :collection="collection"
        :collectIndex="collectIndex"
      ></form-control-file>
    </div>
    <div
      class="b-form-control-cols__desc"
      v-if="formControl.hint"
      v-html="formControl.hint"
    ></div>
  </div>
</template>

<script>
import FormControlFile from './FormControlFile.vue';

export default {
  data() {
    return {};
  },
  props: ['formControl', 'controlIndex', 'collection', 'collectIndex'],
  components: {
    FormControlFile,
  },
};
</script>
