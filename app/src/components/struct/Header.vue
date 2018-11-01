<template>
  <header class="mdc-top-app-bar mdc-top-app-bar--dense mdc-theme--primary mdc-elevation--z1" ref="toolbar">

    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <span class="mdc-top-app-bar__title">SnapNiduu</span>
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
          this.$router.push({name: 'logoff'});
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
      this.user = this.$user;
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
  }
</style>
