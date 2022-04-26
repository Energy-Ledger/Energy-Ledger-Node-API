'use strict'

/* @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CreateStackHistory extends Model {
    static get table()
    {
        return 'create_stake_history';
    }

    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }
}

module.exports = CreateStackHistory