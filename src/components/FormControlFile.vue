<template>
  <div
    class="b-float-label--file"
    :class="{
      invalid: invalid,
      'slr2-page-settings__control--disabled': disabled,
    }"
  >
    <span
      class="b-float-label-file__clear"
      @click.prevent="clearInputFile"
      v-if="isClearable"
    >
    </span>
    <div
      class="b-float-label--file"
      :class="{
        filled: isFilled,
        clearable: isClearable,
      }"
      ref="controlFile"
    >
      <span class="b-float-label-file__label">{{ labelName }}</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17.383"
        height="24"
        viewBox="0 0 17.383 24"
        v-html="icon"
      ></svg>

      <input
        type="file"
        :name="name"
        :id="id"
        @change="uploadFile($refs.inputFile.files)"
        ref="inputFile"
      />
      <label :for="id" class="active" v-html="label" ref="dropzone"></label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: this.formControl.disabled,
      isFileLoaded: false,
      isActive: true,
      files: [],
      icon: `<g transform="translate(-4.461)">
            <g transform="translate(4.461)">
              <g>
                <path d="M21.844,6.573v15.88A1.547,1.547,0,0,1,20.3,24H6.008a1.546,1.546,0,0,1-1.547-1.547V1.547A1.546,1.546,0,0,1,6.008,0H15.27Z" transform="translate(-4.461)" class="a"/>
              </g>
              <path d="M20.036,8.289l5.677,2.339v-2.2l-3.218-.951Z" transform="translate(-8.33 -1.858)" class="b"/>
              <path d="M25.416,6.573H20.389a1.546,1.546,0,0,1-1.547-1.547V0Z" transform="translate(-8.033)" class="c"/>
            </g>
            <path d="M18.117,19.012l-2.85-2.85a.555.555,0,0,0-.785,0l-2.85,2.85a.555.555,0,0,0,.785.784l1.9-1.9v5.024a.555.555,0,1,0,1.109,0V17.894l1.9,1.9a.555.555,0,0,0,.785-.784Z" transform="translate(-1.741 -3.974)" class="d"/>
          </g>`,

      labelName: this.formControl.name || '',
      required: this.formControl.required || true,
    };
  },
  props: {
    formControl: Object,
    controlIndex: {
      type: [Number, String],
      required: true,
      default() {
        return 0;
      },
    },
    collection: Object,
    collectIndex: {
      type: [Number, String],
      required: true,
      default() {
        return 0;
      },
    },
  },
  computed: {
    id() {
      const cId = this.collection.id,
        cIndex = this.collectIndex !== undefined ? this.collectIndex : '',
        fId = this.formControl.id,
        fIndex = this.controlIndex !== undefined ? this.controlIndex : '';

      return `id_${cId}_${cIndex}_${fId}_${fIndex}`;
    },
    name() {
      const cId = this.collection.id,
        cIndex = this.collectIndex !== undefined ? this.collectIndex : '',
        fId = this.formControl.id,
        fIndex = this.controlIndex !== undefined ? this.controlIndex : '';

      return `${cId}|${cIndex}|${fId}|${fIndex}`;
    },
    invalid() {
      return !!this.invalidString;
    },
    isClearable() {
      return !!this.filename || this.invalid;
    },
    isFilled() {
      return !!this.filename;
    },
    fileid() {
      return this.formControl.value;
    },
    invalidString() {
      if (this.files[0] && this.files[0].size && this.files[0].name) {
        if (this.files[0].size >= this.formControl.maxfilesize) {
          //this.files = [];
          return `Размер файла превышает ${this.formatSize(
            this.formControl.maxfilesize
          )}`;
        }

        const filename = this.files[0].name;
        const lastIndex = filename.lastIndexOf('.');
        const regExp = new RegExp(this.formControl.accept.join('|'));

        if (!regExp.test(filename.substring(lastIndex + 1).toLowerCase())) {
          //this.files = [];
          return `Прикладывайте файлы ${this.formControl.accept
            .map((w) => w.toUpperCase())
            .join(', ')}.`;
        }
      }
      return '';
    },
    label() {
      if (this.invalid) {
        return this.invalidString;
      }
      if (this.files[0] && this.files[0].name) {
        return this.files[0].name;
      }

      let result = '';
      if (this.collection.multiple) {
        result =
          this.collection.value[this.collectIndex].files[
            `id${this.formControl.id}`
          ];
        if (this.formControl.multiple) {
          result = result[this.controlIndex].val;
        }
      } else {
        result = this.formControl.filename;
        if (this.formControl.multiple) {
          result = result[this.controlIndex];
        }
      }
      if (result) return result;

      return this.default;
    },
    filename() {
      let result;

      if (this.collection.multiple) {
        result =
          this.collection.value[this.collectIndex].files[
            `id${this.formControl.id}`
          ];
        if (this.formControl.multiple) {
          result = result[this.controlIndex].val;
        }
      } else {
        result = this.formControl.filename;
        if (this.formControl.multiple) {
          result = result[this.controlIndex];
        }
      }
      return result;
    },
    default() {
      let result = '';
      if (this.formControl.accept && this.formControl.maxfilesize) {
        result = `<a href>Выберите файл</a> (${this.formControl.accept.join(
          ', '
        )}, до ${this.formatSize(this.formControl.maxfilesize)})`;
      } else {
        result = '<a href>Выберите файл</a> или перетащить в поле';
      }
      return result;
    },
  },
  methods: {
    uploadFile(files) {
      this.files = files;

      this.$store.dispatch('setControlValue', {
        control: this.formControl,
        controlIndex: this.controlIndex,
        collection: this.collection,
        collectIndex: this.collectIndex,
        value: this.invalid ? '' : files[0].name,
      });
    },
    clearInputFile() {
      this.files = [];
      this.$refs.inputFile.value = '';
      //set value
      this.$store.dispatch('setControlValue', {
        control: this.formControl,
        controlIndex: this.controlIndex,
        collection: this.collection,
        collectIndex: this.collectIndex,
        value: '',
      });
    },
    cancelEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    getCoords(elem) {
      let box = elem.getBoundingClientRect();

      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
      };
    },
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
  mounted() {
    //drag&drop file
    const dropZone = this.$refs.dropzone;
    const controlFile = this.$refs.controlFile;
    if (!dropZone) {
      return;
    }
    dropZone.addEventListener('drag', this.cancelEvent);
    dropZone.addEventListener('dragstart', this.cancelEvent);
    dropZone.addEventListener('dragend', this.cancelEvent);
    dropZone.addEventListener('dragover', this.cancelEvent);
    dropZone.addEventListener('dragenter', this.cancelEvent);
    dropZone.addEventListener('dragleave', this.cancelEvent);
    dropZone.addEventListener('drop', this.cancelEvent);

    dropZone.addEventListener('dragover', () => {
      controlFile.classList.add('dragover');
    });
    dropZone.addEventListener('dragenter', () => {
      controlFile.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', (e) => {
      let dx = e.pageX - this.getCoords(dropZone).left;
      let dy = e.pageY - this.getCoords(dropZone).top;
      if (
        dx < 0 ||
        dx > dropZone.clientWidth ||
        dy < 0 ||
        dy > dropZone.clientHeight
      ) {
        controlFile.classList.remove('dragover');
      }
    });

    dropZone.addEventListener('drop', (e) => {
      controlFile.classList.remove('dragover');
      controlFile.classList.add('filled');
      this.uploadFile(e.dataTransfer.files);
    });
  },
};
</script>
