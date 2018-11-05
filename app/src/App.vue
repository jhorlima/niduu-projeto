<template>

  <div id="app" class="layout-column flex">

    <mdc-header></mdc-header>

    <main class="layout-column flex main-content">

      <router-view></router-view>

    </main>

  </div>

</template>

<script>
  import Header from './components/struct/Header';

  export default {
    name: 'App',
    components: {
      'mdc-header': Header
    }
  };
</script>

<style>

  .main-content {
    position: relative;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

</style>
