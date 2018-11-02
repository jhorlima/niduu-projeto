<template>
  <div class="mdc-card">

    <div class="mdc-card__media mdc-card__media--square" :style="stylePhoto(photo)">
      <div class="mdc-card__media-content"></div>
    </div>

    <div class="mdc-card__actions">

      <button @click="like()" class="mdc-icon-button mdc-card__action mdc-card__action--icon mdc-theme--primary" title="Like">
        <mdi :icon="liked ? 'heart' : 'heart-outline'"></mdi>
      </button>

      <button v-if="owner" @click="deletePhoto()" class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon mdc-theme--primary" title="Apagar">
        <mdi icon="trash-can-outline"></mdi>
      </button>

    </div>
  </div>
</template>

<script>
  import Firebase from 'firebase';

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
          backgroundImage: `url(${photo.image})`
        };
      },
      deletePhoto() {
        this.$emit('delete', this.photo);
      },
      like() {
        this.$emit(this.liked ? 'unlike': 'like', this.photo);
      }
    },
    computed: {
      user() {
        return Firebase.auth().currentUser;
      },
      liked() {
        return typeof this.photo.likes === "object" && this.photo.likes[this.user.uid]
      },
      owner() {
        return this.photo.uid === this.user.uid
      }
    }
  };
</script>

<style>
  .mdc-card {
    border-radius: 24px 8px;
  }
</style>
