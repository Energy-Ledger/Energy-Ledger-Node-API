'use strict'

const { Command } = require('@adonisjs/ace')
const BridgeService = use('My/BridgeService');

class ClaimEth extends Command {
  static get signature () {
    return 'claim:eth'
  }

  static get description () {
    return 'This Command Track ETH Event and Propogate on BSC'
  }

  async handle (args, options) {
    do
    {
      let _response = await BridgeService.claimEthToken();
      await new Promise(r => setTimeout(r, 3000));
 
    }while(1);
  }
}

module.exports = ClaimEth
