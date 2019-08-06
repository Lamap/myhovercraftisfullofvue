<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="hvr-gallery">
    <div class="hvr-gallery__search">
      <vue-tags-input
          class="hvr-gallery__search-input"
          v-model="tag"
          :tags="selectedTags"
          :autocomplete-items="filteredTags"
          :disabled="showOnlyNonTagged"
          placeholder="Add search tag"
          @tags-changed="newTags => selectedTags = newTags"
      />
      <span class="hvr-gallery__non-tagged-filter">
        only non-tagged
        <span class="hvr-gallery__non-tagged-filter-checkbox">
          <md-checkbox v-model="showOnlyNonTagged"></md-checkbox>
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
      with
      <span class="hvr-gallery__selection-count">{{selectedItems.length}}</span>
      selected
      <span class="hvr-gallery__clear-selection">or clear selection</span>
    </div>
    <MasonryList :items="items">
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
import firebase from 'firebase';

export default {
  components: {
    MasonryList,
    ImageCard,
    VueTagsInput
  },
  created () {
    console.log('gallery-created');
    this.db = firebase.firestore();
    this.db.collection('images')
        .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().src}`);
      });
      console.log('\n --------------------');
    });

  },
  data () {
    return {
      showOnlyNonTagged: false,
      tag: '',
      items: [
        {
          name: 'jenő',
          id: 10,
          src: 'https://firebasestorage.googleapis.com/v0/b/myhovecraft.appspot.com/o/hvr%2Fspg-1558102404135?alt=media&token=b6f0f567-e5dc-466e-9d33-6149da491f77',
          isPublic: false
        },
        {
          name: 'béla',
          id: 20,
          src: 'https://www.fillmurray.com/200/200',
          isPublic: true
        },
        {
          name: 'hurka',
          id: 30,
          src: 'https://www.fillmurray.com/300/400',
          isPublic: false
        },
        {
          name: 'gyurka',
          id: 40,
          src: 'https://www.fillmurray.com/300/500',
          isPublic: false
        }
      ],
      existingTags: [
        {
          text: 'abc'
        },
        {
          text: 'abcd'
        },
        {
          text: 'abcde'
        }
      ],
      selectedTags: [
        {
          text: 'abc'
        }
      ]
    };
  },
  computed: {
    selectedItems () {
      const selection = this.items.filter(item => item.isSelected);
      console.log('selection changed', selection);
      return selection;
    },
    filteredTags () {
      return this.existingTags.filter(tag => tag.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1);
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