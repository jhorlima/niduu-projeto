import Firebase from 'firebase';
import Home from './../components/pages/Home';
import Error from '../components/pages/ErrorPage';
import Login from '../components/pages/Login';
import Signup from '../components/pages/Singup';

export default [{
  path: '/',
  name: 'home',
  component: Home
}, {
  path: '/login',
  name: 'login',
  component: Login
}, {
  path: '/logoff',
  name: 'logoff',
  beforeRouteEnter(to, from, next) {
    if (confirm("Deseja realmente desconectar?")) {
      Firebase.auth().signOut().then(() => {
        next({name: 'login'});
      }).catch(() => {
        next(false);
      });
    } else {
      next(false);
    }
  }
}, {
  path: '/singup',
  name: 'singup',
  component: Signup
}, {
  path: '/error/:error',
  name: 'error',
  component: Error,
  props: true
}, {
  path: '*',
  name: 'error404',
  component: Error,
  props(route) {
    return {
      title: "404 - Página não encontrada.",
      message: `O endereço <strong>${route.fullPath}</strong> não foi encontrado. Verifique se você digitou o endereço 
                corretamente e tente novamente.`
    };
  }
}];
