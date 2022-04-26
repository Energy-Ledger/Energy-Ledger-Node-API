'use strict'

/* @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BridgeExchange extends Model {

     timestamp = 'false';

    static get table()
    {
        return 'bridge_exchange';
    }

    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }
}

module.exports = BridgeExchange