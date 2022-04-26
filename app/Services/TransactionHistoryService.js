

class TransactionHistoryService {

    constructor(app){
    
        //Models
        this.ElxTransactionHistory = app.use("App/Models/ElxTransactionHistory");
        // Services
        this.ResponseService = app.use("My/ResponseService");
  
      }

    async elxHistory(_data) {
        try {
            let _ElxTransactionHistory = new this.ElxTransactionHistory();
            _ElxTransactionHistory.contract_address = _data.contract_address;
            _ElxTransactionHistory.block_number = _data.block_number;
            _ElxTransactionHistory.amount = _data.amount;
            _ElxTransactionHistory.update_date =_data.update_date;
            _ElxTransactionHistory.transaction_hash =_data.transaction_hash;
            _ElxTransactionHistory.from_address =_data.from_address;
            _ElxTransactionHistory.to_address =_data.to_address;
            
    
            /* store into user table  */
            if(await _ElxTransactionHistory.save()){
                return this.ResponseService.buildSuccess(
                "elx history inserted successfully",
            );
            }else{
                return this.ResponseService.buildFailure(
                    "Failed to insert elx history."
                );
            }
        } catch (error) {
            console.log(error)
            return this.ResponseService.buildFailure(
            "Failed to insert elx history."
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

      async elxListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _contract_address = _criteria.contract_address;
            let _wallet_address = _criteria.wallet_address;
            let _search = _criteria.search;
            let _type = _criteria.type.toLowerCase();

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.ElxTransactionHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .orderBy('id' , 'desc');

            if(_wallet_address){
                _records = _records.where((builder) => {
                                    builder
                                    .orWhere('from_address', _wallet_address)
                                    .orWhere('to_address', _wallet_address)
                                });
            }

            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('amount', 'like', `%${_search}%`)
                            });
            }

            if(_type === 'sent'){
                _records = _records.where('from_address', _wallet_address);
            }
            else if(_type === 'received'){
                _records = _records.where('to_address', _wallet_address);
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
            let _contract_address = _criteria.contract_address;
            let _wallet_address = _criteria.wallet_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.RemoveStackHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .orderBy('id' , 'desc');

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
}

module.exports = TransactionHistoryService;