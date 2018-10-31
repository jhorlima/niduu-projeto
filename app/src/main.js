import Vue from 'vue';
import App from './App';
import Axios from 'axios';
import Firebase from 'firebase';
import VueRouter from 'vue-router';
import VueFractionGrid from 'vue-fraction-grid';

import routes from './router/index';
import MDI from './components/global/MDI';
import {config} from './helpers/firebaseConfig';

Vue.config.productionTip = false;

Vue.prototype.$axiosHelp = {
  loading: {enable: false},
  error: {show: false},
  success: {show: false},
};

Vue.use(VueRouter);
Vue.use(VueFractionGrid, {
  approach: 'desktop-first',
  breakpoints: {
    compact: '415px',
    tablet: '416px 1100px'
  }
});
Vue.component('mdi', MDI);

window.axios = Axios;
Axios.defaults.baseURL = 'http://127.0.0.1:3333';

Axios.interceptors.request.use(config => {
  Vue.prototype.$axiosHelp.loading.enable = true;
  Vue.prototype.$axiosHelp.message = {show: false};

  return config;
}, error => Promise.reject(error));

Axios.interceptors.response.use(response => {
  const {status, statusText} = response;
  Vue.prototype.$axiosHelp.loading.enable = false;
  Vue.prototype.$axiosHelp.message = {show: true, error: false, ...{status, statusText}};
  return response;
}, error => {
  const {status, statusText} = error;
  Vue.prototype.$axiosHelp.loading.enable = false;
  Vue.prototype.$axiosHelp.message = {show: true, error: true, ...{status, statusText}};
  return Promise.reject(error);
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: new VueRouter({routes}),
  created() {
    Firebase.initializeApp(config);
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$router.push('/');
      } else {
        this.$router.push('/login');
      }
    });
  }
});
