<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="My hovercraft is full"/>
    <ImageList :items="items">
      <template v-slot:list-item="slotProps"><div class="gggggg">kkkkk {{slotProps.item}}iii</div></template>
    </ImageList>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ImageList from '@/components/masonryList'

export default {
  name: 'home',
  components: {
    HelloWorld,
    ImageList
  },
  data () {
    return {
      items: [
        'jenő',
        'béla',
        'ahossl'
      ]
    };
  },
  created () {
  }
}
</script>
