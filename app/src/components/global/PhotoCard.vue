<template>
  <div class="mdc-card">

    <div class="mdc-card__media mdc-card__media--square" :style="stylePhoto(photo)">
      <div class="mdc-card__media-content"></div>
    </div>

    <div class="mdc-card__actions">

      <button class="mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">
        <mdi icon="heart-outline"></mdi>
      </button>

      <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">
        <mdi icon="share"></mdi>
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
      }
    }
  };
</script>

<style>
  .mdc-card {
    border-radius: 24px 8px;
  }
</style>
