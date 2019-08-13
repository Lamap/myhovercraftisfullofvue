<template>
  <div class="hvr-imagecard" :class="{'hvr-imagecard--selected': imageData.isSelected}">
    <div class="hvr-imagecard__bg"></div>
    <img class="hvr-imagecard__image" :src="imageData.src" />
    <div class="hvr-imagecard__tags">tags...</div>
    <div class="hvr-imagecard__actions">
      <md-button class="md-icon-button" @click="togglePublicity">
        <md-icon class="hvr-icon-blue" :class="{'hvr-icon-blue--inactive': !imageData.isPublic}">public</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">share</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">get_app</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">find_replace</md-icon>
      </md-button>
      <span class="hvr-imagecard__delete-button">
        <md-button class="md-icon-button">
          <md-icon class="hvr-icon-red">delete</md-icon>
        </md-button>
      </span>
    </div>
    <vue-tags-input
        class="hvr-imagecard__tags"
        v-model="tagOnTheFly"
        :tags="imageData.tags"
        :autocomplete-items="tagsForAutoComplete"
        placeholder="Pin tag"
        @before-adding-tag="tagIsToAdded"
        @before-deleting-tag="tagIsToDeleted"
    />
    <span class="hvr-imagecard__checkbox">
        <md-checkbox v-model="imageData.isSelected"></md-checkbox>
    </span>
  </div>
</template>
<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { mapState } from 'vuex';

export default {
  components: {
    VueTagsInput
  },
  props: {
    imageData: {
      type: Object
    },
    isSelected: {
      type: Boolean
    }
  },
  data () {
    return {
      bela: true,
      tagOnTheFly: ''
    }
  },
  created () {
    console.log('imageCard created');
  },
  computed: {
    tagsForAutoComplete () {
      const filtered = this.existingTags.filter(({ text }) => {
        return text.toLowerCase().indexOf(this.tagOnTheFly.toLowerCase()) !== -1
      });
      console.log(filtered);
      return filtered;
    },
    ...mapState(['existingTags'])
  },
  methods: {
    togglePublicity () {
      this.imageData.isPublic = !this.imageData.isPublic;
      console.log('p', this.imageData.isPublic);
    },
    tagIsToAdded (payLoad) {
      console.log('addT-:', payLoad, this.imageData);
      payLoad.addTag(payLoad.tag.text);
      this.$store.dispatch('addTagToImage', {
        imageData: this.imageData,
        tag: payLoad.tag.text
      });
    },
    tagIsToDeleted (payLoad) {
      console.log('to delete', payLoad);
      //TODO: wondering if we want a confirmation for preventing unwanted deletes by backspace
      payLoad.deleteTag(payLoad.index);

      this.$store.dispatch('removeTagFromImage', {
        imageData: this.imageData,
        tag: payLoad.tag
      });
    }
  }
}
</script>
<style lang="less">
  @import "../global.less";
  @card-bg-color: #F7F8EC;
  @card-border-color: #e4e4e4;
  @card-selected-border-color: #888;
  @card-border-radius: 4px;
  @bubble-diameter: 50px;
  @card-horizontal-margins: 20px;

  .hvr-imagecard {
    position: relative;
    padding: 1rem;
    margin: (@card-horizontal-margins + 1px) 1px;
    border: 1px solid @card-border-color;
    border-radius: @card-border-radius;
    &:hover::after {
      width: @bubble-diameter;
      height: @bubble-diameter;
      border-radius: 100%;
      position: absolute;
      top: -10px;
      left: -10px;
      background: @card-bg-color;
      content: '';
    }

    &:hover::before {
      width: @bubble-diameter;
      height: @bubble-diameter;
      border-radius: 100%;
      position: absolute;
      top: -11px;
      left: -11px;
      border: 1px solid @card-border-color;
      box-sizing: content-box;
      content: '';
    }

    &__bg {
      background: @card-bg-color;
      height: 100%;
      width: 100%;
      position: absolute;
      border-radius: @card-border-radius;
      top: 0;
      left: 0;
    }

    &--selected {
      margin: @card-horizontal-margins 0px;
      border: 3px solid @card-selected-border-color;
      box-shadow: rgba(0, 0, 0, 0.2) 8px 8px 8px;

      &:hover::before {
        border-width: 3px;
        border-color: @card-selected-border-color;
        top: -13px;
        left: -13px;
      }
    }

    &__image {
      width: 100%;
      position: relative;
    }

    &__tags {
      color: @blue-color;
    }

    &__actions {
      display: flex;
    }

    &__delete-button {
      margin-left: auto;
    }

    &__checkbox {
      display: none;
      position: absolute;
      z-index: 1;
      top: -12px;
      left: 3px;

      .hvr-imagecard:hover & {
        display: block;
      }
    }
  }
</style>