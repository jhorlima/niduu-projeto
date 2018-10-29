<template>

  <div class="mdc-layout-grid">

    <div class="mdc-layout-grid__inner">

      <div class="mdc-layout-grid__cell" v-for="photo in photos">

        <photo-card :photo="photo" class="animated fadeInUp"></photo-card>

      </div>

    </div>

    <fab label="Adicionar Foto" icon="plus" @action="abrirCamera"></fab>

    <niduu-camera v-if="camera" @close="fecharCamera" @send="adicionarFotos"></niduu-camera>

  </div>

</template>

<script>
  import {MDCRipple} from '@material/ripple';
  import Axios from 'axios';

  import PhotoCard from '../global/PhotoCard';
  import NiduuCamera from '../global/NiduuCamera';
  import Fab from '../global/Fab';

  export default {
    name: "Home",
    components: {
      PhotoCard,
      NiduuCamera,
      Fab
    },
    data() {
      return {
        photos: [],
        camera: false
      };
    },
    methods: {
      abrirCamera() {
        this.camera = true;
      },
      fecharCamera() {
        this.camera = false;
      },
      adicionarFotos(foto) {
        this.photos.unshift(foto);
      }
    },
    beforeRouteEnter(to, from, next) {
      const token = localStorage.getItem('niduu-token');
      return token ? next() : next({name: 'login'});
    },
    created() {
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
  };
</script>
