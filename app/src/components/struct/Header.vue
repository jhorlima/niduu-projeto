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
  import {MDCRipple} from '@material/ripple';
  import {MDCTopAppBar} from '@material/top-app-bar/index';

  export default {
    name: "Header",
    data() {
      return {
        loading: this.$axiosHelp.loading,
        token: null
      };
    },
    methods: {
      action() {
        if (this.token && confirm("Deseja realmente desconectar?")) {
          localStorage.removeItem('niduu-token');
          this.token = null;
        }

        this.$router.push({name: 'login'});
      }
    },
    created() {
      this.token = localStorage.getItem('niduu-token');
    },
    computed: {
      cssClasses() {
        return {
          'mdc-button--raised': !!this.token,
          'mdc-button--outlined': !this.token,
        };
      },
      label() {
        return this.token ? "Desconectar" : "Entrar";
      },
    },
    mounted() {
      const vm = this;
      new MDCRipple(this.$refs.login);
      new MDCTopAppBar(this.$refs.toolbar);

      setInterval(() => {
        vm.token = localStorage.getItem('niduu-token');
      }, 500);

    },
  };
</script>

<style scoped>
  header.mdc-top-app-bar {
    background-color: white;
  }
</style>
