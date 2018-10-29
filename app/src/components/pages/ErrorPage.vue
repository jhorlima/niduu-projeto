<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--span-12 mdc-layout-grid__cell--align-middle">
        <h3 class="mdc-typography--headline2 mdc-theme--primary animated slideInUp" align="center" v-text="title"></h3>
        <p class="body1" align="center" v-html="message"></p>
        <p align="center">
          <router-link :to="{name: 'home'}" tag="button" class="mdc-button mdc-button--raised" ref="backToHome">
            Ir para o Início
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {MDCRipple} from '@material/ripple';

  export default {
    name: "ErrorPage",
    props: {
      title: {
        type: String,
        default: "404 - Página não encontrada."
      },
      message: {
        type: String,
        default: "Verifique se você digitou o endereço corretamente e tente novamente.",
      },
    },
    mounted() {
      new MDCRipple(this.$refs.backToHome.$el);
    },
  };
</script>
