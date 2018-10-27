<template>
  <header class="mdc-top-app-bar mdc-top-app-bar--dense mdc-theme--primary mdc-elevation--z1" ref="toolbar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <span class="mdc-top-app-bar__title">Niduugram</span>
      </section>

      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        <button class="mdc-button mdc-ripple mdc-button--outlined" ref="login">
          Login
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
    mounted() {
      new MDCRipple(this.$refs.login);
      new MDCTopAppBar(this.$refs.toolbar);
    },
    data() {
      return {
        loading: this.$axiosHelp.loading
      };
    }
  };
</script>

<style scoped>
  header.mdc-top-app-bar {
    background-color: white;
  }
</style>
