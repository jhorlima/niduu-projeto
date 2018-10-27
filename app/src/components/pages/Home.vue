<template>

  <div class="mdc-layout-grid">

    <div class="mdc-layout-grid__inner">

      <div class="mdc-layout-grid__cell" v-for="photo in photos">

        <photo-card :photo="photo"></photo-card>

      </div>

    </div>

    <fab label="Adicionar Foto" icon="plus"></fab>

  </div>

</template>

<script>
  import Axios from 'axios';
  import PhotoCard from './../global/PhotoCard';
  import Fab from './../global/Fab';

  export default {
    name: "Home",
    components: {
      PhotoCard,
      Fab
    },
    data() {
      return {
        photos: []
      };
    },
    beforeRouteEnter(to, from, next) {
      Axios.get('/photos').then(({data}) => {
        next((component) => {
          component.photos = data;
        });
      }).catch(error => {

        let status = 400;
        let statusText = error.message;
        let message = error.message;

        if (error.response) {
          status = error.response.status;
          statusText = error.response.statusText;
        }

        next({
          name: 'error',
          params: {
            error: status,
            title: `${status} - ${statusText}`,
            message: message,
          },
          redirect: true
        });
      });
    }
  };
</script>
