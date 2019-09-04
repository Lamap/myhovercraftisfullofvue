<template>
  <div>
    <div class="hvr-imagelist" ref="imagelist">
      <div
          v-for="(col, colIndex) in structuredItems"
          :key="colIndex"
          :class="colClass"
          class="hvr-imagelist__col"
      >
        <div v-for="item in col" :key="item.id" @click="imageClicked(item)">
          <slot name="list-item" :item="item"  >
          </slot>
        </div>
      </div>
    </div>
    <div class="csigalofasz">
      <md-dialog :md-active.sync="showImagePopup">
        <md-dialog-content>
          <div class="hvr-image-popup">
            <img v-if="shownImage" :src="shownImage.src" class="hvr-image-popup__image"/>
            <div class="hvr-image-popup__left" @click="stepLeft">
              <md-icon class="md-size-4x">chevron_left</md-icon>
            </div>
            <div class="hvr-image-popup__right" @click="stepRight">
              <md-icon class="md-size-4x">chevron_right</md-icon>
            </div>
          </div>
        </md-dialog-content>
      </md-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'masonryList',
  data () {
    return {
      containerWidth: 0,
      showImagePopup: false,
      shownImage: null
    }
  },
  props: {
    baseColWidth: {
      type: Number,
      default: 300
    },
    items: {
      required: true,
      type: Array
    }
  },
  created () {
    window.addEventListener('resize', () => {
      this.containerWidth = this.$refs.imagelist.clientWidth;
    })
  },
  mounted () {
    this.containerWidth = this.$refs.imagelist.clientWidth;
  },
  computed: {
    colCount () {
      return Math.floor(this.containerWidth / this.baseColWidth);
    },
    colClass () {
      return 'hvr-imagelist__col--split-' + this.colCount;
    },
    structuredItems () {
      const structured = [];

      for (let colIndex = 0; colIndex < this.colCount; colIndex++ ) {
        structured.push([]);
      }
      this.items.forEach((item, index) => {
        const colIndex = index % this.colCount;
        item.flatIndex = index;
        structured[colIndex].push(item);
      });

      return structured;
    }
  },
  methods: {
    bottomReached () {
      this.$emit('imagelist:bottom-reached')
    },
    imageClicked (imageData) {
      this.shownImage = imageData;
      this.showImagePopup = true;
    },
    stepLeft () {
      if (this.shownImage.flatIndex === 0 ) {
        this.shownImage = this.items.find(item => item.flatIndex === this.items.length - 1);
      } else {
        this.shownImage = this.items.find(item => item.flatIndex  === this.shownImage.flatIndex - 1);
      }
    },
    stepRight () {
      if (this.shownImage.flatIndex === this.items.length - 1 ) {
        this.shownImage = this.items.find(item => item.flatIndex === 0);
      } else {
        this.shownImage = this.items.find(item => item.flatIndex === this.shownImage.flatIndex + 1);
      }
    }
  }
}
</script>
<style lang="less">
  @import "../../global.less";
  @horizontal-spacing: 0.5rem;

  .hvr-imagelist {
    display: flex;
    margin: 0 -@horizontal-spacing;
    background-color: @bg-color;
    &__col {
      padding: 0 @horizontal-spacing;
      &--split-1 {
        width: 100%;
      }
      &--split-2 {
        width: 50%;
      }
      &--split-3 {
        width: 33.3%;
      }
      &--split-4 {
        width: 25%;
      }
      &--split-5 {
        width: 20%;
      }
    }
  }

  .hvr-image-popup {
    max-height: 100%;
    user-select: none;

    .paging-arrow {
      width: 50%;
      height: 100%;
      display: flex;
      background: @blue-color;
      position: absolute;
      top: 0;
      opacity: 0;
      &:hover {
        cursor: pointer;
        opacity: 0.3;
      }
    }
    &__left {
      .paging-arrow;
      left: 0;
    }
    &__right {
      .paging-arrow;
      left: 50%;
    }
  }
</style>