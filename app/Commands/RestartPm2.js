'use strict'

var pm2 = require('pm2');
const { Command } = require('@adonisjs/ace')

class RestartPm2 extends Command {
  static get signature() {
    return 'restart:pm2-services'
  }

  static get description() {
    return 'This Command Track BSC Event and Propogate on ETH'
  }

  async handle(args, options) {

    do {


      pm2.connect(function (err) {
        if (err) throw console.log(err);;
        pm2.restart('all');
        console.log("server restart successfully");
      });

      await new Promise(r => setTimeout(r, 1000 * 60 * 60 * 24));
      // await new Promise(r => setTimeout(r, 1000 * 10 * 1 * 1));

    } while (1);

  }
}

module.exports = RestartPm2
