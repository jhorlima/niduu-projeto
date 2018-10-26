<template>

  <div id="app" class="mdc-drawer-app-content">

    <mdc-header></mdc-header>

    <main class="main-content" id="main-content">

      <div class="mdc-top-app-bar--dense-fixed-adjust">

        <router-view></router-view>

      </div>

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

  .mdc-drawer-app-content {
    flex: auto;
    overflow: auto;
  }

  .main-content {
    overflow: auto;
    height: 100%;
  }

</style>
