'use strict'

/* @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Batch extends Model {
    static get table()
    {
        return 'batches';
    }
}

module.exports = Batch