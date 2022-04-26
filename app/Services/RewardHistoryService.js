

class RewardHistoryService {

    constructor(app){
    
        //Models
        this.RewardHistory = app.use("App/Models/RewardHistory");
        this.PercentageHistory = app.use("App/Models/PercentageHistory");
        // Services
        this.ResponseService = app.use("My/ResponseService");
  
      }

    async createRewardHistory(_data) {
        try {
            let _rewardHistory = new this.RewardHistory();
            _rewardHistory.contract_address = _data.contract_address;
            _rewardHistory.wallet_address = _data.wallet_address;
            _rewardHistory.reward_amount = _data.reward_amount;
            _rewardHistory.reward_date =_data.reward_date;
            _rewardHistory.transaction_hash =_data.transaction_hash;
            
    
            /* store into user table  */
            if(await _rewardHistory.save()){
                return this.ResponseService.buildSuccess(
                "Reward history inserted successfully",
            );
            }else{
                return this.ResponseService.buildFailure(
                    "Failed to insert reward history."
                );
            }
        } catch (error) {
            console.log(error)
            return this.ResponseService.buildFailure(
            "Failed to insert reward history."
            );
        }
      }

      async createPercentageHistory(_data) {
        try {
            let _percentageHistory = new this.PercentageHistory();
            _percentageHistory.contract_address = _data.contract_address;
            _percentageHistory.reward_percetage = _data.reward_percetage;
            _percentageHistory.update_date = _data.update_date;
            _percentageHistory.transaction_hash =_data.transaction_hash;
        
    
            /* store into user table  */
            if(await _percentageHistory.save()){
                return this.ResponseService.buildSuccess(
                "Percentage history inserted successfully",
            );
            }else{
                return this.ResponseService.buildFailure(
                    "Failed to insert percentage history."
                );
            }
        } catch (error) {
            return this.ResponseService.buildFailure(
            "Failed to insert percentage history."
            );
        }
      }

      async rewardListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _search = _criteria.search;
            let _contract_address = _criteria.contract_address;
            let wallet_address = _criteria.wallet_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.RewardHistory
                                    .query()
                                    .where('contract_address', _contract_address)
            if(wallet_address){
                _records = _records.where('wallet_address' , wallet_address)

            }

            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('reward_amount', 'like', `%${_search}%`)
                            });
            }
            
            _records = await _records.orderBy('id' , 'desc').paginate(_page, _perPage);

            let _data = {
                records: _records.rows,
                pagination: {
                    page: _records.pages.page,
                    perPage: _records.pages.perPage,
                    totalPages: _records.pages.lastPage,
                    totalCount: _records.pages.total
                },
            };

            return this.ResponseService.buildSuccess("Reward history listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching reward history, please try again later."
            );
        }
    }

    // user reward listing
    async userRewardListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _search = _criteria.search;
            let _contract_address = _criteria.contract_address;
            let wallet_address = _criteria.wallet_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.RewardHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .where('wallet_address' , '!=', wallet_address);

            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('reward_amount', 'like', `%${_search}%`)
                            });
            }

            _records = await _records.orderBy('id' , 'desc').paginate(_page, _perPage);

            let _data = {
                records: _records.rows,
                pagination: {
                    page: _records.pages.page,
                    perPage: _records.pages.perPage,
                    totalPages: _records.pages.lastPage,
                    totalCount: _records.pages.total
                },
            };

            return this.ResponseService.buildSuccess("User reward history listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching user reward history, please try again later."
            );
        }
    }

    async percentageListing(_criteria) {
        try {
            let _perPage = _criteria.perPage;
            let _page = _criteria.page;
            let _contract_address = _criteria.contract_address;
            let _search = _criteria.search;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.PercentageHistory
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .orderBy('id' , 'desc');
            if(_search){
                _records = _records.where((builder) => {
                                builder
                                .orWhere('transaction_hash', 'like', `%${_search}%`)
                                .orWhere('reward_percetage', 'like', `%${_search}%`)
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

            return this.ResponseService.buildSuccess("Percentage history listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching reward percentage history, please try again later."
            );
        }
    }
}

module.exports = RewardHistoryService;