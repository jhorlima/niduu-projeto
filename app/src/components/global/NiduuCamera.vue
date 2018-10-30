<template>
  <div class="mdc-dialog" aria-modal="true" aria-labelledby="my-dialog-title" ref="dialog">
    <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface">

        <div class="mdc-dialog__content" id="my-dialog-content">

          <video v-show="!photo" width="500" height="375" ref="video" autoplay></video>
          <canvas v-show="photo" width="500" height="375" ref="canvas"></canvas>

          <container class="botton-group" width="100%">

            <grid horizontal="center" wrap="wrap" class="padding-fix">

              <grid-item size="1/1">

                <grid horizontal="around" class="animated fadeIn">

                  <grid-item v-if="photo">
                    <button class="snap mdc-button mdc-fab mdc-theme--on-primary" @click="reload()">
                      <mdi class="mdc-fab__icon" icon="reload"></mdi>
                    </button>
                  </grid-item>

                  <grid-item v-if="photo" class="animated bounceIn">
                    <button class="snap mdc-button mdc-fab mdc-fab--extended mdc-theme--on-primary" @click="send()">
                      <mdi class="mdc-fab__icon" icon="send"></mdi>
                      Postar
                    </button>
                  </grid-item>

                  <grid-item v-if="!photo" class="animated bounceIn">
                    <button class="snap mdc-button mdc-fab mdc-theme--on-primary" @click="snap()">
                      <mdi class="mdc-fab__icon" icon="camera"></mdi>
                    </button>
                  </grid-item>

                </grid>

              </grid-item>

              <grid-item size="1/1" v-if="coords.error">
                <p class="mdc-typography--subtitle1 mdc-theme--on-primary" align="center" v-text="coords.error"></p>
              </grid-item>

            </grid>

          </container>

        </div>

      </div>
    </div>

    <div class="mdc-dialog__scrim"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {MDCDialog} from '@material/dialog';

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  };

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
        this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, this.$refs.video.width, this.$refs.video.height);
        this.photo = this.$refs.canvas.toDataURL("image/png");
      },
      reload() {
        this.photo = null;
      },
      send() {
        const send = new FormData();

        send.append("image", dataURLtoFile(this.photo, 'image.png'));

        if (!this.coords.error) {
          send.append("latitude", this.coords.latitude);
          send.append("longitude", this.coords.longitude);
        }

        this.$emit('send', send, this.dialog);
      }
    },
    beforeCreate() {
      Vue.prototype.$axiosHelp.loading.enable = true;
    },
    mounted() {
      const vm = this;

      const errorCamera = () => {
        vm.$emit('error', "Não foi possível abrir a camera do dispositivo!");
        vm.$emit('close', event);
        vm.dialog.close();
      };

      vm.dialog = new MDCDialog(vm.$refs.dialog);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
          try {
            vm.$refs.video.srcObject = stream;
            vm.$refs.video.play();

            vm.$refs.video.onplay = () => {
              Vue.prototype.$axiosHelp.loading.enable = false;
              vm.dialog.open();
            };

          } catch (e) {
            errorCamera();
          }

        }, errorCamera);

      } else {
        errorCamera();
      }

      vm.dialog.listen('MDCDialog:closed', (event) => {
        vm.$emit('close', event);
      });
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
