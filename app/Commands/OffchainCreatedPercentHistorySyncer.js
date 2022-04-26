'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainCreatedPercentHistorySyncer extends Command {
  static get signature () {
    return 'offchain:percent-syncer'
  }

  static get description () {
    return 'Syncs Percentage Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {
    
      await CronTransactionHistoryService.getCreatedPercentageHistory();

      await new Promise(r => setTimeout(r, 3000));


    }while(1);
  }
}

module.exports = OffchainCreatedPercentHistorySyncer
