'use strict'

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/auth/providers/AuthProvider',
  "@adonisjs/mail/providers/MailProvider",
  '@adonisjs/validator/providers/ValidatorProvider',
  "@adonisjs/drive/providers/DriveProvider",
  'adonis-acl/providers/AclProvider',

]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider',
  'adonis-acl/providers/CommandsProvider',
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Role: 'Adonis/Acl/Role',
  Permission: 'Adonis/Acl/Permission',
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  "App/Commands/ClaimBsc",
  "App/Commands/ClaimEth",
  "App/Commands/OffchainCreatedBatchSyncer",
  "App/Commands/OffchainCreatedPercentHistorySyncer",
  "App/Commands/OffchainCreatedRewardHistorySyncer",
  "App/Commands/OffchainCreatedStakeHistorySyncer",
  "App/Commands/OffchainCreatedUserSyncer",
  "App/Commands/OffchainRemovedStakeHistorySyncer",
  "App/Commands/OffchainUpdatedUserSyncer",
  "App/Commands/ClaimAllToken",
  "App/Commands/RestartPm2",

]

const { ioc } = require('@adonisjs/fold')
const ResponseService = require('../app/Services/ResponseService')
const UserService = require('../app/Services/UserService')
const BatchService = require("../app/Services/BatchService")
const BlockchainService = require("../app/Services/BlockchainService")
const CronService = require("../app/Services/CronService")
const CronTransactionHistoryService = require("../app/Services/CronTransactionHistoryService")
const BridgeService = require("../app/Services/BridgeService")
const BridgeRecordService = require("../app/Services/BridgeRecordService")
const RewardHistoryService = require('../app/Services/RewardHistoryService')
const StackHistoryService = require('../app/Services/StackHistoryService')
const TransactionHistoryService = require('../app/Services/TransactionHistoryService')

ioc.bind('My/ResponseService', function(app) {
  return new ResponseService();
})
ioc.bind("My/BlockchainService", (app) => {
  return new BlockchainService(app);
})

ioc.bind("My/CronService", (app) => {
  return new CronService(app);
})
ioc.bind("My/CronTransactionHistoryService", (app) => {
  return new CronTransactionHistoryService(app);
})

ioc.bind("My/UserService", (app) => {
  return new UserService(app);
})
ioc.bind("My/BatchService", (app) => {
  return new BatchService(app);
})
ioc.bind("My/BridgeService", (app) => {
  return new BridgeService(app);
})
ioc.bind("My/RewardHistoryService", (app) => {
  return new RewardHistoryService(app);
})

ioc.bind("My/StackHistoryService", (app) => {
  return new StackHistoryService(app);
})

ioc.bind("My/TransactionHistoryService", (app) => {
  return new TransactionHistoryService(app);
})

ioc.bind("My/BridgeRecordService", (app) => {
  return new BridgeRecordService(app);
})

ioc.bind("User", (app) => {
  return new User(app);
})

ioc.bind("BridgeExchange", (app) => {
  return new BridgeExchange(app);
})

ioc.bind("RewardHistory", (app) => {
  return new RewardHistory(app);
})

ioc.bind("PercentageHistory", (app) => {
  return new PercentageHistory(app);
})

ioc.bind("CreateStackHistory", (app) => {
  return new CreateStackHistory(app);
})

ioc.bind("RemoveStackHistory", (app) => {
  return new RemoveStackHistory(app);
})

ioc.bind("ElxTransactionHistory", (app) => {
  return new ElxTransactionHistory(app);
})



module.exports = { providers, aceProviders, aliases, commands }
