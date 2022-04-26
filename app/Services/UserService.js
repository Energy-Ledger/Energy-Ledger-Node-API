
class UserService {

    // const User = use('App/Models/User')

    constructor(app){

      this.Path = app.use("path");
      this.Config = app.use("Config");
      this.Database = app.use("Database");
      this.uuid = app.use('uuid');
  
      //Models
      this.User = app.use("App/Models/User");
      // Services
      this.ResponseService = app.use("My/ResponseService");

    }

    async listing(_criteria) {
        try {
            let _perPage = _criteria.perPage || 10;
            let _page = _criteria.page || 1;
            let _search = _criteria.search || '';
            let _role = _criteria.role || '';
            let _contract_address = _criteria.contract_address

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);


            //sort records  paginate records
            
            let _records = this.User
                                    .query()
                                    .where('contract_address', _contract_address)
                                    .where((builder) => {
                                        builder
                                        .orWhere('name', 'like', `%${_search}%`)
                                        .orWhere('wallet_address', 'like', `%${_search}%`)
                                        .orWhere('contact_no', 'like', `%${_search}%`)
                                    });

              if(_role){
                _records = _records.where('role', _role);
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

            return this.ResponseService.buildSuccess("Users listed successfully.", _data);
        } catch (error) {

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching users, please try again later."
            );
        }
    }
  
    async create(_data) {
        try {
        let _user = new this.User();
        _user.profile_path = _data.profileHashUrl;
        _user.name = _data.name;
        _user.contact_no	 = _data.contactNo;
        _user.wallet_address =_data.walletAddr;
        _user.email =_data.email;
        _user.role =_data.role;
        _user.status =_data.status;
        _user.extra_data =_data.extraData;
        _user.contract_address =_data.contractAddress;
        _user.create_block =_data.create_block;
        _user.tx_hash =_data.tx_hash;
        _user.update_block ="";
     
  
        /* store into user table  */
        if(await _user.save()){
               return this.ResponseService.buildSuccess(
            "User created successfully",
          );
        }else{
            return this.ResponseService.buildFailure(
                "Failed to add the user."
              );
        }
      } catch (error) {
        return this.ResponseService.buildFailure(
          "Failed to add the user."
        );
      }
      }
    async update(_data) {
        try {
        let _user = await this.User.findBy({ wallet_address: _data.walletAddr });
       if(_user){

     
        _user.profile_path = _data.profileHashUrl;
        _user.name = _data.name;
        _user.contact_no	 = _data.contactNo;
        _user.email =_data.email;
        _user.role =_data.role;
        _user.status =_data.status;
        _user.extra_data =_data.extraData;
        _user.contract_address =_data.contractAddress;
        _user.update_block =_data.update_block;
     
  
        /* store into user table  */
        if(await _user.save()){
               return this.ResponseService.buildSuccess(
            "User updated successfully",
          );
        }else{
            return this.ResponseService.buildFailure(
                "Failed to add the user."
              );
        }
      }else{
        return this.ResponseService.buildSuccess(
          "User not created",
        );
      }
      } catch (error) {
        return this.ResponseService.buildFailure(
          "Failed to add the user."
        );
      }
      }
  
    
    
  }
  
  module.exports = UserService;
