'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthLogsSchema extends Schema {
  up () {
    this.create('auth_logs', (table) => {
      table.increments('id')
      table.integer('user_id')
      table.varchar('ip_address')
      table.string('browser')
      table.integer('status')
      table.text('remark').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('auth_logs')
  }
}

module.exports = AuthLogsSchema
