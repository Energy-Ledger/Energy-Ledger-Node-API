'use strict'

const { post } = require('@adonisjs/framework/src/Route/Manager');

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
// const apiPrefixV1 = 'api/';

const apiPrefix = "api/";


// Route.get("login", "Admin/AuthController.login")


//Admin auth routes

function cronGroup() {
    Route.get("create-user", "CronController.getUserListing");
    Route.get("update-user", "CronController.getUpdatedUsers");

    Route.get("create-batch", "CronController.insertBatchListing");

    Route.get("claim-elx-with-bsc", "CronController.claimBscToken");
    Route.get("claim-elx-with-eth", "CronController.claimEthToken");
    Route.get("claim-all-token", "CronController.claimAllToken");

    Route.get("insert-reward-history", "CronController.insertRewardHistory");
    Route.get("insert-percentage-history", "CronController.insertPercentageHistory");

    Route.get("insert-create-stake-history", "CronController.insertCreateStakeHistory");
    Route.get("insert-remove-stake-history", "CronController.insertRemoveStakeHistory");

    // Route.post("insert-elx-history", "CronController.insertElxHistory");

}
Route.group(cronGroup).prefix(`${apiPrefix}cron`)

// users routes

function users() {
    Route.get("/", "Admin/UserController.listing");

}
Route.group(users).prefix(`${apiPrefix}users`)

// Batch routes

function userBatches() {
    Route.get("/", "Admin/BatchController.listing");

}
Route.group(userBatches).prefix(`${apiPrefix}batches`)

function batches() {
    Route.get("/", "Admin/BatchController.userBatchListing");

}
Route.group(batches).prefix(`${apiPrefix}user-batches`)

// reward history Routes
function rewards() {
    Route.get("/reward-history", "Admin/TransactionController.rewardHistoryListing");

    Route.get("/user-reward-history", "Admin/TransactionController.userRewardHistoryListing");

    Route.get("/percentage-history", "Admin/TransactionController.percentageHistoryListing");

    // stack history Routes
    Route.get("/create-stack-history", "Admin/TransactionController.getCreateStackListing");
    Route.get("/remove-stack-history", "Admin/TransactionController.getRemoveStackListing");

    // elx history listing
    Route.get("/elx-history", "Admin/TransactionController.getElxHistoryListing");
}
Route.group(rewards).prefix(`${apiPrefix}transaction`)


// Bridge Record Routes

function bridge() {
    Route.post("/create-bridge-record", "Admin/BridgeExchangeController.createBridgeRecord");
    Route.post("/complete-bridge-record", "Admin/BridgeExchangeController.completeBridgeRecord");

}
Route.group(bridge).prefix(`${apiPrefix}`)

