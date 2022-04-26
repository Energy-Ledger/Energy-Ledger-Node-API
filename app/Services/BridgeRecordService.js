class BridgeRecordService {

    constructor(app){
  
      //Models
      this.BridgeExchange = app.use("App/Models/BridgeExchange");
      // Services
      this.ResponseService = app.use("My/ResponseService");

    }

    async create(_data) {

        try{
            
            let _activityResponse = await this.BridgeExchange.create(_data);
            return this.ResponseService.buildSuccess('Record added successfully', _activityResponse);
        }
        catch(err){
            console.log(err)
            return this.ResponseService.buildFailure(
                "Something went wrong while adding records, please try again later."
            );
          }
    }

    async update(_data) {

        try{

            let _id = _data.id;

            let ts = Date.now();

            let date_ob = new Date(ts);
            let date = date_ob.getDate();
            let month = date_ob.getMonth() + 1;
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();

            // get date & time in YYYY-MM-DD format
            let cdate = year + "-" + month + "-" + date;
            let datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            const bridgeRecord = await this.BridgeExchange.findOrFail(_id);

            bridgeRecord.completed_tx_hash = _data.completed_tx_hash;
            bridgeRecord.status = _data.status;
            bridgeRecord.update_date = datetime;
            bridgeRecord.complete_date = cdate;

            let _activityResponse = await bridgeRecord.save();

            return this.ResponseService.buildSuccess('Record updated successfully', _activityResponse);
        }
        catch(err){
            console.log(err)
            return this.ResponseService.buildFailure(
                "Something went wrong while adding records, please try again later."
            );
          }
    }

    async get(_data){
        try{
            let user_address = _data.user_address || '';
            let network_type = _data.network_type || '';
            let amount = _data.amount || '';
            let nonce = _data.nonce || '';

            let record = await this.BridgeExchange.find({ $or: 
                                        [
                                            {user_address},
                                            {network_type},
                                            {amount},
                                            {nonce}
                                        ] 
                                    });
            console.log(record);
            return this.ResponseService.buildSuccess('Record fetch successfully', record);

        }
        catch(err){
            console.log(err)
            return this.ResponseService.buildFailure(
                "Something went wrong while fetching record, please try again later."
            );
        }
    }
}

module.exports = BridgeRecordService;