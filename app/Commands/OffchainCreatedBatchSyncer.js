'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainCreatedBatchSyncer extends Command {
  static get signature () {
    return 'offchain:batch-syncer'
  }

  static get description () {
    return 'Syncs Batch Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {

      await CronService.insertBatchListing();
      await new Promise(r => setTimeout(r, 3000));


    }while(1);
  }
}

module.exports = OffchainCreatedBatchSyncer
