'use strict'
const { validate } = use('Validator');
const ResponseService = use('My/ResponseService');
const CronService = use('My/CronService');
const BridgeService = use('My/BridgeService');
const CronTransactionHistoryService = use('My/CronTransactionHistoryService');


class CronController {

    constructor(){}

    async getUserListing({request,response})
    {       
        let _queryString = request.all();
        let block_number = Number(_queryString.block_number) || '';

        if(block_number == ''){
            return "Block number is required";
        }
        let _activityResponse = await CronService.getCreatedUsers(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
    }
    async getUpdatedUsers({request,response})
    {       
        let _queryString = request.all();
        let block_number = Number(_queryString.block_number) || '';

        if(block_number == ''){
            return "Block number is required";
        }

        let _activityResponse = await CronService.getUpdatedUsers(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
    }
    async insertBatchListing({request,response})
    {       
        let _queryString = request.all();
        let block_number = Number(_queryString.block_number) || '';

        if(block_number == ''){
            return "Block number is required";
        }

        let _activityResponse = await CronService.insertBatchListing(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
    }
    /* Claim BSC Token */
    async claimBscToken({request,response})
    {       
        let _activityResponse = await BridgeService.claimBscToken();
        return ResponseService.sendResponse(response, _activityResponse);
    }
    /* Claim ETH Token */
    async claimEthToken({request,response})
    {       
    let _activityResponse = await BridgeService.claimEthToken();
        return ResponseService.sendResponse(response, _activityResponse);
    }
    async claimAllToken({request,response})
    {       
    let _activityResponse = await BridgeService.claimAllToken();
        return ResponseService.sendResponse(response, _activityResponse);
    }

    /* Insert Reward History */
    async insertRewardHistory({request,response})
    {
        try{

        let _queryString = request.all();
        let block_number = Number(_queryString.block_number) || '';

        if(block_number == ''){
            return "Block number is required";
        }
        let _activityResponse = await CronTransactionHistoryService.getCreatedRewardHistory(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
        }
        catch(err){
            console.log(err)
        }
    }

    /* Insert Percentage History */
    async insertPercentageHistory({request,response})
    {     
    
    let _queryString = request.all();
    let block_number = Number(_queryString.block_number) || '';

    if(block_number == ''){
        return "Block number is required";
    }

    let _activityResponse = await CronTransactionHistoryService.getCreatedPercentageHistory(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
    }

    /* Insert Create Stack History Data */
    async insertCreateStakeHistory({request,response})
    {
        try{

        let _queryString = request.all();
        let block_number = Number(_queryString.block_number) || '';

        if(block_number == ''){
            return "Block number is required";
        }

        let _activityResponse = await CronTransactionHistoryService.getCreatedStakeHistory(block_number);
        return ResponseService.sendResponse(response, _activityResponse);
        }
        catch(err){
            console.log(err)
        }
    }

     /* Insert Remove Stack History Data */
     async insertRemoveStakeHistory({request,response})
     {
         try{

            let _queryString = request.all();
            let block_number = Number(_queryString.block_number) || '';

            if(block_number == ''){
                return "Block number is required";
            }
            let _activityResponse = await CronTransactionHistoryService.getRemoveStakeHistory(block_number);
            return ResponseService.sendResponse(response, _activityResponse);
         }
         catch(err){
             console.log(err)
         }
     }

     /* Insert Elx History Data */
    //  async insertElxHistory({request,response})
    //  {
    //      try{
    //      let _activityResponse = await CronTransactionHistoryService.getElxHistory();
    //      return ResponseService.sendResponse(response, _activityResponse);
    //      }
    //      catch(err){
    //          console.log(err)
    //      }
    //  }
}

module.exports = CronController
