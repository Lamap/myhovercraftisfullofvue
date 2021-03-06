<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="hvr-gallery">
    <div class="hvr-gallery__search">
      <span class="hvr-gallery__search-label">Search</span>
      <span style="display: none">{{filterTagsFromQuery}}</span>
      <vue-tags-input
          class="hvr-gallery__search-tags-input"
          v-model="tag"
          :autocomplete-items="filteredTags"
          :disabled="showOnlyNonTagged"
          :add-only-from-autocomplete="true"
          placeholder="Start typing to search on tags"
          @tags-changed="tagFiltersUpdated"
          :tags="activeFilteringTags"
      />
      <span class="hvr-gallery__non-tagged-filter" v-if="loggedUser">
        <span class="hvr-gallery__non-tagged-filter-sub">or</span>
        show only non-tagged
        <span class="hvr-gallery__non-tagged-filter-checkbox">
          <md-checkbox v-model="showOnlyNonTagged" ></md-checkbox>
        </span>
      </span>
    </div>
    <div class="hvr-gallery__bulk-actions" v-if="selectedItems.length">
      <div class="hvr-gallery__bulk-action-buttons">
        <md-button class="md-icon-button" @click="bulkTogglePublic">
          <md-icon class="hvr-icon-blue" v-if="bulkPublicState === bulkPublicStates.ALL">public</md-icon>
          <md-icon v-if="bulkPublicState === bulkPublicStates.MIXED">public</md-icon>
          <md-icon class="hvr-icon-blue" v-if="bulkPublicState === bulkPublicStates.NONE">vpn_lock</md-icon>
        </md-button>
        <md-button class="md-icon-button">
          <md-icon class="hvr-icon-blue">share</md-icon>
        </md-button>
        <md-button class="md-icon-button">
          <md-icon class="hvr-icon-blue">get_app</md-icon>
        </md-button>
        <md-button class="md-icon-button">
          <md-icon class="hvr-icon-red">delete</md-icon>
        </md-button>
        the
        <span class="hvr-gallery__selection-count">{{selectedItems.length}}</span>
        selected or
        <span class="hvr-gallery__clear-selection" @click="clearSelection">clear selection</span>
      </div>
      <div class="hvr-gallery__bulk-tagging">
        <vue-tags-input
            v-model="bulkTag"
            :tags="bulkAddingTags"
            :autocomplete-items="filteredTagsForBulk"
            @tags-changed="newTags => bulkAddingTags = newTags"
            placeholder="Add tags to the selected images"
            class="hvr-gallery__bulk-tagging-input"
        ></vue-tags-input>
        <md-button @click="addBulkTags" class="hvr-gallery__bulk-tagging-submit">
          Add tags to the <span class="hvr-gallery__bulk-tagging-submit-count">{{selectedItems.length}}</span> images
        </md-button>
      </div>
    </div>
    <MasonryList :items="displayedImageListWithState" class="hvr-gallery__image-list">
      <template v-slot:list-item="slotProps" >
        <ImageCard :imageData="slotProps.item" @selection-changed="onSelectionChanged($event)"></ImageCard>
      </template>
    </MasonryList>
    <div class="hvr-gallery__empty-list" v-if="!filteredList.length && !isBusy">
      <div class="hvr-gallery__empty-list-text">Ups,...found nothing.</div>
      <img alt="Vue logo" src="../assets/minion.svg" class="hvr-gallery__empty-list-image">
    </div>
  </div>
</template>
<script>
import MasonryList from '@/components/masonryList';
import ImageCard from '@/components/ImageCard.vue';
import VueTagsInput from '@johmun/vue-tags-input';
import { mapState } from 'vuex';
import { FILTERING_TAG_QUERY_NAME, TAGLESS_QUERY_NAME } from '../store';

export default {
  components: {
    MasonryList,
    ImageCard,
    VueTagsInput
  },
  created () {
    console.log('gallery-created');
  },
  data () {
    return {
      tag: '',
      bulkTag: '',
      bulkAddingTags: [],
      bulkPublicStates: {
        NONE: 'none',
        ALL: 'all',
        MIXED: 'mixed'
      },
      bulkPublicState: null,
      selectedItemIds: {}
    };
  },
  computed: {
    selectedItems: {
      get () {

        const selection = this.displayedImageListWithState.filter(item => item.isSelected);

        const containsPublic = selection.find(image => image.isPublic);
        const containsPrivate = selection.find(image => !image.isPublic);

        if( containsPublic && containsPrivate) {
          this.bulkPublicState = this.bulkPublicStates.MIXED;
        }

        if ( !containsPrivate ) {
          this.bulkPublicState = this.bulkPublicStates.ALL;
        }

        if ( !containsPublic ) {
          this.bulkPublicState = this.bulkPublicStates.NONE;
        }
        return selection;
      },
      set (value) {
        return value;
      }
    },
    filteredTags () {
      return this.getAutocompleteItems(this.tag);
    },
    filteredTagsForBulk () {
      return this.getAutocompleteItems(this.bulkTag);
    },
    // TODO: put the query property into a constant
    activeFilteringTags () {
      return this.$store.getters.tagObjectsFromFilter;
    },
    displayedImageListWithState () {
      return this.$store.state.displayedImageList.map(image => {
        if (this.selectedItemIds[image.id]) {
          image.isSelected = true;
        }
        return image;
      });
    },
    /// TODO: remove this hack, figure out why does not work the simple watch or how else can we listen to route change?
    filterTagsFromQuery () {
      this.$store.commit('setFiltering');
      return this.$store.state.route.query;
    },
    showOnlyNonTagged: {
      set (value) {
        const query = JSON.parse(JSON.stringify(this.$route.query));
        query[TAGLESS_QUERY_NAME] = Number(value);
        this.$router.push({ query: query });
        window.scrollTo(0, 0);
      },
      get () {
        const value = Boolean(Number(this.$store.state.route.query[TAGLESS_QUERY_NAME]));
        return value;
      }
    },
    ...mapState({
      filteredList: 'filteredImageList',
      fullList: 'fullImageList',
      allTags: 'existingTags',
      loggedUser: 'loggedUser',
      isBusy: 'isBusy'
    })
  },
  methods: {
    onSelectionChanged ($event) {
      this.selectedItemIds[$event.id] = $event.isSelected;
      this.$store.state.displayedImageList = JSON.parse(JSON.stringify(this.$store.state.displayedImageList));
    },
    tagFiltersUpdated (tags) {
      let query = {};
      query[FILTERING_TAG_QUERY_NAME] = tags.map(tag => tag.text);
      this.$router.push({ query: query });
      window.scrollTo(0, 0);
    },
    addBulkTags () {
      if (!this.bulkAddingTags.length) {
        return;
      }
      this.$store.dispatch('addTagsToImages', {images: this.selectedItems, tags: this.bulkAddingTags})
      this.bulkAddingTags = [];
    },
    getAutocompleteItems (input) {
      return this.allTags.filter(tag => tag.text.toLowerCase().indexOf(input.toLowerCase()) !== -1);
    },
    clearSelection () {
      this.selectedItemIds = {};
      this.selectedItems = this.selectedItems.map(image => {
        image.isSelected = false;
        return image;
      });
      this.$store.state.displayedImageList = JSON.parse(JSON.stringify(this.$store.state.displayedImageList));
    },
    bulkTogglePublic () {
      if(this.bulkPublicState !== this.bulkPublicStates.ALL) {
        this.bulkPublicState = this.bulkPublicStates.ALL;
      } else {
        this.bulkPublicState = this.bulkPublicStates.NONE;
      }
      const clonedImages = JSON.parse(JSON.stringify(this.selectedItems)).map(image => {
        image.isPublic = this.bulkPublicState === this.bulkPublicStates.ALL;
        return image;
      });
      this.$store.dispatch('updatePublicStateOnImages', {images: clonedImages});
    }
  }
}
</script>
<style lang="less">
  @import "../global.less";
  @search-height: 60px;
  @header-box-shadow: fade(@black-color, 15%) 0 4px 4px 0;

  .hvr-gallery {
    &__search {
      padding: 1rem @main-horizontal-spacing;
      display: flex;
      position: sticky;
      top: @header-height;
      z-index: @sticky-z-index;
      background: @white-color;
      box-shadow: @header-box-shadow;
    }
    &__search-label {
      align-self: center;
      margin-right: 6px;
      font-size: 20px;
      text-transform: uppercase;
      color: @light-grey-color;
    }
    &__search-tags-input {
      flex-grow: 1;
    }
    &__non-tagged-filter {
      display: flex;
      align-items: center;
      margin-left: 1rem;
    }
    &__non-tagged-filter {
      margin-top: 6px;
      color: @blue-color;
    }
    &__non-tagged-filter-sub {
      margin-top: 8px;
      margin-right: 6px;
      color: @dark-grey-color;
    }
    &__non-tagged-filter-checkbox {
      margin-left: 0.5rem;
    }
    &__bulk-actions {
      position: sticky;
      top: @header-height + @search-height - 4px;
      z-index: @sticky-z-index;
      background: @white-color;
      padding: 0 @main-horizontal-spacing;
      box-shadow: @header-box-shadow;
    }
    &__bulk-action-buttons {
      display: flex;
      align-items: flex-end;
    }
    &__selection-count {
      font-weight: bold;
      margin: 0 0.3rem;
    }
    &__clear-selection {
      margin-left: 0.3rem;
      margin-bottom: 0.5rem;
      color: @blue-color;
      cursor: pointer;
    }
    &__bulk-tagging {
      display: flex;
      position: sticky;
    }
    &__bulk-tagging-input {
      flex-grow: 1;
    }
    &__bulk-tagging-submit {

    }
    &__bulk-tagging-submit-count {
      font-weight: bold;
    }
    &__image-list {
      padding: 0 @main-horizontal-spacing;
    }
    &__empty-list {
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      background-color: @white-color;
      font-size: 30px;
    }
    &__empty-list-image {
      width: 250px;
      margin-top: 30px;
    }
  }
</style>