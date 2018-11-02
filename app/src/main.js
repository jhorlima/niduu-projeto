import Vue from 'vue';
import Axios from 'axios';
import Firebase from 'firebase';
import VueRouter from 'vue-router';
import VueFractionGrid from 'vue-fraction-grid';

import App from './App';
import routes from './router/index';
import MDI from './components/global/MDI';
import {EventBus} from './helpers/event-bus';
import {config} from './helpers/firebase-config';

Vue.config.productionTip = false;

Vue.prototype.$axiosHelp = {
  loading: {enable: false}
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
  return config;
}, error => Promise.reject(error));

Axios.interceptors.response.use(response => {
  const {status, statusText} = response;
  Vue.prototype.$axiosHelp.loading.enable = false;
  Vue.prototype.$axiosHelp.message = {show: true, error: false, ...{status, statusText}};
  return response;
}, error => {
  Vue.prototype.$axiosHelp.loading.enable = false;
  return Promise.reject(error);
});

let app;

const mount = (user, error) => {

  if (!app) {
    app = new Vue({
      el: '#app',
      render: h => h(App),
      router: new VueRouter({routes})
    });
  }

  Firebase.auth().onAuthStateChanged(user => EventBus.$emit('change-user', user));
};

Firebase.initializeApp(config);
Firebase.auth().languageCode = "pt";
Firebase.auth().onAuthStateChanged(mount, (error) => mount(null, error));
