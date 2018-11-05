<template>
  <i class="material-icons mdi" :class="`mdi-${icon}`"></i>
</template>

<script>
  export default {
    name: "MDI",
    props: {
      icon: {
        type: String,
        required: true
      }
    }
  };
</script>

<style>
  .mdc-button-icon > i.mdi {
    padding-right: 8px;
    font-size: 20px;
  }
</style>
