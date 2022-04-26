'use strict'

const { Command } = require('@adonisjs/ace')
const BridgeService = use('My/BridgeService');

class ClaimAllToken extends Command {
  static get signature () {
    return 'claim:allToken'
  }

  static get description () {
    return 'This Command Track BSC Event and Propogate on ETH'
  }

  async handle (args, options) {
    
    do
    {
      let _response = await BridgeService.claimAllToken();
      console.log(_response);
      await new Promise(r => setTimeout(r, 3000));

    }while(1);
   
   }
}

module.exports = ClaimAllToken
