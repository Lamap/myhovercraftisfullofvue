<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="hvr-gallery">
    <div class="hvr-gallery__search">
      <vue-tags-input
          class="hvr-gallery__search-input"
          v-model="tag"
          :autocomplete-items="filteredTags"
          :disabled="showOnlyNonTagged"
          :add-only-from-autocomplete="true"
          placeholder="Add search tag"
          @tags-changed="tagFiltersUpdated"
          :tags="activeFilteringTags"
      />
      <span class="hvr-gallery__non-tagged-filter">
        only non-tagged
        <span class="hvr-gallery__non-tagged-filter-checkbox">
          <md-checkbox v-model="showOnlyNonTagged" @change="showOnlyTaglessChanged"></md-checkbox>
        </span>
      </span>
    </div>
    <div class="hvr-gallery__bulk-actions" v-if="selectedItems.length">
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">public</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">share</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon class="hvr-icon-blue">get_app</md-icon>
      </md-button>
      <span class="hvr-imagecard__delete-button">
        <md-button class="md-icon-button">
          <md-icon class="hvr-icon-red">delete</md-icon>
        </md-button>
      </span>
      <span class="hvr-gallery__selection-count">{{selectedItems.length}}</span>
      selected
      <span class="hvr-gallery__clear-selection">or clear selection</span>
      <div class="hvr-gallery__bulk-tagging">
        <vue-tags-input
            v-model="bulkTag"
            :tags="bulkAddingTags"
            :autocomplete-items="filteredTagsForBulk"
            @tags-changed="newTags => bulkAddingTags = newTags"
            placeholder="Add tags to the selected images"
        ></vue-tags-input>
        <md-button @click="addBulkTags">
          Add tags to the {{selectedItems.length}} images
        </md-button>
      </div>
    </div>
    <MasonryList :items="partialImageList">
      <template v-slot:list-item="slotProps">
        <ImageCard :imageData="slotProps.item"></ImageCard>
      </template>
    </MasonryList>
  </div>
</template>
<script>
import MasonryList from '@/components/masonryList';
import ImageCard from '@/components/ImageCard.vue';
import VueTagsInput from '@johmun/vue-tags-input';
import { mapState } from 'vuex';

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
      showOnlyNonTagged: false,
      tag: '',
      bulkTag: '',
      bulkAddingTags: []
    };
  },
  computed: {
    selectedItems () {
      const selection = this.fullList.filter(item => item.isSelected);
      console.log('selection changed', selection);
      return selection;
    },
    filteredTags () {
      return this.getAutocompleteItems(this.tag);
    },
    filteredTagsForBulk () {
      return this.getAutocompleteItems(this.bulkTag);
    },
    ...mapState({
      fullList: 'fullImageList',
      partialImageList: 'partialImageList',
      allTags: 'existingTags',
      activeFilteringTags: 'filteringTags'
    })
  },
  methods: {
    tagFiltersUpdated (tags) {
      console.log(tags);
      this.$store.commit('setFiltering', { tags });
    },
    showOnlyTaglessChanged (value) {
      console.log(value);
      this.$store.commit('setFiltering', {
        tags: this.$store.state.filteringTags,
        onlyNontagged: value
      })
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
    }
  }
}
</script>
<style lang="less">
  .hvr-gallery {
    &__search {
      display: flex;
    }
    &__non-tagged-filter {
      display: flex;
      align-items: center;
      margin-left: 1rem;
    }
    &__non-tagged-filter-checkbox {
      margin-left: 0.5rem;
    }
  }
</style>