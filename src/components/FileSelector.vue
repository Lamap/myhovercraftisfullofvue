<template>
  <span class="hvr-file-selector">
    <input
        class="hvr-file-selector__file-input"
        type="file"
        multiple
        ref="fileinput"
        @change="filesAdded"
    >
    <md-button class="md-icon-button" @click="browseFiles">
      <md-icon class="hvr-icon-blue">add_circle</md-icon>
    </md-button>
  </span>
</template>
<style lang="less">
  .hvr-file-selector {
    &__file-input {
      display: none;
    }
  }
</style>
<script>
export default {
  mounted () {
    console.log('f input ref', this.$refs.fileinput);
  },
  props: {
    maxFileSizeInBytes: {
      type: Number,
      default: 350000
    }
  },
  methods: {
    browseFiles () {
      this.$refs.fileinput.click()
    },
    filesAdded($event) {
      const errors = [];
      const files = [];
      Array.from($event.target.files).forEach(file => {
        const isInvalid = this.isInvalid(file);
        if (isInvalid) {
          //TODO: more proper error feedback
          errors.push(isInvalid);
          console.warn('Could not add this file', file.name, isInvalid);
        } else {
          files.push(file);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            console.log(event.target);
          };
        }
      });
      if (files.length) {
        this.$emit('filesSelected', files);
      }
    },
    isInvalid(file) {
      if (!file.type.match('image\/.*jpg|image\/.*jpeg|image\/.*png|image\/.*gif')) {
        return 'The supported image formats are: jpg, jpeg, png and gif';
      }
      if (file.size > this.maxFileSizeInBytes) {
        return `The maximum image size is ${this.maxFileSizeInBytes / 1000} kb`;
      }
      return false;
    }
  }
}
</script>