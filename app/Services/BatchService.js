
class BatchService {

    // const User = use('App/Models/User')

    constructor(app){
  
      //Models
      this.Batch = app.use("App/Models/Batch");
      // Services
      this.ResponseService = app.use("My/ResponseService");

    }

    async listing(_criteria) {
        try {
            let _perPage = _criteria.perPage || 10;
            let _page = _criteria.page || 1;
            let _search = _criteria.search || '';
            let _contract_address = _criteria.contract_address;

            _page = Math.abs(_page);
            _perPage = Math.abs(_perPage);

            //sort records  paginate records
            
            let _records = this.Batch
                                    .query()
                                    .where('contract_address', _contract_address);

              if(_search){
                _records = _records.where('batch_id','like', `%${_search}%`);
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

            return this.ResponseService.buildSuccess("Batches listed successfully.", _data);
        } catch (error) {
            // console.log(error);

            return this.ResponseService.buildFailure(
                "Something went wrong while fetching batches, please try again later."
            );
        }
    }

    async userBatchListing(_criteria) {
      try {
          let _perPage = _criteria.perPage || 10;
          let _page = _criteria.page || 1;
          let _search = _criteria.search || '';
          let _contract_address = _criteria.contract_address;
          let _role = _criteria.role;
          let _wallet_address = _criteria.wallet_address;

          _page = Math.abs(_page);
          _perPage = Math.abs(_perPage);
          // _role = Math.abs(_role);

          //sort records  paginate records
          
          let _records = this.Batch
                                  .query()
                                  .where('contract_address', _contract_address);
          if(_role === 'auditor'){
            _records = _records.where('auditor_address', _wallet_address);
          }else if(_role === 'operator'){
            _records = _records.where('operator_address', _wallet_address);
          }else if(_role === 'exporter'){
            _records = _records.where('exporter_address', _wallet_address);
          }else if(_role === 'importer'){
            _records = _records.where('importer_address', _wallet_address);
          }else if(_role === 'processor'){
            _records = _records.where('processor_address', _wallet_address);
          }else{
            return this.ResponseService.buildFailure("Role not found");
          }

            if(_search){
              _records = _records.where('batch_id','like', `%${_search}%`);
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

          return this.ResponseService.buildSuccess("Batches listed successfully.", _data);
      } catch (error) {
          // console.log(error);

          return this.ResponseService.buildFailure(
              "Something went wrong while fetching batches, please try again later."
          );
      }
  }
  
    async create(_data) {
        try {
          
        let _batch = new this.Batch();
    
        _batch.batch_id=_data.batch_id;
        _batch.block_number=_data.block_number;
        _batch.contract_address=_data.contract_address;
        _batch.tx_hash=_data.tx_hash;
        _batch.registration_no=_data.registration_no;
        _batch.extractor_name=_data.extractor_name;
        _batch.extractor_address=_data.extractor_address;
        _batch.auditor_address=_data.auditor_address;
        _batch.operator_address=_data.operator_address;
        _batch.exporter_address=_data.exporter_address;
        _batch.importer_address=_data.importer_address;
        _batch.processor_address=_data.processor_address;
    
        /* store into user table  */
        if(await _batch.save()){
               return this.ResponseService.buildSuccess(
            "Batch created successfully",
          );
        }else{
            return this.ResponseService.buildFailure(
                "Failed to add the batch."
              );
        }
      } catch (error) {
        return this.ResponseService.buildFailure(
          "Failed to add the batch."
        );
      }
      }

  
    
    
  }
  
  module.exports = BatchService;
