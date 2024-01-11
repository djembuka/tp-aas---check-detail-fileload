<template>
  <div class="b-docs-block__item" :href="file.filelink">
    <div class="b-docs-block__body">
      <a class="b-docs-block__icon" :href="file.filelink" :style="icon"></a>
      <span class="b-docs-block__text">
        <a :href="file.filelink">{{ name }}</a>
        <span class="b-docs-block__data">
          <span class="text-muted">{{ filesize }} .{{ ext }}</span>
          <span class="text-muted">Дата публикации: {{ block.date }}</span>
          <span class="text-muted"
            >Автор:
            <a :href="'/person/' + block.author_id + '/'">{{
              block.author_name
            }}</a></span
          >
        </span>
      </span>
    </div>
    <div v-if="status" v-html="status"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ext: this.file.filename.split('.').reverse()[0],
    };
  },
  props: ['block', 'file', 'statusCode'],
  computed: {
    name() {
      const index = this.file.filename.lastIndexOf('.');
      return this.file.filename.substring(0, index);
    },
    icon() {
      return `background-image: url( '/template/images/${this.ext}.svg' );`;
    },
    status() {
      const status = this.$store.state.statuses.find((s) => {
        return (
          String(s.id) === String(this.statusCode) ||
          (!this.statusCode && String(s.id) === String(this.block.status))
        );
      });
      if (!status) return '';

      return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
    },
    filesize() {
      return this.formatSize(this.file.filesize);
    },
  },
  methods: {
    formatSize(length) {
      var i = 0,
        type = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'];
      while ((length / 1000) | 0 && i < type.length - 1) {
        length /= 1000;
        i++;
      }
      return parseInt(length) + ' ' + type[i];
    },
  },
};
</script>
