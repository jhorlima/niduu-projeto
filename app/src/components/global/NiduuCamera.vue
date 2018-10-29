<template>
  <div class="mdc-dialog" aria-modal="true" aria-labelledby="my-dialog-title" ref="dialog">
    <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">

        <h2 class="mdc-dialog__title" id="my-dialog-title">
          Camera do Dispositivo
        </h2>

        <div class="mdc-dialog__content" id="my-dialog-content">

          <video v-show="!photo" id="video" width="500" height="375" autoplay></video>
          <canvas v-show="photo" width="500" height="375" ref="canvas"></canvas>

          <button class="snap mdc-button mdc-theme--secondary-bg mdc-theme--on-secondary mdc-button--raised" @click="snap()">
            <mdi :icon="!photo ? 'camera' : 'reload'"></mdi>
            {{!photo ? "Capturar" : "Cancelar"}}
          </button>

        </div>

        <footer class="mdc-dialog__actions">
          <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
            Fechar
          </button>
          <button type="submit" class="mdc-button mdc-button--raised mdc-dialog__button" data-mdc-dialog-action="snap" @click="send()" :disabled="!photo">
            Enviar foto
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
    name: "NiduuCamera",
    data() {
      return {
        photo: null,
        coords: {}
      };
    },
    methods: {
      snap() {
        if (this.photo) {
          this.photo = null;
        } else {
          this.$refs.canvas.getContext('2d').drawImage(video, 0, 0, 500, 375);
          this.photo = this.$refs.canvas.toDataURL("image/png");
        }
      },
      send() {
        if (this.photo) {

          this.$emit('send', {
            "format": "jpeg",
            "width": 5616,
            "height": 3744,
            "filename": "0000_yC-Yzbqy7PY.jpeg",
            "id": 0,
            "author": "Alejandro Escamilla",
            "author_url": "https://unsplash.com/@alejandroescamilla",
            "post_url": "https://unsplash.com/photos/yC-Yzbqy7PY",
            "url": this.photo
          });

        }
      }
    },
    mounted() {
      const vm = this;
      const dialog = new MDCDialog(this.$refs.dialog);
      const video = document.getElementById('video');

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();
        }, function (error) {
          console.log(error);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {
          vm.coords = position.coords;
          console.log(vm.coords);
        }, error => {
          console.log(error);
        });

      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      dialog.open();

      dialog.listen('MDCDialog:closed', (event) => {
        this.$emit('close', event);
      });
    }
  };
</script>

<style scoped>
  .mdc-button.snap {
    margin-top: -130px;
    margin-left: 170px;
  }

  video, canvas {
    border-radius: 8px 8px;
  }
</style>
