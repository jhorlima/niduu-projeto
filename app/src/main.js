import Vue from 'vue';
import App from './App';
import Axios from 'axios';
import VueRouter from 'vue-router';
import VueFractionGrid from 'vue-fraction-grid';

import routes from './router/index';

import MDI from './components/global/MDI';

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

// Add a request interceptor
Axios.interceptors.request.use(config => {
  // Do something before request is sent
  Vue.prototype.$axiosHelp.loading.enable = true;
  Vue.prototype.$axiosHelp.message = {show: false};

  return config;
}, error => Promise.reject(error));

// Add a response interceptor
Axios.interceptors.response.use(response => {
  // Do something with response data
  const {status, statusText} = response;

  Vue.prototype.$axiosHelp.loading.enable = false;
  Vue.prototype.$axiosHelp.message = {show: true, error: false, ...{status, statusText}};

  return response;
}, error => {
  // Do something with response error
  const {status, statusText} = error;

  Vue.prototype.$axiosHelp.loading.enable = false;
  Vue.prototype.$axiosHelp.message = {show: true, error: true, ...{status, statusText}};

  return Promise.reject(error);
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: new VueRouter({routes})
});
