'use strict'
const ResponseService = use('My/ResponseService');
const UserService = use('My/UserService');

class UserController {


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
          role: _queryString.role,
          contract_address: contract_address,
      };
      let _activityResponse = await UserService.listing(_criteria);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
      return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }
}

module.exports = UserController
