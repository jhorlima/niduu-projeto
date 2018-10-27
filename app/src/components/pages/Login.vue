<template>
  <flex-row tag="div" align-h="center" align-v="center">
    <flex-col tag="div" align-v="center" align-h="center">
      <text-field label="Nome de Usuário" v-model="form.username" id="username"></text-field>
      <text-field label="Senha" v-model="form.password" id="password"></text-field>
    </flex-col>
  </flex-row>
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
