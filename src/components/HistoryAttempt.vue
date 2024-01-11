<template>
  <div class="b-check-detail-fileload__history">
    <div
      class="b-check-detail-fileload__back-icon"
      v-html="backIcon"
      @click.prevent="$emit('toContent')"
    ></div>

    <div class="b-check-detail-fileload__history-heading">
      Попытка {{ attemptIndex }}
    </div>

    <files-collection-info
      v-for="(collection, index) in attempt[0].items"
      :block="attempt[0]"
      :collection="collection"
      :status="status"
      :last="index === attempt[0].items.length - 1"
    ></files-collection-info>

    <hr />

    <div class="b-check-detail-fileload__history-comment">
      <div class="b-check-detail-fileload__history-comment-heading">
        История
      </div>
      <div class="b-check-detail-fileload__history-comment-grid">
        <span v-for="text in comment" v-html="text"></span>
      </div>
    </div>
  </div>
</template>

<script>
import FilesCollectionInfo from './FilesCollectionInfo.vue';

export default {
  data() {
    return {
      backIcon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g transform="translate(-108 -316)">
              <path d="M3,10h8A5,5,0,0,0,11,0H0" transform="translate(112.13 324.31)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M2.56,5.12,0,2.56,2.56,0" transform="translate(111.87 321.69)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
              <path d="M0,0H24V24H0Z" transform="translate(132 340) rotate(180)" fill="none" opacity="0"/>
            </g>
        </svg>`,
    };
  },
  props: ['attempt', 'attemptIndex'],
  emits: ['toContent'],
  computed: {
    status() {
      let statusObject = this.attempt[this.attempt.length - 1];
      if (statusObject && statusObject.type === 'changed_status') {
        return statusObject.status;
      }
    },
    comment() {
      const result = [];
      this.attempt.forEach((item) => {
        if (item.type === 'uploaded_files') {
          result.push(item.date);
          result.push(item.author_name);
          result.push('Добавлены файлы.');
        } else if (item.type === 'changed_status') {
          const statusObject = this.$store.state.statuses.find(
            (s) => s.id === item.status
          );

          result.push(item.date);
          result.push(item.author_name);
          result.push(
            `${
              statusObject
                ? 'Статус изменён на &laquo;' +
                  statusObject.name +
                  '&raquo;<br>'
                : ''
            }${item.status_comment}`
          );
        }
      });

      return result;
    },
  },
  components: {
    FilesCollectionInfo,
  },
};
</script>
