<template>

  <div class="mdc-layout-grid">

    <div class="mdc-layout-grid__inner animated fadeInUp">

      <div class="mdc-layout-grid__cell--span-12" v-if="!hasPhotos">
        <p align="center">Não há fotos para serem exibidas no momento.</p>
      </div>

      <div class="mdc-layout-grid__cell" v-for="(photo, key) in photos">
        <photo-card :photo="photo" :key="key" @delete="apagarFoto" @like="like" @unlike="unlike"></photo-card>
      </div>

    </div>

    <fab label="Adicionar Foto" icon="plus" @action="abrirCamera"></fab>

    <niduu-camera v-if="camera" :coords="coords" @close="fecharCamera" @send="adicionarFotos" @error="snackbar"></niduu-camera>

    <snackbar v-if="notification" :message="notification" @action="dismissNotification"></snackbar>

  </div>

</template>

<script>
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
        photos: {},
        camera: false,
        notification: null,
        hasPhotos: false
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
        this.$axiosHelp.loading.enable = true;
        const user = Firebase.auth().currentUser;
        const photosStorageRef = Firebase.storage().ref(`photos/${user.uid}`);
        const photosDatabaseRef = Firebase.database().ref('photos');
        const key = photosDatabaseRef.push().key;

        photosStorageRef.child(`${key}.png`).putString(send, 'data_url').then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            photosDatabaseRef.child(key).set({
              key: key,
              image: downloadURL,
              latitude: !this.coords.error ? this.coords.latitude : null,
              longitude: !this.coords.error ? this.coords.longitude : null,
              uid: user.uid,
              likes: {}
            }, error => {
              this.$axiosHelp.loading.enable = false;
              if (error) {
                this.snackbar(error.message);
              } else {
                dialog.close('send');
                this.getPhotos();
              }
            });
          })
        });

      },
      apagarFoto(photo) {
        if (!confirm("Gostaria de apagar essa foto?"))
          return;

        this.$axiosHelp.loading.enable = true;
        const photosDatabaseRef = Firebase.database().ref('photos');

        photosDatabaseRef.child(photo.key).remove(error => {
          this.$axiosHelp.loading.enable = false;
          if (error) {
            this.snackbar(error.message);
          } else {
            this.getPhotos();
          }
        });
      },
      like(photo, unlike) {
        this.$axiosHelp.loading.enable = true;

        const user = Firebase.auth().currentUser;
        const photosDatabaseRef = Firebase.database().ref('photos');

        photo.likes = photo.likes || {};

        if (unlike) {
          photo.likes[user.uid] = null;
        } else {
          photo.likes[user.uid] = {
            uid: user.uid,
            provider: user.providerData.shift()
          };
        }

        photosDatabaseRef.child(photo.key).update(photo, error => {
          this.$axiosHelp.loading.enable = false;
          if (error) {
            this.snackbar(error.message);
          } else {
            this.getPhotos();
          }
        });
      },
      unlike(photo) {
       this.like(photo, true)
      },
      snackbar(message) {
        this.notification = message;
      },
      dismissNotification() {
        this.notification = null;
      },
      getPhotos() {
        const photosRef = Firebase.database().ref('photos');
        photosRef.once('value', photos => {
          this.hasPhotos = photos.hasChildren();
          this.photos = photos.val();
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      Firebase.auth().currentUser ? next() : next({name: 'login'});
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
