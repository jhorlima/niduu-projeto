<template>
  <div class="mdc-card">

    <div class="mdc-card__media mdc-card__media--square" :style="stylePhoto(photo)">
      <div class="mdc-card__media-content">
        <div class="mdc-card__header">
          <div class="mdc-card-avatar animated bounceIn" v-show="showProfilePhoto">
            <img :src="photo.user_provider.photoURL" @load="profilePhotoLoaded">
          </div>
          <div class="mdc-card-header-text animated fadeInDown">
            <span class="mdc-typography--subtitle2" v-text="photo.user_provider.displayName"></span>
            <span class="mdc-typography--caption" v-text="photo.user_provider.email"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="mdc-card__desc">
      <span class="mdc-typography--subtitle2" v-text="likes"></span>
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
    data(){
      return {
        showProfilePhoto: false,
      };
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
      },
      profilePhotoLoaded(){
        this.showProfilePhoto = true;
      },
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
      },
      likes() {
        if (typeof this.photo.likes === "object") {
          let likes = Object.keys(this.photo.likes).map(uid => this.photo.likes[uid]).filter(like => like);

          if (likes.length === 1) {
            return `${likes[0].provider.displayName} curtiu essa foto`;
          } else if (likes.length === 2) {
            return `${likes[0].provider.displayName} e ${likes[1].provider.displayName} curtiram essa foto`;
          } else if (likes.length > 2) {
            return `${likes.length} curtiram essa foto`
          }

        }

        return "esperando a primeira curtida";
      }
    }
  };
</script>

<style>

  .mdc-card {
    border-radius: 24px 8px !important;
  }

  .mdc-card .mdc-card__desc {
    padding: 0.5rem 1rem 0;
  }

  .mdc-card__media-content > .mdc-card__header {
    border-radius: 24px 8px;
    background-image: linear-gradient(to top, rgba(255, 0, 0, 0), rgba(80, 80, 80, 1));
    padding: 8px;
     -webkit-box-orient: horizontal;
    -webkit-flex-direction: row;
    flex-direction: row;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-direction: normal;
  }

  .mdc-card-avatar {
    width: 40px;
    height: 40px;
  }

  .mdc-card__media-content .mdc-card__header img{
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 0;
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    border-radius: 50%;
    border-color: white;
    border-style: solid;
    border-width: 1.5px;
  }

  .mdc-card__media-content .mdc-card__header:first-child .mdc-card-avatar {
    margin-right: 12px;
  }

  .mdc-card__media-content .mdc-card__header .mdc-card-avatar+.mdc-card-header-text {
    max-height: 40px;
  }

  .mdc-card__media-content .mdc-card__header .mdc-card-header-text{
    color: white;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
  }
</style>
