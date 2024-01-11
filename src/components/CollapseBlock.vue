<template>
  <div class="b-collapse-vc" :class="{ slide: slide, open: open }">
    <div class="b-collapse-vc__head" @click.stop.prevent="toggleBody()">
      <a href="" @click.prevent>
        {{ block.name }}
      </a>
      <div class="b-collapse-vc__right">
        <div
          v-if="block.status"
          v-html="status"
          class="b-collapse-vc__status"
        ></div>
        <span class="b-collapse-vc__icon"></span>
      </div>
    </div>
    <transition @enter="enter" @leave="leave" :css="false">
      <div class="b-collapse-vc__body" v-if="slide">
        <div
          :class="{
            'b-check-detail-fileload__block': true,
            'b-check-detail-fileload__block--load': block.load,
          }"
          v-if="state === 'content' || block.load"
        >
          <div v-if="!block.load">
            <div
              class="b-check-detail-fileload__history-icon"
              v-html="historyIcon"
              v-if="status"
              @click.prevent="showHistory"
            ></div>

            <div v-if="block.permissions.moderation">
              <files-collection-info
                v-for="(collection, index) in block.items"
                :key="collection.id"
                :block="block"
                :collection="collection"
                :last="index === block.items.length - 1"
              ></files-collection-info>

              <moderation-form
                :blockId="block.id"
                v-if="block.state === 'moderating'"
              ></moderation-form>
            </div>
            <div v-else-if="block.permissions.write">
              <fileload-form
                v-if="block.state === 'empty'"
                :collections="block.items"
                :block="block"
              ></fileload-form>

              <div
                v-else-if="
                  block.state === 'moderating' || block.state === 'filled'
                "
              >
                <files-collection-info
                  v-for="(collection, index) in block.items"
                  :key="collection.id"
                  :block="block"
                  :collection="collection"
                  :last="index === block.items.length - 1"
                ></files-collection-info>
              </div>
            </div>
            <div v-else-if="block.permissions.read">
              <files-collection-info
                v-for="(collection, index) in block.items"
                :key="collection.id"
                :block="block"
                :collection="collection"
                :last="index === block.items.length - 1"
              ></files-collection-info>
            </div>
          </div>
        </div>

        <div v-else-if="state === 'history'">
          <history-attempt
            v-for="(attempt, index) in history"
            :key="attempt.id"
            :attempt="attempt"
            :attemptIndex="history.length - index"
            @toContent="toContent"
          ></history-attempt>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FilesCollectionInfo from './FilesCollectionInfo.vue';
import HistoryAttempt from './HistoryAttempt.vue';
import FileloadForm from './FileloadForm.vue';
import ModerationForm from './ModerationForm.vue';

export default {
  data() {
    return {
      slide: false,
      open: false,
      state: 'content', //'history', 'loader'
      history: [],
      historyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g transform="translate(-108 -188)">
            <path d="M9.749,0H3.269c-3.76,0-4.05,3.38-2.02,5.22l10.52,9.56C13.8,16.62,13.509,20,9.749,20H3.269c-3.76,0-4.05-3.38-2.02-5.22l10.52-9.56C13.8,3.38,13.509,0,9.749,0Z" transform="translate(113.491 190)" fill="none" stroke="#9b9b9b" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path d="M0,0H24V24H0Z" transform="translate(108 188)" fill="none" opacity="0"/>
          </g>
        </svg>`,
    };
  },
  props: ['block'],
  computed: {
    status() {
      if (!this.block.status || this.block.status === '0') return;

      const status = this.$store.state.statuses.find(
        (s) => String(s.id) === String(this.block.status)
      );
      return `<div class="label-default"><span style="color:${status['text-color']}; background-color:${status['bg-color']}">${status.name}</span></div>`;
    },
  },
  methods: {
    //transition
    enter: function (el, done) {
      if (!window.Velocity) return;
      Velocity(el, 'slideDown', {
        easing: 'ease',
        duration: 500,
      });
    },
    leave: function (el, done) {
      if (!window.Velocity) return;
      Velocity(el, 'slideUp', {
        easing: 'ease',
        duration: 500,
      });
    },
    toggleBody() {
      //set slide class for the main div
      this.slide = !this.slide;
      //slide body
      this.open = !this.open;
    },
    showHistory() {
      //get history
      const pr = this.$store.dispatch('historyBX', {
        blockId: this.block.id,
      });

      pr.then(
        (r) => {
          this.state = 'history';
          if (r && r.status === 'success' && r.data) {
            this.history = this.splitToAttempts(r.data);
          } else {
            this.$store.commit('showError', { error: 'Server error' });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    splitToAttempts(historyArray) {
      const result = [];
      historyArray.reverse().forEach((item) => {
        if (item.type === 'uploaded_files') {
          result.push([item]);
        } else if (item.type === 'changed_status') {
          result[result.length - 1].push(item);
        }
      });

      return result.reverse();
    },
    toContent() {
      this.state = 'content';
    },
  },
  components: {
    FilesCollectionInfo,
    HistoryAttempt,
    FileloadForm,
    ModerationForm,
  },
};
</script>
