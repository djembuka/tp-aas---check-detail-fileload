<template>
  <div>
    <h3>{{ heading }}</h3>
    <hr />
    <form enctype="multipart/form-data">
      <div class="row">
        <div class="col-sm-6">
          <div class="form-control-wrapper">
            <!--<v-select
              :searchable="false"
              :options="options"
              class="form-control-select"
              @input="onSelect"
              v-model="selectedOption"
            ></v-select>-->

            <label>{{ select.label }}</label>

            <input
              type="hidden"
              :name="select.name"
              v-model="selectedOption.code"
            />
          </div>

          <hr />

          <div>
            <div class="b-float-label" :class="{ invalid: textarea.invalid }">
              <textarea
                :name="textarea.name"
                autocomplete="off"
                required="required"
                v-model="textareaValue"
                :class="{ active: textareaActive }"
              ></textarea>
              <label>{{ textarea.label }}</label>
            </div>
            <hr />
          </div>

          <div class="b-moderation-form__button">
            <a
              href=""
              class="btn btn-secondary btn-lg"
              :class="{ 'btn--load-circle': isLoading }"
              :disabled="button.disabled"
              @click.prevent="changeStatus"
              >{{ button.text }}</a
            >

            <div class="text-muted">{{ button.message }}</div>
          </div>
        </div>
        <div class="col-sm-6 b-moderation-form__text">
          <p>
            Перед вами последняя версия документа. Пожалуйста, тщательно
            оцените, соответствует ли она критериям для дальнейшей работы. Если
            документ не подходит, укажите причины отклонения как можно более
            подробно. Это поможет автору исправить ошибки и предоставить
            обновленную версию, соответствующую всем требованиям.
          </p>
          <p>
            Обратите внимание: после установки статуса документа изменить его
            будет невозможно. Убедитесь в обоснованности вашего решения перед
            его принятием.
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ModerationForm from './ModerationForm.vue';

export default {
  data() {
    return {
      heading: 'Изменение статуса документа',
      required: true,
      isLoading: false,
      select: {
        label: 'Статус документа',
        name: 'MODERATION_STATUS',
      },
      selectedOption: { label: '', code: '' },
      textarea: {
        label: 'Комментарий для сотрудников СРО ААС',
        name: 'MODERATION_COMMENT',
      },
      textareaValue: '',
      button: {
        text: 'Сохранить',
        message: 'Для отправки необходимо заполнить все поля.',
        disabled: false, //this.!textareaValue
      },
    };
  },
  props: ['blockId'],
  computed: {
    textareaActive() {
      return !!this.textareaValue;
    },
    options() {
      const statuses = this.$store.state.statuses;
      if (!statuses) return;

      return statuses.map((s) => {
        return {
          label: s.name,
          code: s.id,
        };
      });
    },
  },
  methods: {
    onSelect(selected) {
      this.select.selectedOption = selected;
    },
    changeStatus() {
      const pr = this.$store.dispatch('setBlockStatusBX', {
        blockId: this.blockId,
        statusId: this.selectedOption.code,
        statusComment: this.textareaValue,
      });

      pr.then(
        (r) => {
          this.$store.commit('changeBlockLoad', {
            blockId: this.blockId,
            load: false,
          });
          if (r.status === 'success') {
            return this.$store.dispatch('blockBX', {
              blockId: this.blockId,
            });
          } else {
            this.$store.commit('showError', { error: 'Server error' });
          }
        },
        (error) => {
          this.$store.commit('changeBlockLoad', {
            blockId: this.blockId,
            load: false,
          });
          console.log(error);
        }
      );
    },
  },
  beforeMount() {
    this.selectedOption = this.options[0];
  },
  components: {
    ModerationForm,
  },
};
</script>
