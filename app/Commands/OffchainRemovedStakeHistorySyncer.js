'use strict'

const { Command } = require('@adonisjs/ace')
const CronService = use('My/CronService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');
const BridgeService = use('My/BridgeService');

class OffchainRemovedStakeHistorySyncer extends Command {
  static get signature () {
    return 'offchain:removed-stake-syncer'
  }

  static get description () {
    return 'Syncs Removed Stake Data from Blockchain to DB'
  }

  async handle (args, options) {
    do
    {

       let res= await BridgeService.claimAllToken();
       console.log(res);
      await new Promise(r => setTimeout(r, 3000));


    }while(1);
  }
}

module.exports = OffchainRemovedStakeHistorySyncer
