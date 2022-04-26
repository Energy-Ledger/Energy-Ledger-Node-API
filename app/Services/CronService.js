
class CronService {

  constructor(app) {

    this.ResponseService = app.use("My/ResponseService");
    this.Config = app.use("Config");

    this.BlockchainService = app.use("My/BlockchainService");
    this.UserService = app.use("My/UserService");
    this.BatchService = app.use("My/BatchService");
    this.BlockSetting = app.use("App/Models/BlockSetting");

  }

  // EVENT:- create users 
  async getCreatedUsers(block_number) {
    try {

      let _tokenInstanceResp =
        await this.BlockchainService.getSupplyChainJsonRpcContractInstance();

      if (_tokenInstanceResp.status == "failure") {
        return this.ResponseService.buildFailure(
          `Something went wrong while verifying the contract address, please try again later`
        );
      }
      console.log('block_number', block_number)
      let _usersListResponse = await _tokenInstanceResp.data.queryFilter(
        "UserCreated", block_number, block_number
      );

      if (_usersListResponse.length > 0) {
        for (let index = 0; index < _usersListResponse.length; index++) {

          var element2 = {
            profileHashUrl: _usersListResponse[index].args.profileHash,
            name: _usersListResponse[index].args.name,
            email: _usersListResponse[index].args.email,
            contactNo: _usersListResponse[index].args.contactNo,
            role: _usersListResponse[index].args.role,
            walletAddr: _usersListResponse[index].args.user,
            status: _usersListResponse[index].args.isActive,
            extraData: _usersListResponse[index].args.extraData,
            contractAddress: this.Config.get("app.supplyChainContractAddress"),
            create_block: _usersListResponse[index].blockNumber,
            tx_hash: _usersListResponse[index].transactionHash
          };
          try{

            let v = await this.UserService.create(element2, null);
            console.log(v);
            if (v.status !== "success") {
              console.log("failed to create a user");
              break;
            }
          }catch(e){
            console.log("failed to create a user");
            break;
          }

        }

      }
      
      return this.ResponseService.buildSuccess("User inserted", _usersListResponse.length)

    }
    catch (error) {
      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
  }
  async getUpdatedUsers(block_number) {
    try {

      let _tokenInstanceResp =
        await this.BlockchainService.getSupplyChainJsonRpcContractInstance();
      let latestBlockNumber = await this.BlockchainService.getLatestBlock();
      if (_tokenInstanceResp.status == "failure") {
        return this.ResponseService.buildFailure(
          `Something went wrong while verifying the contract address, please try again later`
        );
      }
  
      let _usersListResponse = await _tokenInstanceResp.data.queryFilter(
        "UserUpdated", block_number, block_number
      );

      if (_usersListResponse.length > 0) {
        for (let index = 0; index < _usersListResponse.length; index++) {
          if (_usersListResponse[index].args.role !== 'admin') {

            var element = {
              profileHashUrl: _usersListResponse[index].args.profileHash,
              name: _usersListResponse[index].args.name,
              email: _usersListResponse[index].args.email,
              contactNo: _usersListResponse[index].args.contactNo,
              role: _usersListResponse[index].args.role,
              walletAddr: _usersListResponse[index].args.user,
              status: _usersListResponse[index].args.isActive,
              extraData: _usersListResponse[index].args.extraData,
              contractAddress: this.Config.get("app.supplyChainContractAddress"),
              update_block: _usersListResponse[index].blockNumber,
            };
            try{

              let v = await this.UserService.update(element, null);
              if (v.status !== "success") {
                console.log("failed to update the user");
                break;
              }
            }
            catch(e){
              console.log("failed to update the user");
              break;
            }
          }

        }

      }

      return this.ResponseService.buildSuccess("User updated", _usersListResponse.length)

    }
    catch (error) {
      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
  }
  async insertBatchListing(block_number) {
    try {

      let _tokenInstanceResp =
        await this.BlockchainService.getSupplyChainJsonRpcContractInstance();

      if (_tokenInstanceResp.status == "failure") {
        return this.ResponseService.buildFailure(
          `Something went wrong while verifying the contract address, please try again later`
        );
      }

      let _batchListResponse = await _tokenInstanceResp.data.queryFilter(
        "performBatchAudit", block_number, block_number
      );
    
      if (_batchListResponse.length > 0) {
        for (let index = 0; index < _batchListResponse.length; index++) {
             
          let batchData =await await _tokenInstanceResp.data.getBatchDetails( _batchListResponse[index].args.batchNo);
            var element = {
              batch_id: _batchListResponse[index].args.batchNo,
              contract_address: this.Config.get("app.supplyChainContractAddress"),
              block_number: _batchListResponse[index].blockNumber,
              tx_hash: _batchListResponse[index].transactionHash,
              registration_no: batchData.registrationNo,
              extractor_name: batchData.extractorName,
              extractor_address: batchData.extractorAddress,
              auditor_address: batchData.auditorAddress,
              operator_address: batchData.operatorAddress,
              exporter_address: batchData.exporterAddress,
              importer_address: batchData.importerAddress,
              processor_address: batchData.processorAddress,
            };
            try{
            	
              let v = await this.BatchService.create(element);
              if (v.status !== "success") {
                console.log("fail to add the batch");
                break;
              }
            }catch(e){
              console.log("fail to add the batch");
              break;
            }
          }

        }

      return this.ResponseService.buildSuccess("Batch created successfully", _batchListResponse.length)

    }
    catch (error) {
      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
  }


}

module.exports = CronService;
