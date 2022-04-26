'use strict'

/* @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RewardHistory extends Model {
    static get table()
    {
        return 'reward_history';
    }

    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }
}

module.exports = RewardHistory