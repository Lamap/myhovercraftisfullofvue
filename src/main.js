import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { MdButton, MdAutocomplete, MdField, MdMenu, MdList, MdCheckbox, MdDialog, MdInput } from 'vue-material/dist/components';
import { sync } from 'vuex-router-sync'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

const unsync = sync(store, router);

Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdAutocomplete);
Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdCheckbox);
Vue.use(MdDialog);
// Vue.use(MdInput);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
