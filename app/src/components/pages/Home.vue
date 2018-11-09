<template>

  <div class="layout-column flex">

    <div class="layout-row layout-wrap flex layout-padding" :class="layout">

      <div v-if="!photos.length">
        <img src="@/assets/birdniduu.png" width="300px" alt="Bird da Niduu">
        <p align="center">Não há fotos para serem exibidas no momento.</p>
      </div>

      <div class="flex flex-xs-100 flex-gt-xs-50 flex-gt-sm-33 flex-gt-lg-25" v-for="photo in sortedPhotos">
        <photo-card :photo="photo" :key="photo.key" @delete="apagarFoto" @like="like" @unlike="unlike"></photo-card>
      </div>

    </div>

    <fab label="Adicionar Foto" icon="plus" @action="abrirCamera"></fab>

    <niduu-camera v-if="camera" :coords="coords" @close="fecharCamera" @send="adicionarFotos" @error="snackbar"></niduu-camera>

    <snackbar v-if="notification" :message="notification" @action="dismissNotification"></snackbar>

    <confirm-dialog v-if="askNotificationPush" @no="denyNotifications" @yes="allowNotifications">
      <h2 slot="title" class="mdc-dialog__title">Usar Notificações</h2>

      <p>
        Para uma melhor experiência com o SnapNiduu, recomendamos que você permita o uso de notificações por nosso aplicativo.
      </p>

      <check-box v-model="noAskNotificationAgain" id="noAsk" :required="false">Não perguntar novamente</check-box>

      <span slot="no">Fechar</span>
      <span slot="yes">Permitir</span>

    </confirm-dialog>

  </div>

</template>

<script>
  import md5 from 'md5';
  import Firebase from 'firebase';

  import Fab from '../global/Fab';
  import Snackbar from '../global/Snackbar';
  import CheckBox from '../global/CheckBox';
  import PhotoCard from '../global/PhotoCard';
  import NiduuCamera from '../global/NiduuCamera';
  import ConfirmDialog from '../global/ConfirmDialog';

  export default {
    name: "Home",
    components: {
      Fab,
      Snackbar,
      CheckBox,
      PhotoCard,
      NiduuCamera,
      ConfirmDialog,
    },
    data() {
      return {
        coords: {},
        photos: [],
        camera: false,
        hasPhotos: false,
        notification: null,
        askNotificationPush: false,
        noAskNotificationAgain: false,
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
              date: Date.now(),
              key: key,
              image: downloadURL,
              latitude: !this.coords.error ? this.coords.latitude : null,
              longitude: !this.coords.error ? this.coords.longitude : null,
              uid: user.uid,
              user_provider: user.providerData.find(provider => provider),
              likes: {}
            }).then(() => {
              dialog.close('send');
              this.getPhotos();
            }).catch(err => {
              this.snackbar(err.message);
            }).finally(() => {
              this.$axiosHelp.loading.enable = false;
            });
          });
        });

      },
      apagarFoto(photo) {
        if (!confirm("Gostaria de apagar essa foto?"))
          return;

        this.$axiosHelp.loading.enable = true;
        const photosDatabaseRef = Firebase.database().ref('photos');

        photosDatabaseRef.child(photo.key).remove().then(() => {
          this.getPhotos();
        }).catch(err => {
          this.snackbar(err.message);
        }).finally(() => {
          this.$axiosHelp.loading.enable = false;
        });
      },
      like(photo, unlike) {
        this.$axiosHelp.loading.enable = true;

        const user = Firebase.auth().currentUser;
        const photosDatabaseRef = Firebase.database().ref(`photos/${photo.key}/likes/${user.uid}`);

        if (unlike) {
          photosDatabaseRef.remove().then(() => {
            this.getPhotos();
          }).catch(err => {
            this.snackbar(err.message);
          }).finally(() => {
            this.$axiosHelp.loading.enable = false;
          });
        } else {
          photosDatabaseRef.set({
            uid: user.uid,
            provider: user.providerData.find(provider => provider)
          }).then(() => {
            this.getPhotos();
          }).catch(err => {
            this.snackbar(err.message);
          }).finally(() => {
            this.$axiosHelp.loading.enable = false;
          });
        }
      },
      unlike(photo) {
        this.like(photo, true);
      },
      snackbar(message) {
        this.notification = null;
        this.notification = message;
      },
      dismissNotification() {
        this.notification = null;
      },
      getPhotos() {
        //
      },
      allowNotifications(dialog) {
        dialog.close();
        localStorage.setItem('noAskNotificationAgain', this.noAskNotificationAgain ? "1" : "0");
        dialog.listen('MDCDialog:closed', () => {
          this.askNotificationPush = false;
          Firebase.messaging().requestPermission().then(() => {
            this.getNotificationToken();
          });
        });
      },
      denyNotifications(dialog) {
        dialog.close();
        localStorage.setItem('noAskNotificationAgain', this.noAskNotificationAgain ? "1" : "0");
        dialog.listen('MDCDialog:closed', () => {
          this.askNotificationPush = false;
        });
      },
      getNotificationToken() {
        Firebase.messaging().getToken().then(token => {
          const hash = md5(token);
          const user = Firebase.auth().currentUser;
          const tokensDatabaseRef = Firebase.database().ref(`tokens_messaging/${user.uid}/tokens/${hash}`);
          localStorage.setItem('notificationToken', token);
          localStorage.setItem('notificationHash', hash);
          tokensDatabaseRef.set(token)
            .then(() => {})
            .catch(err => {
              this.snackbar(err.message);
            });
        }).catch(err => {
          this.snackbar(err.message);
        });
      }
    },
    computed: {
      layout() {
        return {
          'layout-align-center-center': !this.photos.length,
          'layout-align-none-none': !this.photos.length,
        };
      },
      sortedPhotos(){
        return this.photos.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    },
    beforeRouteEnter(to, from, next) {
      Firebase.auth().currentUser ? next() : next({name: 'login'});
    },
    created() {
      this.getPhotos();

      const noAskNotificationAgain = localStorage.getItem('noAskNotificationAgain') || "0";
      this.noAskNotificationAgain = noAskNotificationAgain === "1";

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((position) => {
          this.coords = position.coords;
        }, () => {
          this.coords.error = "Seu navegador recusou compartilhar a localização!";
        });

      } else {
        this.coords.error = "Seu navegador não permite localização!";
      }

      const photosRef = Firebase.database().ref('photos').limitToLast(25).orderByChild('date');

      photosRef.on('child_added', snapshot => {
        this.photos.unshift(snapshot.val());
      });

      photosRef.on('child_removed', snapshot => {
        const photo = this.photos.find(photo => snapshot.key === photo.key);
        const index = this.photos.indexOf(photo);

        if (index >= 0) {
          this.photos.splice(index, 1);
        }
      });

      photosRef.on('child_changed', snapshot => {
        const photo = this.photos.find(photo => snapshot.key === photo.key);
        const index = this.photos.indexOf(photo);

        if (index >= 0) {
          this.photos.splice(index, 1);
          this.photos.unshift(snapshot.val());
        }
      });
    },
    mounted() {
      this.askNotificationPush = Firebase.messaging.isSupported() && Notification.permission !== "granted" && !this.noAskNotificationAgain;

      const messaging = Firebase.messaging();

      messaging.onMessage(payload => {
        this.snackbar(payload.notification.body);
      });

      if (Notification.permission === "granted") {
        this.getNotificationToken();
      }

      messaging.onTokenRefresh(() => this.getNotificationToken());
    }
  };
</script>
