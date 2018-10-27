'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PhotoSchema extends Schema {
  up() {
    this.create('photos', (table) => {
      table.increments();
      table.string('location').nullable();
      table.string('path').notNullable();
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamps();
    });
  }

  down() {
    this.drop('photos');
  }
}

module.exports = PhotoSchema;
