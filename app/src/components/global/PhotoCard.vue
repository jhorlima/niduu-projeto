<template>
  <div class="mdc-card">

    <div class="mdc-card__media mdc-card__media--square" :style="stylePhoto(photo)">
      <div class="mdc-card__media-content"></div>
    </div>

    <div class="mdc-card__actions">

      <button @click="like()" class="mdc-icon-button mdc-card__action mdc-card__action--icon mdc-theme--primary" title="favorite">
        <mdi :icon="photo.liked ? 'heart' : 'heart-outline'"></mdi>
      </button>

      <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon mdc-theme--primary" title="Share">
        <mdi icon="share"></mdi>
      </button>

      <button v-if="photo.owner" @click="deletePhoto()" class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon mdc-theme--primary" title="Trash">
        <mdi icon="trash-can-outline"></mdi>
      </button>

    </div>
  </div>
</template>

<script>
  export default {
    name: "PhotoCard",
    props: {
      photo: {
        type: Object,
        required: true
      }
    },
    methods: {
      stylePhoto(photo) {
        return {
          backgroundImage: `url(${photo.url})`
        };
      },
      deletePhoto() {
        this.$emit('delete', this.photo);
      },
      like() {
        this.$emit(this.photo.liked ? 'unlike': 'like', this.photo);
      }
    }
  };
</script>

<style>
  .mdc-card {
    border-radius: 24px 8px;
  }
</style>
