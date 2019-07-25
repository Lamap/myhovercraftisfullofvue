<template>
  <div class="hvr-imagelist" ref="imagelist">
    <div
      v-for="(row, rowIndex) in structuredItems"
      :key="rowIndex"
      :class="colClass"
      class="hvr-imagelist__col"
    >
      <div v-for="item in row" :key="item.id">
        <slot name="list-item" :item="item">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'masonryList',
  data () {
    return {
      containerWidth: 0
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
    console.log('masonry list created hónaljBéla levelesJenőSercegésféleség..ss .')
    window.addEventListener('resize', () => {
      this.containerWidth = this.$refs.imagelist.clientWidth;
      console.log('resize', this.$refs.imagelist.clientWidth);
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
      for (let colIndex = 0; colIndex < this.colCount; colIndex++) {
        structured[colIndex] = this.items.filter((item, itemIndex) => {
          return (itemIndex % this.colCount) === colIndex;
        });
      }
      console.log(structured);
      return structured;
    }
  },
  methods: {
    bottomReached () {
      this.$emit('imagelist:bottom-reached')
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
</style>