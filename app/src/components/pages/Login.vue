<template>
  <div>
    <div id="firebaseui-auth-container"></div>
    <snackbar v-if="notification" :message="notification" @action="dismissNotification()"></snackbar>
  </div>
</template>

<script>
  import Axios from 'axios';
  import firebase from 'firebase';
  import firebaseui from 'firebaseui';

  import TextField from '../global/TextField';
  import Snackbar from '../global/Snackbar';

  export default {
    name: "Login",
    components: {TextField, Snackbar},
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        notification: null
      };
    },
    methods: {
      facebookLogin() {
        // const provider = new Firebase.auth.FacebookAuthProvider();
        //
        // provider.setCustomParameters({
        //   'display': 'popup'
        // });
      },
      login() {

        this.dismissNotification();

        Axios.post('/sessions', this.form).then(({data}) => {
          localStorage.setItem('niduu-token', data.token);
          this.$router.push({name: 'home'});
        }).catch(error => {
          this.notification = error.message;
        });

      },
      dismissNotification() {
        this.notification = null;
      }
    },
    beforeRouteEnter(to, from, next) {
      const token = localStorage.getItem('niduu-token');
      return token ? next({name: 'home'}) : next();
    },
    mounted() {
      const uiConfig = {
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: (auth) => {
            console.log(auth);
            this.$router.push('/');
          },
          signInFailure: (error) => {
            console.log(error);
            this.notification = error.message;
          }
        },
        signInOptions: [
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ]
      };

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);
    },
  };
</script>

<style>
  @import "firebaseui/dist/firebaseui.css";
</style>
