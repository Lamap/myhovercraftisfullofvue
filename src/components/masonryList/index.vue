<template>
  <div class="hvr-imagelist">
    I am the hovercraft of walrusssss
    <div class="hvr-imagelist__item" v-for="item in items" :key="item">
      <slot name="list-item">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'masonryList',
  props: {
    maxColWidth: {
      type: Number,
      default: 200
    },
    items: {
      required: true,
      type: Array
    }
  },
  created () {
    console.log('masonry list created hónaljBéla levelesJenőSercegésss')
  },
  methods: {
    bottomReached () {
      this.$emit('imagelist:bottom-reached')
    }
  }
}
</script>