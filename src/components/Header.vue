<template>
  <div class="hvr-header">
    myhovercraftisfullof
    <span class="hvr-header__count">{{filteredCount}}/</span>
    <span class="hvr-header__count">{{totalCount}}</span>
    eels

    <file-selector @filesSelected="onFilesSelected" v-if="loggedUser && showAddButton"/>
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
    <md-dialog :md-active.sync="showConfirmDialog" v-if="showConfirmDialog">
      <md-dialog-title><div v-html="confirmDialogData.title"></div></md-dialog-title>
      <md-dialog-content>
        <div class="hvr-confirm-dialog" >
          <md-button class="md-raised md-accent" @click="applyConfirm">Sure</md-button>
          <md-button class="md-raised" @click="cancelConfirm">Oh, no...</md-button>
        </div>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>
<script>
import FileSelector from '@/components/FileSelector';
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    showAddButton: {
      default: true,
      type: Boolean
    }
  },
  created () {
    console.log('header created');
  },
  mounted () {
    this.$eventBus.$on('dialog:confirm', this.openConfirmDialog)
  },
  destroy () {
    this.$eventBus.$off('dialog:confirm', this.openConfirmDialog);
  },
  components: {
    FileSelector
  },
  data () {
    return {
      showLoginDialog: false,
      // TODO: uniq dialog handling on the root
      confirmDialogData: null,
      username: '',
      password: ''
    }
  },
  computed: {
    showConfirmDialog: {
      get () {
        return !!this.confirmDialogData;
      },
      set (value) {
        this.confirmDialogData = value;
      }
    },
    ...mapState({
      loggedUser: 'loggedUser'
    }),
    ...mapGetters(['totalCount', 'filteredCount'])
  },
  methods: {
    cancelConfirm () {
      this.showConfirmDialog = false;
    },
    applyConfirm () {
      if (this.confirmDialogData && typeof  this.confirmDialogData.onConfirm === 'function') {
        this.confirmDialogData.onConfirm();
      }
      this.showConfirmDialog = false;
    },
    onFilesSelected (files) {
      this.$store.dispatch('addImages', files);
    },
    openLoginDialog () {
      this.showLoginDialog = true;
    },
    openConfirmDialog (payload) {
      this.confirmDialogData = payload;
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
  .hvr-confirm-dialog {
    display: flex;
    justify-content: flex-end;
  }
</style>