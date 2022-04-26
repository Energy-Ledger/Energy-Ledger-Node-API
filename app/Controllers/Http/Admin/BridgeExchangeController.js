'use strict'

const ResponseService = use('My/ResponseService');
const BridgeRecordService = use('My/BridgeRecordService');
const { validate } = use('Validator');

class BridgeExchangeController {


  constructor(){}
  // User Listing
  async createBridgeRecord({ request, response }) {

    try{

      const rules = {
        network_type: "required|integer",
        user_address: "required",
        amount: "required",
        nonce: "required",
        initiate_tx_hash: "required",
        status: "required|integer"
      }

      const validation = await validate(request.all(), rules);
     
      if (validation.fails()) {
        let _ValidationMessage = validation.messages();

        let _validationResponse = ResponseService.buildFailure(_ValidationMessage);

        return ResponseService.sendResponse(response, _validationResponse);
      }

      let _data  = request.all();

      let _activityResponse = await BridgeRecordService.create(_data);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
      // console.log(err)
      return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }

  async completeBridgeRecord({ request, response }) {

    try{

      const rules = {
        completed_tx_hash: "required",
        id: "required|integer",
        status: "required|integer"
      }

      const validation = await validate(request.all(), rules);
     
      if (validation.fails()) {
        let _ValidationMessage = validation.messages();

        let _validationResponse = ResponseService.buildFailure(_ValidationMessage);

        return ResponseService.sendResponse(response, _validationResponse);
      }

      console.log(request.all());

      let _data  = request.all();

      let _activityResponse = await BridgeRecordService.update(_data);
      return ResponseService.sendResponse(response, _activityResponse);
    }
    catch(err){
      console.log(err)
      return ResponseService.sendResponse(response, {status: 400, success: false, message: err.message});
    }
  }
}

module.exports = BridgeExchangeController
