import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { MdButton, MdAutocomplete, MdField, MdMenu, MdList, MdCheckbox, MdDialog, MdTable, MdContent, MdRipple } from 'vue-material/dist/components';
import { sync } from 'vuex-router-sync'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import VueObserveVisibility from 'vue-observe-visibility';
import VueTouch from 'vue-touch';

const unsync = sync(store, router);
Vue.prototype.$eventBus = new Vue();

Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdAutocomplete);
Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdCheckbox);
Vue.use(MdDialog);
Vue.use(MdTable);
Vue.use(MdContent);
Vue.use(MdRipple);
Vue.use(VueObserveVisibility);
Vue.use(VueTouch);

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.addEventListener('keyup', (event) => {
  switch(event.keyCode) {
    case 39:
      app.$eventBus.$emit('keyup:right');
      break;
    case 37:
      app.$eventBus.$emit('keyup:left');
      break;
  }
});