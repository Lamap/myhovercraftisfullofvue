<template>
  <div class="hvr-header">
    myhovercraftisfullof
    <span class="hvr-header__count">{{displayedCount}}/</span>
    <span class="hvr-header__count">{{totalCount}}</span>
    eels

    <file-selector @filesSelected="onFilesSelected"/>
  </div>
</template>
<script>
import FileSelector from '@/components/FileSelector';
import { mapState, mapGetters } from 'vuex';

export default {
  created () {
    console.log('header created');
  },
  components: {
    FileSelector
  },
  computed: {
    ...mapState({
     displayedCount: 'displayedImageCount'
    }),
    ...mapGetters(['totalCount'])
  },
  methods: {
    onFilesSelected (files) {
      console.log('files', files);
      this.$store.dispatch('addImages', files);
    }
  }
}
</script>
<style lang="less">
  .hvr-header {
    color: #999;
    font-weight: lighter;
    font-size: 23px;
    text-transform: uppercase;
    &__count {
      color: #333;
    }
  }
</style>