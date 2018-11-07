<template>
  <div class="mdc-dialog" ref="dialog">
    <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">

        <div class="mdc-dialog__content">

          <video v-show="!photo" width="500" height="375" ref="video" autoplay></video>
          <canvas v-show="photo" width="500" height="375" ref="canvas"></canvas>

          <div class="layout-column flex botton-group">

            <div class="layout-column flex layout-align-space-around-stretch padding-fix">

              <div class="layout-row flex layout-margin layout-align-center-stretch animated fadeIn">

                <div>
                  <button class="snap mdc-button mdc-fab mdc-theme--on-primary" @click="dialog.close()">
                    <mdi class="mdc-fab__icon" icon="close"></mdi>
                  </button>
                </div>

                <div v-if="photo">
                  <button class="snap mdc-button mdc-fab mdc-theme--on-primary" @click="reload()">
                    <mdi class="mdc-fab__icon" icon="reload"></mdi>
                  </button>
                </div>

                <div v-if="photo" class="animated bounceIn">
                  <button class="snap mdc-button mdc-fab mdc-fab--extended mdc-theme--on-primary" @click="send()">
                    <mdi class="mdc-fab__icon" icon="send"></mdi>
                    Postar
                  </button>
                </div>

                <div v-if="!photo" class="animated bounceIn">
                  <button class="snap mdc-button mdc-fab mdc-theme--on-primary" @click="snap()">
                    <mdi class="mdc-fab__icon" icon="camera"></mdi>
                  </button>
                </div>

              </div>

              <div size="1/1" v-if="coords.error">
                <p class="mdc-typography--subtitle1 mdc-theme--on-primary" align="center" v-text="coords.error"></p>
              </div>

            </div>

          </div>

        </div>

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
        dialog: null,
        photo: null
      };
    },
    props: {
      coords: {
        required: true
      }
    },
    methods: {
      snap() {
        this.$refs.canvas.width = this.$refs.video.clientWidth;
        this.$refs.canvas.height = this.$refs.video.clientHeight;
        this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, this.$refs.video.clientWidth, this.$refs.video.clientHeight);
        this.photo = this.$refs.canvas.toDataURL("image/png");
      },
      reload() {
        this.photo = null;
      },
      send() {
        this.$emit('send', this.photo, this.dialog);
      }
    },
    beforeCreate() {
      this.$axiosHelp.loading.enable = true;
    },
    mounted() {

      const errorCamera = () => {
        this.$emit('error', "Não foi possível abrir a camera do dispositivo!");
        this.$emit('close', event);
        this.dialog.close();
      };

      this.dialog = new MDCDialog(this.$refs.dialog);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {

          this.$refs.video.srcObject = stream;
          this.$refs.video.play();

          this.$refs.video.onplay = () => {
            this.$axiosHelp.loading.enable = false;
            this.dialog.open();
          };

        }).catch(errorCamera);

      } else {
        errorCamera();
      }

      this.dialog.listen('MDCDialog:closed', (event) => {
        this.$emit('close', event);
      });

    },
    destroyed() {
      this.$axiosHelp.loading.enable = false;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {

          stream.getTracks().forEach(mediaStream => {
            mediaStream.stop();
          });
        }).catch(error => {
          console.log('getUserMedia() error', error);
        });
      }

    }
  };
</script>

<style scoped>

  .padding-fix {
    padding-bottom: 1rem;
  }

  .mdc-dialog__content {
    padding: 0;
  }

  .botton-group {
    width: 100%;
    position: absolute;
    bottom: .1rem;
    background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgb(26, 26, 26));
  }

  .mdc-button.snap {
    min-width: 56px;
    max-width: 56px;
    min-height: 56px;
    max-height: 56px;
    border-color: white;
    border-style: solid;
    -webkit-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
  }

  .mdc-button.snap.mdc-fab--extended {
    height: 56px;
    min-width: inherit;
    max-width: inherit;
  }

  video, canvas {
    height: 100%;
    width: 100%;
    border-radius: 4px;
  }
</style>
