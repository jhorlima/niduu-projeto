<template>
  <div class="mdc-snackbar mdc-snackbar--align-start" aria-live="assertive" aria-atomic="true" aria-hidden="true" ref="snackbar">
    <div class="mdc-snackbar__text"></div>
    <div class="mdc-snackbar__action-wrapper">
      <button type="button" class="mdc-snackbar__action-button"></button>
    </div>
  </div>
</template>

<script>
  import {MDCSnackbar} from '@material/snackbar';

  export default {
    name: "Snackbar",
    props: {
      message: {
        type: String,
        required: true
      },
      multiline: {
        type: Boolean,
        default: false
      },
    },
    mounted() {
      const snackbar = new MDCSnackbar(this.$refs.snackbar);

      snackbar.dismissesOnAction = false;

      snackbar.show({
        message: this.message,
        actionText: "Fechar",
        actionHandler: this.action,
        multiline: this.multiline
      });

    },
    methods: {
      action(event) {
        this.$emit('action', event);
      }
    }
  };
</script>

