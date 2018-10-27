'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class PhotoLike extends Model {

  photo() {
    return this.belongsTo('App/Models/Photo');
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

}

module.exports = PhotoLike;
