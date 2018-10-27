<template>
  <div class="mdc-layout-grid">
    <div class="mdc-layout-grid__inner">
      <div class="mdc-layout-grid__cell--span-12 mdc-layout-grid__cell--align-middle">
        <h3 class="mdc-typography--headline2 mdc-theme--primary" align="center" v-text="title"></h3>
        <p class="body1" align="center" v-html="message"></p>
        <p align="center">
          <router-link :to="{name: 'home'}" class="mdc-button mdc-button--raised">
            Ir para o Início
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  };
</script>
