<template>
  <div class="mdc-dialog" ref="dialog">
    <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">
        <slot name="title">Title</slot>
        <div class="mdc-dialog__content">
          <slot>...</slot>
        </div>
        <footer class="mdc-dialog__actions">
          <button type="button" class="mdc-button mdc-dialog__button mdc-button--outlined" @click.stop.prevent="no()">
            <slot name="no">No</slot>
          </button>
          <button type="button" class="mdc-button mdc-dialog__button mdc-button--raised" @click.stop.prevent="yes()">
            <slot name="yes">Yes</slot>
          </button>
        </footer>
      </div>
    </div>
    <div class="mdc-dialog__scrim"></div>
  </div>
</template>

<script>
  import {MDCDialog} from '@material/dialog';

  export default {
    name: "ConfirmDialog",
    data() {
      return {
        dialog: null
      };
    },
    methods: {
      no() {
        this.$emit('no', this.dialog);
      },
      yes() {
        this.$emit('yes', this.dialog);
      }
    },
    mounted() {
      this.dialog = new MDCDialog(this.$refs.dialog);

      this.dialog.open();

      this.dialog.listen('MDCDialog:closed', (event) => {
        this.$emit('close', event);
      });
    }
  };
</script>
