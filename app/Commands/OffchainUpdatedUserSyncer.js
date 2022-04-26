'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainUpdatedUserSyncer extends Command {
  static get signature () {
    return 'offchain:updated-user-syncer'
  }

  static get description () {
    return 'Syncs Updated User Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {
      await CronService.getUpdatedUsers();
      await new Promise(r => setTimeout(r, 3000));

    }while(1);
  }
}

module.exports = OffchainUpdatedUserSyncer
