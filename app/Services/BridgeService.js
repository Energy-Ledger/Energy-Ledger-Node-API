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

  async claimAllToken() {
    try {
      const publicProvider = await this.BlockchainService.initJsonRpcProvider();

      const bscElxCntrAddress = await this.BlockchainService.getElxBscContractAddress();
    

      let _tokenInstanceResp =
      await this.BlockchainService.getBridgeBaseJsonRpcContractInstance();
      let _ethInstanceResp = await this.BlockchainService.getBridgeBaseETHContractInstance();
      const infuraProvider = await this.BlockchainService.initInfuraProvider();
      
      const elxEthContractAddress = await this.BlockchainService.getElxEthContractAddress();
     
    
      let _unclaimRecord = await this.BridgeExchange.query().where("status", 0).fetch();
      let totalRecord = _unclaimRecord.rows;
      console.log(totalRecord.length);
      if (totalRecord.length > 0) {

        for (let i = 0; i < totalRecord.length; i++) {
          if (totalRecord[i].network_type === 1) {
            let txInfo = await publicProvider.data.getTransaction(totalRecord[i].initiate_tx_hash);
            let _records = await _tokenInstanceResp.data.queryFilter(
              "ELXDeposited", txInfo.blockNumber, txInfo.blockNumber
            );
          
            if (_records.length > 0) {
              for (let index = 0; index < _records.length; index++) {
                let _acc = _records[index].args._account;
                let amount = await this.BlockchainService.formatUnits(_records[index].args._amount);
                let nonce = await this.BlockchainService.formatUnits(_records[index].args._nonce);
                let res = await _ethInstanceResp.data.processedNoncesMap(this.Config.get("app.ethContractAddress"), _records[index].args._nonce);
                console.log(res);
                console.log("record block", _records[index].blockNumber);
                let value = await this.BlockchainService.parseUnits(amount);
                let nonceValue = await this.BlockchainService.parseUnits(nonce);
                console.log("mint value:", amount);
                if (res === false) {
                  try {

                    const _ethBalance=await elxEthContractAddress.data.balanceOf( this.Config.get("app.ethContractAddress"))
                    let _ethBal = await this.BlockchainService.formatUnits(_ethBalance._hex , true);
                    console.log("Eth contract balance", _ethBal);
                    if(Number(amount) < Number(_ethBal)){
                      let mint = await _ethInstanceResp.data.claimDeposit(_records[index].args._account, value.toString(), _records[index].args._nonce);
                      let _data = {
                        id: totalRecord[i].id,
                      }
    
                      let bridgeRecord = await this.BridgeExchange.findBy(_data);
    
                      if (bridgeRecord) {
                        bridgeRecord.completed_tx_hash = mint.hash;
                        bridgeRecord.status = 1;
                        try {
    
                          await bridgeRecord.save()
                        } catch (e) {
                          console.log("Error Occured while Updating BSC Completed Tx Hash in DB", e);
                        }
    
                      }

                    }else{
                      console.log("Insufficient balance in BSC contract address:-" , _ethBal);
                      continue;
                    }
                   
                  } catch (e) {
                    console.log("Error Occured while Claiming Deposit on ETH Network Blockchains", e);
                  }
                

                  console.log(`
                        [ETH Network] Processed transfer:
                          - account ${_records[index].args._account} 
                          - amount ${amount} 
                          - nonce ${nonceValue} 
                        
                      `);
                } else {
                  console.log(`
                        [ETH Network] Already Processed transfer:
                          - account ${_records[index].args._account} 
                          - amount ${amount} 
                          - nonce ${nonceValue} 
                        
                      `);
                }

              }
            }
            else {
              console.log("Failed to found the BSC record: " + totalRecord[i].initiate_tx_hash);
            }

          } else if (totalRecord[i].network_type === 2) {
            let txInfura = await infuraProvider.data.getTransaction(totalRecord[i].initiate_tx_hash);
            let _ethRecords = await _ethInstanceResp.data.queryFilter(
              "ELXDeposited", txInfura.blockNumber, txInfura.blockNumber
            );

            if (_ethRecords.length > 0) {

              for (let ethIndex = 0; ethIndex < _ethRecords.length; ethIndex++) {
                // console.log(_ethRecords[index]);
                let amount = await this.BlockchainService.formatUnits(_ethRecords[ethIndex].args._amount);
                let nonce = await this.BlockchainService.formatUnits(_ethRecords[ethIndex].args._nonce);
                let res = await _tokenInstanceResp.data.processedNoncesMap(this.Config.get("app.bscContractAddress"), _ethRecords[ethIndex].args._nonce);
                console.log("record block", _ethRecords[ethIndex].blockNumber);
                console.log("eth claim amount", amount);
                let value = await this.BlockchainService.parseUnits(amount);
                let nonceValue = await this.BlockchainService.parseUnits(nonce);
            
                if (res === false) {
                  try {
                    const _bscBalance=await bscElxCntrAddress.data.balanceOf(this.Config.get("app.bscContractAddress"))
                    let _bscBal = await this.BlockchainService.formatUnits(_bscBalance._hex , true);
                    if(Number(amount) < Number(_bscBal)){
                      let mintEth = await _tokenInstanceResp.data.claimDeposit(_ethRecords[ethIndex].args._account, value.toString(), _ethRecords[ethIndex].args._nonce);
                      let _data = {
                        id: totalRecord[i].id,
                      }
    
                      let bridgeRecord = await this.BridgeExchange.findBy(_data);
    
                      if (bridgeRecord) {
                        bridgeRecord.completed_tx_hash = mintEth.hash;
                        bridgeRecord.status = 1;
                        try {
    
                          await bridgeRecord.save()
                        } catch (e) {
                          console.log("Error Occured while Updating BSC Completed Tx Hash in DB", e);
                      
                        }
    
                      }
                    }else{
                      console.log("Insufficient amount in BSC Contract", _bscBal);
                      continue;

                    }
                   
                  } catch (e) {
                    console.log("Error Occured while Claiming ETH Deposit to BNB on Blockchains", e);
                  }
      
                
      
                    console.log(`
                      [BSC Network] Processed transfer:
                        - account ${_ethRecords[ethIndex].args._account} 
                        - amount ${amount} 
                        - nonce ${nonceValue} 
                      
                    `);
      
      
                } else {
                  console.log(`
                    [BSC Network] Already Processed transfer:
                      - account ${_ethRecords[ethIndex].args._account} 
                      - amount ${amount} 
                      - nonce ${nonceValue} 
                    
                  `);      
                }
              }
            }
            else {
              console.log("Failed to find the ETH transaction: " + totalRecord[i].initiate_tx_hash);
            }



          } else {

            console.log("Incorrect Network Id for this record: " + totalRecord[i].initiate_tx_hash);
          }
        }
        return this.ResponseService.buildSuccess("Record Claim Successfully", totalRecord.length)
        
      }else{
        console.log("No record for claim");
        return this.ResponseService.buildSuccess("No record for claim", totalRecord.length)

      }

    }
    catch (error) {
      console.log(error);
      return this.ResponseService.buildFailure(
        "Something went wrong: " + error.message,
        error.stack
      );
    }
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
