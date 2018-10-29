<template>

  <button class="mdc-fab animated fadeInRight" ref="ripple" :class="cssClasses" @click="click()" id="absolute-fab">
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
        this.$emit('action');
      }
    },
    data() {
      return {
        extended: true
      };
    },
    computed: {
      cssClasses() {
        return {
          'mdc-fab--extended': this.extended
        };
      }
    },
    mounted() {
      new MDCRipple(this.$refs.ripple);
    }
  };
</script>

<style scoped>
  #absolute-fab {
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
