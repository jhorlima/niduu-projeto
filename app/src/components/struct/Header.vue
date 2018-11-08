<template>
  <header class="mdc-top-app-bar mdc-top-app-bar--dense mdc-theme--primary mdc-elevation--z0" ref="toolbar" v-show="$route.name !== 'login'">

    <div class="mdc-top-app-bar__row layout-padding">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <router-link :to="{name: 'home'}">
          <img src="@/assets/logo-completa.png" alt="Logo da Niduu" height="36px">
        </router-link>
      </section>

      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        <button @click="action()" :class="cssClasses" class="mdc-button animated pulse" ref="login" v-text="label">
        </button>
      </section>
    </div>

    <div role="progressbar" class="mdc-linear-progress mdc-linear-progress--indeterminate" v-if="loading.enable">
      <div class="mdc-linear-progress__buffering-dots"></div>
      <div class="mdc-linear-progress__buffer"></div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
      <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
        <span class="mdc-linear-progress__bar-inner"></span>
      </div>
    </div>

  </header>
</template>

<script>

  import {EventBus} from '../../helpers/js/event-bus';

  import Firebase from 'firebase';

  import {MDCRipple} from '@material/ripple';
  import {MDCTopAppBar} from '@material/top-app-bar/index';

  export default {
    name: "Header",
    data() {
      return {
        loading: this.$axiosHelp.loading,
        user: null
      };
    },
    methods: {
      action() {
        if (this.user && confirm("Deseja realmente desconectar?")) {
          this.$axiosHelp.loading.enable = true;

          const uid = Firebase.auth().currentUser.uid;
          const ref = Firebase.database().ref(`tokens_messaging/${uid}/tokens`);

          ref.child(localStorage.getItem('notificationHash')).remove().then(() => {
            return Firebase.auth().signOut();
          }).then(() => {
            const notificationToken = localStorage.getItem('notificationToken');
            localStorage.removeItem('notificationHash');
            localStorage.removeItem('notificationToken');
            this.$router.push({name: 'login'});
            return Firebase.messaging().deleteToken(notificationToken);
          }).finally(() => {
            this.$axiosHelp.loading.enable = false;
          });
        } else {
          this.$router.push({name: 'login'});
        }
      }
    },
    computed: {
      cssClasses() {
        return {
          'mdc-button--raised': !!this.user,
          'mdc-button--outlined': !this.user,
        };
      },
      label() {
        return this.user ? "Desconectar" : "Entrar";
      },
    },
    created() {
      this.user = Firebase.auth().currentUser;
      EventBus.$on('change-user', (user) => this.user = user);
    },
    mounted() {
      new MDCRipple(this.$refs.login);
      new MDCTopAppBar(this.$refs.toolbar);
    },
  };
</script>

<style scoped>
  header.mdc-top-app-bar {
    background-color: white;
    position: relative;
  }

  .mdc-top-app-bar--dense .mdc-top-app-bar__section {
    padding: 0 8px;
  }
</style>
