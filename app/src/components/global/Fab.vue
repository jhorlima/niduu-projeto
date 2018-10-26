<template>
  <button class="mdc-fab mdc-ripple teste" :class="{'mdc-fab--extended' : extended}" @click="click()" id="absolute-fab">
    <span class="material-icons mdc-fab__icon"><mdi :icon="icon"></mdi></span>
    <span class="mdc-fab__label" v-show="extended" v-text="label"></span>
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
        this.extended = !this.extended;
        this.$loading.enable = !this.$loading.enable
      }
    },
    data() {
      return {
        extended: true
      };
    },
    mounted() {
      new MDCRipple(document.querySelector('.mdc-ripple'));
    }
  };
</script>

<style scoped>
  #absolute-fab {
    transition: all 0.2s ease 0s;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 1;
  }

  .mdc-fab.mdc-fab--extended {
    height: 56px;
    border-radius: 28px;
  }
</style>
