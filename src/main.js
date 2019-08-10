import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { MdButton, MdAutocomplete, MdField, MdMenu, MdList, MdCheckbox } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdAutocomplete);
Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdCheckbox);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
