'use strict'
const ResponseService = use('My/ResponseService');
const BatchService = use('My/BatchService');

class BatchController {


  constructor(){}
  // User Listing
  async listing({request, response}) {

    try{
      let _queryString = request.all();

      let contract_address = _queryString.contract_address;

      if(contract_address === ''){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: 'Contract address not found'});
      }

      let _criteria = {
          perPage: parseInt(_queryString.per_page),
          page: parseInt(_queryString.page),
          search: _queryString.search,
          contract_address: contract_address,
      };

      let _activityResponse = await BatchService.listing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  async userBatchListing({request, response}) {

    try{
      let _queryString = request.all();

      let contract_address = _queryString.contract_address || '';
      let role = _queryString.role || '';
      let wallet_address = _queryString.wallet_address || '';

      if(contract_address === ''){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: 'Contract address not found'});
      }

      if(role === ''){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: 'Role not found'});
      }

      if(wallet_address === ''){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: 'Wallet address not found'});
      }

      let _criteria = {
          perPage: parseInt(_queryString.per_page),
          page: parseInt(_queryString.page),
          search: _queryString.search,
          contract_address: contract_address,
          role: role,
          wallet_address: wallet_address,
      };

      let _activityResponse = await BatchService.userBatchListing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
        return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }
}

module.exports = BatchController
