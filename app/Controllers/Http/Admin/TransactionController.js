'use strict'

const ResponseService = use('My/ResponseService');
const RewardHistoryService = use('My/RewardHistoryService');
const StackHistoryService = use('My/StackHistoryService');
const TransactionHistoryService = use('My/TransactionHistoryService');
const { validate } = use('Validator');

class TransactionController {


  constructor(){}
  // Reward history listing
  async rewardHistoryListing({request, response}) {

    try{

        const rules = {
            contract_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          wallet_address: _queryString.wallet_address,
          search: _queryString.search || ''
      };

      let _activityResponse = await RewardHistoryService.rewardListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  // user reward history listing
  async userRewardHistoryListing({request, response}) {

    try{

        const rules = {
            contract_address: "required",
            wallet_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          wallet_address: _queryString.wallet_address,
          search: _queryString.search || ''
      };

      let _activityResponse = await RewardHistoryService.userRewardListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  // Percentage history listing 
  async percentageHistoryListing({request, response}) {

    try{

        const rules = {
            contract_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          search: _queryString.search || ''
      };

      let _activityResponse = await RewardHistoryService.percentageListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  // create stack history listing 
  async getCreateStackListing({request, response}) {

    try{

        const rules = {
            contract_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          wallet_address: _queryString.wallet_address || '',
          search: _queryString.search || ''
      };

      let _activityResponse = await StackHistoryService.createStackListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  // remove stack history listing 
  async getRemoveStackListing({request, response}) {

    try{

        const rules = {
            contract_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          wallet_address: _queryString.wallet_address || '',
          search: _queryString.search || ''
      };

      let _activityResponse = await StackHistoryService.removeStackListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  // Elx history listing 
  async getElxHistoryListing({request, response}) {

    try{

        const rules = {
            contract_address: "required",
            wallet_address: "required"
          }
    
          const validation = await validate(request.all(), rules);
         
          if (validation.fails()) {
            let _ValidationMessage = validation.messages();
    
            let _validationResponse = ResponseService.buildFailure(_ValidationMessage);
    
            return ResponseService.sendResponse(response, _validationResponse);
          }

      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      let _criteria = {
          perPage: parseInt(_queryString.per_page || 10),
          page: parseInt(_queryString.page || 1),
          contract_address: contract_address,
          wallet_address: _queryString.wallet_address || '',
          search: _queryString.search || '',
          type: _queryString.type || ''
      };

      let _activityResponse = await TransactionHistoryService.elxListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        console.log(err)
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

}

module.exports = TransactionController
