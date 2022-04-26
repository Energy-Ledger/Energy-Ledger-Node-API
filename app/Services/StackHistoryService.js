

class StackHistoryService {

    constructor(app){
    
        //Models
        this.CreateStackHistory = app.use("App/Models/CreateStackHistory");
        this.RemoveStackHistory = app.use("App/Models/RemoveStackHistory");
        // Services
        this.ResponseService = app.use("My/ResponseService");
  
      }

    async createStakeHistory(_data) {
        try {
            let _createStackHistory = new this.CreateStackHistory();
            _createStackHistory.contract_address = _data.contract_address;
            _createStackHistory.wallet_address = _data.wallet_address;
            _createStackHistory.amount = _data.amount;
            _createStackHistory.update_date =_data.update_date;
            _createStackHistory.transaction_hash =_data.transaction_hash;
            
    
            /* store into user table  */
            if(await _createStackHistory.save()){
                return this.ResponseService.buildSuccess(
                "Create stack history inserted successfully",
            );
            }else{
                return this.ResponseService.buildFailure(
                    "Failed to insert create stack history."
                );
            }
        } catch (error) {
            console.log(error)
            return this.ResponseService.buildFailure(
            "Failed to insert create stack history."
            );
        }
      }

      async removeStakeHistory(_data) {
        try {
            let _removeStakeHistory = new this.RemoveStackHistory();
            _removeStakeHistory.contract_address = _data.contract_address;
            _removeStakeHistory.wallet_address = _data.wallet_address;
            _removeStakeHistory.amount = _data.amount;
            _removeStakeHistory.update_date =_data.update_date;
            _removeStakeHistory.transaction_hash =_data.transaction_hash;
        
    
            /* store into user table  */
            if(await _removeStakeHistory.save()){
                return this.ResponseService.buildSuccess(
                "Remove stack history inserted successfully",
            );
            }else{
                return this.ResponseService.buildFailure(
                    "Failed to insert remove stack history."
                );
            }
        } catch (error) {
            return this.ResponseService.buildFailure(
            "Failed to insert remove stack history."
            );
        }
      }

      async createStackListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _search = _criteria.search;
            let _contract_address = _criteria.contract_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.CreateStackHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .orderBy('id' , 'desc');

            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('amount', 'like', `%${_search}%`)
                            });
            }

            _records = await _records.paginate(_page, _perPage);

            let _data = {
                records: _records.rows,
                pagination: {
                    page: _records.pages.page,
                    perPage: _records.pages.perPage,
                    totalPages: _records.pages.lastPage,
                    totalCount: _records.pages.total
                },
            };

            return this.ResponseService.buildSuccess("Create stack history listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching create stack history, please try again later."
            );
        }
    }

    async removeStackListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _search = _criteria.search;
            let _contract_address = _criteria.contract_address;
            let _wallet_address = _criteria.wallet_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.RemoveStackHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .orderBy('id' , 'desc');

            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('amount', 'like', `%${_search}%`)
                            });
            }
            // for front end user get record by wallet address 
            if(_wallet_address !== ''){

                _records = _records.where('wallet_address', _wallet_address)
            }

            _records = await _records.paginate(_page, _perPage);

            let _data = {
                records: _records.rows,
                pagination: {
                    page: _records.pages.page,
                    perPage: _records.pages.perPage,
                    totalPages: _records.pages.lastPage,
                    totalCount: _records.pages.total
                },
            };

            return this.ResponseService.buildSuccess("Remove stack history listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching remove stack history, please try again later."
            );
        }
    }

    async checkCreateStackHistory(_transactionHash) {
        try {
            console.log('_transactionHash', _transactionHash);
            let _records = await this.CreateStackHistory
                                    .query()
                                    .where('transaction_hash', _transactionHash)
                                    .first();

            if(_records){
                
                return this.ResponseService.buildSuccess("Transaction hash found", true);
            }

            return this.ResponseService.buildSuccess("Transaction hash not found", false);

        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while checking create stack history, please try again later."
            );
        }
    }

    async checkRemoveStackHistory(_transactionHash) {
        try {
            console.log('_transactionHash', _transactionHash);
            let _records = await this.RemoveStackHistory
                                    .query()
                                    .where('transaction_hash', _transactionHash)
                                    .first();
            
            if(_records){
                
                return this.ResponseService.buildSuccess("Transaction hash found", true);
            }

            return this.ResponseService.buildSuccess("Transaction hash not found", false);

        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while checking remove stack history, please try again later."
            );
        }
    }
}

module.exports = StackHistoryService;