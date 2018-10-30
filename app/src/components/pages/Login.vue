<template>
  <div>
    <form @submit.prevent="login">

      <text-field v-model="form.username" id="username">Nome de Usuário</text-field>

      <text-field v-model="form.password" id="password" type="password">Senha</text-field>

      <router-link :to="{name: 'singup'}" class="mdc-button mdc-button--outlined" ref="singup">
        Cadastrar
      </router-link>

      <button class="mdc-button mdc-button--raised" type="submit" ref="login">
        Entrar
      </button>

    </form>

    <snackbar v-if="notification" :message="notification" @action="dismissNotification()"></snackbar>

  </div>
</template>

<script>
  import Axios from 'axios';
  import {MDCRipple} from '@material/ripple';

  import TextField from '../global/TextField';
  import Snackbar from '../global/Snackbar';

  export default {
    name: "Login",
    components: {TextField, Snackbar},
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        notification: null
      };
    },
    methods: {
      login() {

        this.dismissNotification();

        Axios.post('/sessions', this.form).then(({data}) => {
          localStorage.setItem('niduu-token', data.token);
          this.$router.push({name: 'home'});
        }).catch(error => {
          this.notification = error.message;
        });

      },
      dismissNotification() {
        this.notification = null;
      }
    },
    beforeRouteEnter(to, from, next) {
      const token = localStorage.getItem('niduu-token');
      return token ? next({name: 'home'}) : next();
    },
    mounted() {
      new MDCRipple(this.$refs.singup.$el);
      new MDCRipple(this.$refs.login);
    },
  };
</script>
