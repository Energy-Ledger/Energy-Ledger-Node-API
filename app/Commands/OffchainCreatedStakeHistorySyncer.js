'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainCreatedStakeHistorySyncer extends Command {
  static get signature () {
    return 'offchain:stake-syncer'
  }

  static get description () {
    return 'Syncs Stake Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {
    
      await CronTransactionHistoryService.getCreatedStakeHistory();
      await new Promise(r => setTimeout(r, 3000));


    }while(1);
  }
}

module.exports = OffchainCreatedStakeHistorySyncer
