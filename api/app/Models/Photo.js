'use strict';

const Env = use('Env');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');
const Database = use('Database');

class Photo extends Model {

  static get computed() {
    return ['url'];
  }

  getUrl({path}) {
    return `${Env.get('APP_URL')}/photos/uploads/${path}`;
  }

  static scopeNearBy(query, latitude, longitude, distance) {

    const haversine = `(6371 * acos(cos(radians(${latitude}))
    * cos(radians(latitude))
    * cos(radians(longitude)
    - radians(${longitude}))
    + sin(radians(${latitude}))
    * sin(radians(latitude))))`;

    return query.select('*', Database.raw(`${haversine} as distance`)).whereRaw(`${haversine} < ${distance}`);
  }

  user() {
    return this.belongsTo('App/Models/User');
  }

  likes() {
    return this.belongsToMany('App/Models/User')
      .pivotModel('App/Models/PhotoLike');
  }

}

module.exports = Photo;
