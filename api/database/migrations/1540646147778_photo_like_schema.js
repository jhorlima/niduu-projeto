'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PhotoLikeSchema extends Schema {
  up() {
    this.create('photo_likes', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.integer('photo_id').unsigned().references('id').inTable('photos');
      table.timestamps();
    });
  }

  down() {
    this.drop('photo_likes');
  }
}

module.exports = PhotoLikeSchema;
