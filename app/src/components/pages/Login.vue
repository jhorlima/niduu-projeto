<template>
  <div>
    <div ref="firebaseui"></div>
    <snackbar v-if="notification" :message="notification" @action="dismissNotification()"></snackbar>
  </div>
</template>

<script>
  import Firebase from 'firebase';
  import Firebaseui from 'firebaseui';

  import Snackbar from '../global/Snackbar';

  export default {
    name: "Login",
    components: {Snackbar},
    data() {
      return {
        notification: null
      };
    },
    methods: {
      loginSuccess() {
        this.dismissNotification();
        this.$router.push('/');
      },
      loginFailure(error) {
        this.dismissNotification();
        this.notification = error.message;
      },
      dismissNotification() {
        this.notification = null;
      },
    },
    beforeRouteEnter(to, from, next) {
      Firebase.auth().currentUser ? next({name: 'home'}) : next();
    },
    mounted() {
      const uiConfig = {
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: this.loginSuccess,
          signInFailure: this.loginFailure,
        },
        signInOptions: [
          Firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ]
      };

      const ui = Firebaseui.auth.AuthUI.getInstance() || new Firebaseui.auth.AuthUI(Firebase.auth());

      ui.start(this.$refs.firebaseui, uiConfig);
    },
  };
</script>

<style>
  @import "firebaseui/dist/firebaseui.css";
</style>
