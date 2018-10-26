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
  import PhotoCard from './../global/PhotoCard';
  import Fab from './../global/Fab';

  export default {
    name: "Home",
    components: {
      PhotoCard,
      Fab
    },
    created: function () {
      this.$http.get('http://localhost:3333/photos')
        .then(response => {
          this.photos = response.data;
        });
    },
    data() {
      return {
        photos: []
      };
    }
  };
</script>
