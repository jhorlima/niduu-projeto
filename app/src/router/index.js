import Home from './../components/pages/Home';
import Error404 from './../components/pages/Error404';

export default [{
  path: '/',
  name: 'home',
  component: Home
}, {
  path: '*',
  name: 'error404',
  component: Error404
}];
