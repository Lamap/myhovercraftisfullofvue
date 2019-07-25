<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="hvr-gallery">
    <md-autocomplete v-model="selectedTags" :md-options="existingTags" />
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
import MasonryList from '@/components/masonryList'
import ImageCard from '@/components/ImageCard.vue'
export default {
  components: {
    MasonryList,
    ImageCard
  },
  created () {
    console.log('gallery-created');
  },
  data () {
    return {
      items: [
        {
          name: 'jenő',
          id: 10,
          src: 'https://firebasestorage.googleapis.com/v0/b/myhovecraft.appspot.com/o/hvr%2Fspg-1558102404135?alt=media&token=b6f0f567-e5dc-466e-9d33-6149da491f77',
          isSelected: true
        },
        {
          name: 'béla',
          id: 20,
          src: 'https://www.fillmurray.com/200/200',
          isSelected: true
        },
        {
          name: 'hurka',
          id: 30,
          src: 'https://www.fillmurray.com/300/400',
          isSelected: true
        },
        {
          name: 'gyurka',
          id: 40,
          src: 'https://www.fillmurray.com/300/500',
          isSelected: true
        }
      ],
      existingTags: [
        'aha',
          'jojo',
          'nana',
          'nene'
      ],
      selectedTags: null
    };
  },
  computed: {
    selectedItems () {
      const selection = this.items.filter(item => item.isSelected);
      console.log('selection changed', selection);
      return selection;
    }
  }
}
</script>