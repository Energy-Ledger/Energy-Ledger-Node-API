

class CronTransactionHistoryService {

    constructor(app) {

        this.ResponseService = app.use("My/ResponseService");
        this.Config = app.use("Config");
    
        this.BlockchainService = app.use("My/BlockchainService");
        this.RewardHistoryService = app.use("My/RewardHistoryService");
        this.StackHistoryService = app.use("My/StackHistoryService");
        this.TransactionHistoryService = app.use("My/TransactionHistoryService");
        
        this.BlockSetting = app.use("App/Models/BlockSetting");
    
      }

      // get reward history
    
      async getCreatedRewardHistory(block_number) {


        try {

            let _tokenInstanceResp =
              await this.BlockchainService.getElxBscContractAddress();

            if (_tokenInstanceResp.status == "failure") {
              return this.ResponseService.buildFailure(
                `Something went wrong while verifying the contract address, please try again later`
              );
            }

            let _rewardHistoryResponse = await _tokenInstanceResp.data.queryFilter(
              "RewardDistributed", block_number, block_number
            );
        
            // return;
            if (_rewardHistoryResponse.length > 0) {
              for (let index = 0; index < _rewardHistoryResponse.length; index++) {
                let _txDetails =await _rewardHistoryResponse[index].getBlock();
             
            // console.log('_rewardHistoryResponse', _rewardHistoryResponse[index].args._reward);
                let _amount = await this.BlockchainService.formatUnits(_rewardHistoryResponse[index].args._reward._hex);
                // let value= await this.BlockchainService.parseUnits(_amount);
                var element2 = {
                  contract_address: this.Config.get("app.supplyChainContractAddress"),
                  wallet_address: _rewardHistoryResponse[index].args._account,
                  reward_amount: _amount.toString(),
                  reward_date: _txDetails.timestamp,
                  transaction_hash: _rewardHistoryResponse[index].transactionHash
                };
                try{
      
                  let v = await this.RewardHistoryService.createRewardHistory(element2);

                  if (v.status !== "success") {
                    console.log("failed to create a user");
                    break;
                  }

                }catch(e){
                  console.log("failed to create a user", e);
                  break;
                }
      
              }
      
            }

            return this.ResponseService.buildSuccess("Reward history inserted", _rewardHistoryResponse.length)
      
          }
          catch (error) {
              console.log(error)
            return this.ResponseService.buildFailure(
              "Something went wrong: " + error.message,
              error.stack
            );
          }

      }

      // get percentage history
      async getCreatedPercentageHistory(block_number) {

        try {

            let _tokenInstanceResp =
              await this.BlockchainService.getElxBscContractAddress();

            if (_tokenInstanceResp.status == "failure") {
              return this.ResponseService.buildFailure(
                `Something went wrong while verifying the contract address, please try again later`
              );
            }

            let _percentageHistoryResponse = await _tokenInstanceResp.data.queryFilter(
              "RewardPercentUpdated", block_number, block_number
            );
            
            if (_percentageHistoryResponse.length > 0) {
              for (let index = 0; index < _percentageHistoryResponse.length; index++) {

                let _txDetails = await _percentageHistoryResponse[index].getBlock();

                let _rewardPercentage = _percentageHistoryResponse[index].args != null && _percentageHistoryResponse[index].args._rewardPercent != null
                                            ? parseFloat(_percentageHistoryResponse[index].args._rewardPercent) /
                                            parseFloat(_percentageHistoryResponse[index].args._rewardPercentDivisor)
                                            : 0;

                var element2 = {
                  contract_address: this.Config.get("app.supplyChainContractAddress"),
                  reward_percetage: _rewardPercentage,
                  update_date: _txDetails.timestamp,
                  transaction_hash: _percentageHistoryResponse[index].transactionHash
                };
                try{
      
                  let v = await this.RewardHistoryService.createPercentageHistory(element2);
                  if (v.status !== "success") {
                    console.log("failed to insert percentage history");
                    break;
                  }
                }catch(e){
                  console.log("failed to insert percentage history");
                  break;
                }
      
              }
      
            }
    
            return this.ResponseService.buildSuccess("Percentage history inserted", _percentageHistoryResponse.length)
      
          }
          catch (error) {
              console.log(error)
            return this.ResponseService.buildFailure(
              "Something went wrong: " + error.message,
              error.stack
            );
          }
      }

      // get created stack history
      async getCreatedStakeHistory(block_number) {

        try {

          console.log('stake create');

            let _tokenInstanceResp =
            await this.BlockchainService.getElxBscContractAddress();

            if (_tokenInstanceResp.status == "failure") {
              return this.ResponseService.buildFailure(
                `Something went wrong while verifying the contract address, please try again later`
              );
            }

            
            let _createStakeHistory = await _tokenInstanceResp.data.queryFilter(
              "StakeCreated", block_number, block_number
            );

            if (_createStakeHistory.length > 0) {
              for (let index = 0; index < _createStakeHistory.length; index++) {

                let _txDetails = await _createStakeHistory[index].getBlock();

                let _amount = await this.BlockchainService.formatUnits(_createStakeHistory[index].args._stake);

                let _transactionHash = _createStakeHistory[index].transactionHash;

                let check = await this.StackHistoryService.checkCreateStackHistory(_transactionHash);

                if(check.data === true){
                  continue;
                }

                var element2 = {
                  contract_address: this.Config.get("app.supplyChainContractAddress"),
                  wallet_address: _createStakeHistory[index].args._account,
                  amount: _amount.toString(),
                  update_date: _txDetails.timestamp,
                  transaction_hash: _transactionHash
                };

                // console.log('element2', element2)
                try{
      
                  let v = await this.StackHistoryService.createStakeHistory(element2);
                  if (v.status !== "success") {
                    console.log("failed to insert create stake history");
                    break;
                  }
                }catch(e){
                  console.log("failed to insert create stake history");
                  break;
                }
      
              }
      
            }
           
            return this.ResponseService.buildSuccess("Create stack history inserted", _createStakeHistory.length)
      
          }
          catch (error) {
              console.log(error)
            return this.ResponseService.buildFailure(
              "Something went wrong: " + error.message,
              error.stack
            );
          }
      }

      // get remove stack history
      async getRemoveStakeHistory(block_number) {

        try {
          console.log('stake remove');

            let _tokenInstanceResp =
            await this.BlockchainService.getElxBscContractAddress();

            if (_tokenInstanceResp.status == "failure") {
              return this.ResponseService.buildFailure(
                `Something went wrong while verifying the contract address, please try again later`
              );
            }
            
            let _removeStakeHistory = await _tokenInstanceResp.data.queryFilter(
              "StakeRemoved", block_number, block_number
            );

            if (_removeStakeHistory.length > 0) {
              for (let index = 0; index < _removeStakeHistory.length; index++) {

                let _txDetails = await _removeStakeHistory[index].getBlock();

                let _amount = await this.BlockchainService.formatUnits(_removeStakeHistory[index].args._stake);

                let _transactionHash = _removeStakeHistory[index].transactionHash;

                let check = await this.StackHistoryService.checkRemoveStackHistory(_transactionHash);
              
                if(check.data === true){
                  continue;
                }
                
                var element2 = {
                  contract_address: this.Config.get("app.supplyChainContractAddress"),
                  wallet_address: _removeStakeHistory[index].args._account,
                  amount: _amount.toString(),
                  update_date: _txDetails.timestamp,
                  transaction_hash: _transactionHash
                };

                try{
      
                  let v = await this.StackHistoryService.removeStakeHistory(element2);
                  if (v.status !== "success") {
                    console.log("failed to insert remove stake history");
                    break;
                  }
                }catch(e){
                  console.log("failed to insert remove stake history");
                  break;
                }
      
              }
      
            }
            
            return this.ResponseService.buildSuccess("remove stack history inserted", _removeStakeHistory.length)
      
          }
          catch (error) {
              console.log(error)
            return this.ResponseService.buildFailure(
              "Something went wrong: " + error.message,
              error.stack
            );
          }
      }

      // get Elx history
      // async getElxHistory() {

      //   try {

      //       let _tokenInstanceResp =
      //       await this.BlockchainService.getElxBscContractAddress();

      //       let latestBlockNumber = await this.BlockchainService.getLatestBlock();

      //       if (_tokenInstanceResp.status == "failure") {
      //         return this.ResponseService.buildFailure(
      //           `Something went wrong while verifying the contract address, please try again later`
      //         );
      //       }

      //       let startBlock = Number(this.Config.get("app.firstBlockNumber"))
      //       let _blockSetting = await this.BlockSetting.first();
      //       let _rawData = _blockSetting.toJSON();

      //       startBlock = (Number(_rawData.elxHistoryBlockNo) + 1 > startBlock) ? Number(_rawData.elxHistoryBlockNo) + 1 : startBlock;
            
      //       let _elxHistory = await _tokenInstanceResp.data.queryFilter(
      //         "Transfer", startBlock, "latest"
      //       );

      //       let _oldStartBlock=startBlock;
      //       console.log('_elxHistory', _elxHistory);
      //       // return;
      //       if (_elxHistory.length > 0) {
      //         for (let index = 0; index < _elxHistory.length; index++) {

      //           let _txDetails = await _elxHistory[index].getBlock();

      //           let _amount = await this.BlockchainService.formatUnits(_elxHistory[index].args.value);

      //           var element2 = {
      //             contract_address: this.Config.get("app.supplyChainContractAddress"),
      //             block_number: _elxHistory[index].blockNumber,
      //             wallet_address: _elxHistory[index].blockNumber,
      //             amount: _amount.toString(),
      //             update_date: _txDetails.timestamp,
      //             transaction_hash: _elxHistory[index].transactionHash,
      //             from_address: _elxHistory[index].args.from,
      //             to_address: _elxHistory[index].args.to
      //           };

      //           console.log('element2', element2)
      //           try{
      
      //             let v = await this.TransactionHistoryService.elxHistory(element2);
      //             if (v.status !== "success") {
      //               console.log("failed to insert elx history");
      //               latestBlockNumber = _oldStartBlock;
      //               break;
      //             }else{
      //               _oldStartBlock=_elxHistory[index].blockNumber;
      //             }
      //           }catch(e){
      //             console.log(e)
      //             latestBlockNumber = _oldStartBlock;
      //             console.log("failed to insert elx history");
      //             break;
      //           }
      
      //         }
      
      //       }
      //       _blockSetting['elxHistoryBlockNo'] = latestBlockNumber;
      //       await _blockSetting.save();
      //       return this.ResponseService.buildSuccess("elx history inserted", _elxHistory.length)
      
      //     }
      //     catch (error) {
      //         console.log(error)
      //       return this.ResponseService.buildFailure(
      //         "Something went wrong: " + error.message,
      //         error.stack
      //       );
      //     }
      // }
}

module.exports = CronTransactionHistoryService;