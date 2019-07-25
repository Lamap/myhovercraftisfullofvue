<template>
  <div class="test">
    <h1 class="test__elek">Test {{testProp}}</h1>
    <md-button>sajnálatos <md-icon>home</md-icon></md-button>
    <md-autocomplete :value="bela" :md-options="jojoItems" />
  </div>
</template>
<script>

  export default {
    props: {
      testProp: {
        type: String,
        default: 'jenős'
      }
    },
    data () {
      return {
        jojoItems: ['aha', 'nono', 'nanaaaallllddda'],
        bela: null
      }
    },
    created () {
      console.info('test component created ... béla...')
    }
  }
</script>
<style lang="less">
  @color-var: #0d1ddd;
  .test {
    &__elek {
      color: @color-var;
    }
  }
</style>