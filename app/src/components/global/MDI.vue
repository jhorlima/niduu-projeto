<template>
  <i class="mdi" :class="`mdi-${icon}`"></i>
</template>

<script>
  export default {
    name: "MDI",
    props: {
      icon: {
        type: String,
        required: true
      }
    }
  };
</script>
