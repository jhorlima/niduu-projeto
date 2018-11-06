import Vue from 'vue';
import Firebase from 'firebase';
import VueRouter from 'vue-router';

import App from './App';
import routes from './router/index';
import MDI from './components/global/MDI';
import {EventBus} from './helpers/js/event-bus';
import {config} from './helpers/js/firebase-config';

Vue.config.productionTip = false;

Vue.prototype.$axiosHelp = {
  loading: {enable: false}
};

Vue.use(VueRouter);
Vue.component('mdi', MDI);

let app;

const mount = () => {

  if (!app) {
    app = new Vue({
      el: '#app',
      render: h => h(App),
      router: new VueRouter({
        mode: 'history',
        routes
      })
    });
  }

  Firebase.auth().onAuthStateChanged(user => EventBus.$emit('change-user', user), err => console.log(err.message));
};

Firebase.initializeApp(config);
Firebase.auth().languageCode = "pt";
Firebase.auth().onAuthStateChanged(mount, (error) => mount(null, error));
