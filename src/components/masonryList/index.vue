<template>
  <div @keyup="onKeyup">
    <div class="hvr-imagelist" ref="imagelist">
      <div
          v-for="(col, colIndex) in structuredItems"
          :key="colIndex"
          :class="colClass"
          class="hvr-imagelist__col"
      >
        <div v-for="item in col" :key="item.id" >
          <slot name="list-item" :item="item">
          </slot>
        </div>
      </div>
    </div>
    <div class="hvr-imagelist__sticky-footer" v-if="restOfImages > 0">
      <span class="hvr-imagelist__sticky-footer-text">
        still {{restOfImages}} to show...
      </span>
    </div>
    <div class="hvr-imagelist__bottom-observer" v-observe-visibility="{callback: scrolledToBottom, throttle: 600}"></div>
    <div>
      <md-dialog :md-active.sync="showImagePopup">
        <md-dialog-content>
          <div class="hvr-image-popup">
            <img v-if="shownImage" :src="shownImage.src" class="hvr-image-popup__image md-image"/>
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
import { mapGetters } from 'vuex';
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
  mounted () {
    window.addEventListener('resize', () => {
      this.containerWidth = this.$refs.imagelist.clientWidth;
    });
    if ( this.$refs.imagelist) {
      this.containerWidth = this.$refs.imagelist.clientWidth;
    }
    this.$eventBus.$on('imageCard:open', this.imageClicked);
    this.$eventBus.$on('keyup:left', this.stepLeft);
    this.$eventBus.$on('keyup:right', this.stepRight);
  },
  destroy () {
    this.$eventBus.$off('imageCard:open', this.imageClicked);
    this.$eventBus.$off('keyup:left', this.stepLeft);
    this.$eventBus.$off('keyup:right', this.stepRight);
    window.removeEventListener('resize');
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
    },
    restOfImages () {
      return this.filteredCount - this.displayedCount;
    },
    ...mapGetters(['displayedCount', 'filteredCount'])
  },
  methods: {
    onKeyup() {
      console.log('keyup');
    },
    scrolledToBottom (isFooterVisible) {
      console.log('scrolledToBottom', isFooterVisible);
      this.$store.commit('requestMoreImage', { increase: this.colCount * 3 });
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
  @max-image-popup-height: 70vh;

  .hvr-imagelist {
    display: flex;
    position: relative;
    margin: 0 -@horizontal-spacing;
    background-color: @bg-color;

    &__sticky-footer {
      position: fixed;
      display: flex;
      bottom: 0;
      left: 0;
      right: 0;
      align-items: center;
      justify-content: center;
      height: 40px;
      background: fade(@blue-color, 35%);
    }
    &__sticky-footer-text {
      color: @white-color;
      font-weight: 600;
      text-shadow: 1px 1px 1px fade(@dark-grey-color, 50%);
    }

    &__bottom-observer {
      height: 60px;
      position: absolute;
      bottom: 0;
      background: #da5e28;
      left: 0;
      right: 0;
      opacity: 0;
    }

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
      &--split-6 {
        width: 16.6%;
      }
      &--split-7 {
        width: 14.28%;
      }
    }
  }

  .hvr-image-popup {
    max-height: @max-image-popup-height;
    user-select: none;

    .paging-arrow {
      width: 50%;
      height: 100%;
      display: flex;
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

    &__image {
      max-height: @max-image-popup-height;
    }
  }
</style>