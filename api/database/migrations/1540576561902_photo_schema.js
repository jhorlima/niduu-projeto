'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PhotoSchema extends Schema {
  up() {
    this.create('photos', (table) => {
      table.increments();
      table.string('path').notNullable();
      table.decimal('latitude', 9, 6).nullable();
      table.decimal('longitude', 9, 6).nullable();
      table.integer('user_id').unsigned().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
      table.timestamps();
    });
  }

  down() {
    this.drop('photos');
  }
}

module.exports = PhotoSchema;
