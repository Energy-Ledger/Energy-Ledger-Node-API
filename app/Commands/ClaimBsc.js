'use strict'

const { Command } = require('@adonisjs/ace')
const BridgeService = use('My/BridgeService');

class ClaimBsc extends Command {
  static get signature () {
    return 'claim:bsc'
  }

  static get description () {
    return 'This Command Track BSC Event and Propogate on ETH'
  }

  async handle (args, options) {
    
    do
    {
      let _response = await BridgeService.claimAllToken();
      await new Promise(r => setTimeout(r, 3000));

    }while(1);
   
   }
}

module.exports = ClaimBsc
