const { id } = require("ethers/lib/utils");

class BridgeService {

  constructor(app) {

    this.ResponseService = app.use("My/ResponseService");
    this.Config = app.use("Config");
    this.BridgeRecordService = app.use("My/BridgeRecordService");
    this.ethers = app.use("ethers");
    this.BlockchainService = app.use("My/BlockchainService");
    this.UserService = app.use("My/UserService");
    this.BatchService = app.use("My/BatchService");
    this.BlockSetting = app.use("App/Models/BlockSetting");
    this.BridgeExchange = app.use("App/Models/BridgeExchange");


  }

  // claim BSC token
  async claimBscToken() {
    try {

      let _tokenInstanceResp =
        await this.BlockchainService.getBridgeBaseJsonRpcContractInstance();

      
      let _ethInstanceResp = await this.BlockchainService.getBridgeBaseETHContractInstance();
      

      let latestBlockNumber = await this.BlockchainService.getLatestBlock();
     
      console.log("Latest Block Number on Chain",latestBlockNumber);

      // let startBlock = Number(_rawData.bscBridgeBlockNo) + 1
      let _blockSetting = await this.BlockSetting.first();
      let _rawData = _blockSetting.toJSON();
      // let _oldStartBlock = startBlock;

      let startBlock = parseInt(_rawData.bscBridgeBlockNo);

      
      startBlock = isNaN(startBlock) ? 0 : startBlock+1;
      console.log("Start Block fom DB",startBlock);

      let _oldStartBlock = startBlock;

      /* Patch 5000 records */
      if(latestBlockNumber - _oldStartBlock > 4999)
      {
        latestBlockNumber = _oldStartBlock + 4999;
        console.log('Adjustment Required Last Block',latestBlockNumber);
      }

      console.log('Adjusted Last Block',latestBlockNumber);


      // latestBlockNumber=(latestBlockNumber >= (startBlock+4999))? startBlock+4999 :latestBlockNumber;

      let _records = await _tokenInstanceResp.data.queryFilter(
        "ELXDeposited", startBlock, latestBlockNumber
      );
      // console.log("Updating latestBlockNumber to DB.....",latestBlockNumber);

      let clamRec = 0;
      if (_records.length > 0) {

        for (let index = 0; index < _records.length; index++) {
          let _acc = _records[index].args._account;
          let amount = await this.BlockchainService.formatUnits(_records[index].args._amount);
          let nonce = await this.BlockchainService.formatUnits(_records[index].args._nonce);
          let res = await _ethInstanceResp.data.processedNoncesMap(this.Config.get("app.ethContractAddress"), _records[index].args._nonce);
          // console.log(res);
          // console.log("record block", _records[index].blockNumber);
          let value = await this.BlockchainService.parseUnits(amount);
          let nonceValue = await this.BlockchainService.parseUnits(nonce);
          // console.log("amount", amount);

          latestBlockNumber = _records[index].blockNumber;

          if (res === false) {
            let mint = {};
            try {

              mint = await _ethInstanceResp.data.claimDeposit(_records[index].args._account, value.toString(), _records[index].args._nonce);
            } catch (e) {
              console.log("Error Occured while Claiming Deposit on Blockchains" , e);
              break;
            }  
             

            // call api for account_number( _records[index].args._account ), network_type ( 1=bnb 2=eth), amount( value.toString() ), nonce ( _records[index].args._nonce )
            let _data = {
              user_address: _acc,
              network_type: 1, //bnb
              nonce: nonceValue.toString(),
            }
             
            let bridgeRecord = await this.BridgeExchange.findBy(_data);

            if (bridgeRecord) {
              // console.log("record found", bridgeRecord);
              bridgeRecord.completed_tx_hash = mint.hash;
              bridgeRecord.status = 1;
              try{

                await bridgeRecord.save()
              }catch(e){
                console.log("Error Occured while Updating Completed Tx Hash in DB" , e);
              }

            }

            clamRec = clamRec + 1;
            console.log(`
                [ETH Network] Processed transfer:
                  - account ${_records[index].args._account} 
                  - amount ${amount} 
                  - nonce ${nonceValue} 
                
              `);
            _oldStartBlock = _records[index].blockNumber;


            

          } else {
            console.log(`
                [ETH Network] Already Processed transfer:
                  - account ${_records[index].args._account} 
                  - amount ${amount} 
                  - nonce ${nonceValue} 
                
              `);
            _oldStartBlock = _records[index].blockNumber;

          }

        }
      }
      else
      {
        console.log("No Data Left for Processing Till Block: "+latestBlockNumber);
      }

      console.log("Updating latestBlockNumber to DB",latestBlockNumber);

      _blockSetting['bscBridgeBlockNo'] = latestBlockNumber;
      await _blockSetting.save();
      return this.ResponseService.buildSuccess("Elx BSC token Claim Successfully", clamRec)

    }
    catch (error) {
      console.log(error);
      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
  }

  // claim eth token
  async claimEthToken() {

    // console.log(1212);
    try {


      let _bscBridgeInstanceResp =
        await this.BlockchainService.getBridgeBaseJsonRpcContractInstance();
      let _ethBridgeInstanceResp = await this.BlockchainService.getBridgeBaseETHContractInstance();

      // console.log('_ethBridgeInstanceResp',_ethBridgeInstanceResp);


      let latestBlockNumber = await this.BlockchainService.getETHLatestBlock();
      let _blockSetting = await this.BlockSetting.first();
      let _rawData = _blockSetting.toJSON();

      console.log("Latest Block Number on Chain",latestBlockNumber);

      let _startBlockno = parseInt(_rawData.ethBridgeBlockNo);
      _startBlockno = isNaN(_startBlockno) ? 0 : _startBlockno+1;

      let _oldStartBlock = _startBlockno;

      let _result = await _ethBridgeInstanceResp.data.queryFilter(
        "ELXDeposited", _startBlockno, latestBlockNumber
      );

        // console.log(_result);
      let clamRec = 0;
      if (_result.length > 0) {

        for (let index = 0; index < _result.length; index++) {
          let _acc = _result[index].args._account;
          // console.log(_result[index]);
          let amount = await this.BlockchainService.formatUnits(_result[index].args._amount);
          let nonce = await this.BlockchainService.formatUnits(_result[index].args._nonce);
          let res = await _bscBridgeInstanceResp.data.processedNoncesMap(this.Config.get("app.bscContractAddress"), _result[index].args._nonce);
          console.log("record block", _result[index].blockNumber);
          let value = await this.BlockchainService.parseUnits(amount);
          let nonceValue = await this.BlockchainService.parseUnits(nonce);

          latestBlockNumber = _result[index].blockNumber;
          
          if (res === false) {
            let mint = {};
            try {
              mint = await _bscBridgeInstanceResp.data.claimDeposit(_result[index].args._account, value.toString(), _result[index].args._nonce);
            } catch (e) {
              console.log("Error Occured while Claiming Deposit on Blockchains" , e);
              
              break;
            }  

            let _data = {
              user_address: _acc,
              network_type: 2, // eth
              nonce: nonceValue.toString(),
            }
            let bridgeRecord = await this.BridgeExchange.findBy(_data);

            if (bridgeRecord) {

              bridgeRecord.completed_tx_hash = mint.hash;
              bridgeRecord.status = 1;
              try{

                await bridgeRecord.save()
              }catch(e){
                console.log("Error Occured while Updating Completed Tx Hash in DB" , e);
              }
            }

         
              clamRec = clamRec + 1;
              console.log(`
                [BSC Network] Processed transfer:
                  - account ${_result[index].args._account} 
                  - amount ${amount} 
                  - nonce ${nonceValue} 
                
              `);
              _oldStartBlock = _result[index].blockNumber;
            

          } else {
            console.log(`
              [BSC Network] Already Processed transfer:
                - account ${_result[index].args._account} 
                - amount ${amount} 
                - nonce ${nonceValue} 
              
            `);
            _oldStartBlock = _result[index].blockNumber;

          }
        }
      }
      else
      {
        console.log("No Data Left for Processing Till Block: "+latestBlockNumber);
      }

      _blockSetting['ethBridgeBlockNo'] = latestBlockNumber;
      await _blockSetting.save();
      return this.ResponseService.buildSuccess("Elx ETH token Claim Successfully", clamRec)

    }
    catch (error) {

      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
  }



}

module.exports = BridgeService;
