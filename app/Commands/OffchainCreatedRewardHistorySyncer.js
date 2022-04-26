'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');

class OffchainCreatedRewardHistorySyncer extends Command {
  static get signature () {
    return 'offchain:reward-syncer'
  }

  static get description () {
    return 'Syncs Reward Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {


      await CronTransactionHistoryService.getCreatedRewardHistory();
      await new Promise(r => setTimeout(r, 3000));



    }while(1);
  }
}

module.exports = OffchainCreatedRewardHistorySyncer
