<template >
  <div class="hvr-home">
    <Header />
    <Gallery />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Gallery from '@/components/Gallery.vue'
import Header from '@/components/Header.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Gallery,
    Header
  },
  created () {
  }
}
</script>
<style lang="less">
  .hvr-home {
    padding: 2rem 0;
  }
</style>