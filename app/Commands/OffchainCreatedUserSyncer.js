'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainCreatedUserSyncer extends Command {
  static get signature () {
    return 'offchain:user-syncer'
  }

  static get description () {
    return 'Syncs User Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {
      await CronService.getCreatedUsers();
      await new Promise(r => setTimeout(r, 3000));


    }while(1);
  }
}

module.exports = OffchainCreatedUserSyncer
