import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import routes from './router/index';

import MDI from './components/global/MDI';

Vue.config.productionTip = false;
Vue.prototype.$loading = {enable: true};

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({routes});

Vue.component('mdi', MDI);

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
