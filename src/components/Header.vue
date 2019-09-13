<template>
  <div class="hvr-header">
    myhovercraftisfullof
    <span class="hvr-header__count">{{filteredCount}}/</span>
    <span class="hvr-header__count">{{totalCount}}</span>
    eels

    <file-selector @filesSelected="onFilesSelected" v-if="loggedUser"/>
    <span class="hvr-header__login-section" >
      <md-button class="md-icon-button" v-if="!loggedUser" @click="openLoginDialog">
        <md-icon>account_circle</md-icon>
      </md-button>
      <md-button class="md-icon-button" v-if="loggedUser" @click="logUserOut">
        <md-icon>exit_to_app</md-icon>
      </md-button>
    </span>

    <md-dialog :md-active.sync="showLoginDialog">
      <md-dialog-content>
        <form @submit.prevent="logUserIn" class="hvr-login-dialog">
          <md-field>
            <md-input v-model="username" placeholder="username"></md-input>
          </md-field>
          <md-field>
            <md-input v-model="password" placeholder="password" type="password"></md-input>
          </md-field>
          <div class="hvr-login-dialog__button">
            <md-button type="submit" class="md-primary" >Login</md-button>
          </div>
        </form>
      </md-dialog-content>
    </md-dialog>
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
  data () {
    return {
      showLoginDialog: false,
      username: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      loggedUser: 'loggedUser'
    }),
    ...mapGetters(['totalCount', 'filteredCount'])
  },
  methods: {
    onFilesSelected (files) {
      this.$store.dispatch('addImages', files);
    },
    openLoginDialog () {
      this.showLoginDialog = true;
    },
    logUserIn () {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      });
      this.showLoginDialog = false;
    },
    logUserOut () {
      this.$store.dispatch('logout');
    }
  }
}
</script>
<style lang="less">
  @import "../global.less";

  .hvr-header {
    color: @mid-grey-color;
    font-weight: lighter;
    font-size: 23px;
    text-transform: uppercase;
    display: flex;
    position: sticky;
    padding: 0 @main-horizontal-spacing;
    background: @white-color;
    z-index: 6;
    top: 0;
    height: @header-height;
    align-items: center;

    &__count {
      color: @dark-grey-color;
    }

    &__login-section {
      position: fixed;
      right: 0.2rem;
      top: 0.2rem;
      opacity: 0.1;
      &:hover {
        opacity: 1;
      }
    }
  }
  .hvr-login-dialog {
    &__button {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>