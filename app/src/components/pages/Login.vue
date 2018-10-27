<template>
  <div>
    <text-field label="Nome de Usuário" v-model="form.username" id="username"></text-field>
    <text-field label="Senha" v-model="form.password" id="password"></text-field>
  </div>
</template>

<script>
  import TextField from '../global/TextField';

  export default {
    name: "Login",
    components: {TextField},
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      };
    }
  };
</script>

<style scoped>

</style>
