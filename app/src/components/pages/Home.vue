<template>

  <div class="mdc-layout-grid">

    <div class="mdc-layout-grid__inner animated fadeInUp">

      <div class="mdc-layout-grid__cell--span-12" v-if="!photos.length">
        <p align="center">Não há fotos para serem exibidas no momento.</p>
      </div>

      <div class="mdc-layout-grid__cell" v-for="photo in photos">
        <photo-card :photo="photo" :key="photo.id" @delete="apagarFoto" @like="like" @unlike="unlike"></photo-card>
      </div>

    </div>

    <fab label="Adicionar Foto" icon="plus" @action="abrirCamera"></fab>

    <niduu-camera v-if="camera" :coords="coords" @close="fecharCamera" @send="adicionarFotos"
                  @error="snackbar"></niduu-camera>

    <snackbar v-if="notification" :message="notification" @action="dismissNotification"></snackbar>

  </div>

</template>

<script>
  import Vue from 'vue';
  import Axios from 'axios';
  import Firebase from 'firebase';

  import Fab from '../global/Fab';
  import Snackbar from '../global/Snackbar';
  import PhotoCard from '../global/PhotoCard';
  import NiduuCamera from '../global/NiduuCamera';

  export default {
    name: "Home",
    components: {
      NiduuCamera,
      PhotoCard,
      Snackbar,
      Fab
    },
    data() {
      return {
        coords: {},
        photos: [],
        camera: false,
        notification: null
      };
    },
    methods: {
      abrirCamera() {
        this.dismissNotification();
        this.camera = true;
      },
      fecharCamera() {
        this.camera = false;
      },
      adicionarFotos(send, dialog) {
        const user = Firebase.auth().currentUser;
        const storageRef = Firebase.storage().ref(`photos/${user.uid}/`);

        const vm = this;
        const token = localStorage.getItem('niduu-token');

        Axios.post('photos', send, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          vm.getPhotos();
          dialog.close('send');
        }).catch((error) => {
          vm.snackbar(error);
        });
      },
      apagarFoto(photo) {
        if (!confirm("Gostaria de apagar essa foto?"))
          return;

        const vm = this;
        const token = localStorage.getItem('niduu-token');

        Axios.delete(`photos/${photo.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }).then(() => {
          vm.getPhotos();
        }).catch((error) => {
          vm.snackbar(error.message);
        });
      },
      like(photo) {
        const vm = this;
        const token = localStorage.getItem('niduu-token');

        Axios.post(`photos/like/${photo.id}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          photo.liked = true;
          vm.getPhotos();
        }).catch((error) => {
          vm.snackbar(error);
        });
      },
      unlike(photo) {
        const vm = this;
        const token = localStorage.getItem('niduu-token');

        Axios.delete(`photos/like/${photo.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(() => {
          photo.liked = false;
          vm.getPhotos();
        }).catch((error) => {
          vm.snackbar(error);
        });
      },
      snackbar(message) {
        this.notification = message;
      },
      dismissNotification() {
        this.notification = null;
      },
      getPhotos() {
        const token = localStorage.getItem('niduu-token');

        Axios.get('/photos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(({data}) => {
          this.photos = data;
        }).catch(error => {

          this.$router.push({
            name: 'error',
            params: {
              error: 400,
              title: `400 - ${error.message}`,
              message: error.message,
            },
            redirect: true
          });

        });
      }
    },
    beforeRouteEnter(to, from, next) {
      Firebase.auth().currentUser ? next() : next({name: 'home'});
    },
    created() {
      this.getPhotos();

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {
          this.coords = position.coords;
        }, error => {
          this.coords.error = "Seu navegador recusou compartilhar a localização!";
        });

      } else {
        this.coords.error = "Seu navegador não permite localização!";
      }
    }
  };
</script>
