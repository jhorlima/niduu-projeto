<template>

  <button class="mdc-fab mdc-fab--extended app-fab--absolute animated fadeInRight" @click="click()" ref="ripple">
    <span class="material-icons mdc-fab__icon"><mdi :icon="icon"></mdi></span>
    <span class="mdc-fab__label" v-text="label"></span>
  </button>

</template>

<script>
  import {MDCRipple} from '@material/ripple';

  export default {
    name: "Fab",
    props: {
      label: {
        type: String,
        required: true
      }, icon: {
        type: String,
        required: true
      }
    },
    methods: {
      click() {
        this.$emit('action');
      }
    },
    mounted() {
      new MDCRipple(this.$refs.ripple);
    }
  };
</script>

<style scoped>
  .app-fab--absolute {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }

  @media(min-width: 1024px) {
    .app-fab--absolute {
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
</style>
