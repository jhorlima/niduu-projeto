'use strict';

/*
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 |
 | Http routes are entry points to your web application. You can create
 | routes for different URL's and bind Controller actions to them.
 |
 | A complete guide on routing is available here.
 | http://adonisjs.com/docs/4.0/routing
 |
 */

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => {
  return {greeting: 'Hello world in JSON'};
});

Route.get('/sessions', 'SessionController.index').middleware('auth');
Route.post('/sessions', 'SessionController.create').validator('SessionUser');

Route.post('/users', 'UserController.store').validator('StoreUser');

Route.resource('/photos', 'PhotoController').apiOnly();

Route.resource('/photos_like', 'PhotoLikeController').apiOnly().middleware('auth');
