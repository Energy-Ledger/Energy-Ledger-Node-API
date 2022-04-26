const supplyChainAbi = require("../ABI/supplyChainAbi.json");
const bridgeBase = require("../ABI/bridgeBase.abi.json");
const ElxAbi = require("../ABI/ELX.abi.json");



class BlockchainService {
  jsonRpcProvider = null;
  webSocketProvider = null;
  infuraProvider = null;
 

  constructor(app) {
    // Packages ~ Libraries
    this.ethers = app.use("ethers");
    this.Config = app.use("Config");

    this.ResponseService = app.use("My/ResponseService");

   

    this.initJsonRpcProvider();
    this.initWebSocketProvider();
    this.initInfuraProvider();
  }

  async initJsonRpcProvider() {
    try {
    
      this.jsonRpcProvider = new this.ethers.providers.JsonRpcProvider(
        this.Config.get("app.blockchainJsonRpcEndPoint")
      );

      return this.ResponseService.buildSuccess("Instance initiated!" , this.jsonRpcProvider);
    } catch (error) {
      // console.log(error);
      this.ResponseService.buildValidationMessage(error);

      return this.ResponseService.buildFailure(
        "Provider Initialization failed: " + error.message,
        error.stack
      );
    }
  }
  async initWebSocketProvider() {
    try {
 
      // Connected to provider
      this.webSocketProvider = new this.ethers.providers.WebSocketProvider(
        this.Config.get("app.blockchainWebSocketEndPoint")
      );


      return this.ResponseService.buildSuccess("Instance initiated!");
    } catch (error) {
      // console.log(error);
      this.ResponseService.buildValidationMessage(error);

      return this.ResponseService.buildFailure(
        "Provider Initialization failed: " + error.message,
        error.stack
      );
    }
  }
  async initInfuraProvider() {
    try {
 
      // Connected to provider
      this.infuraProvider = new this.ethers.providers.InfuraProvider(
        this.Config.get("app.blockchainETHInfuraNetwok"), this.Config.get("app.blockchainETHInfuraKey")
      );


      return this.ResponseService.buildSuccess("Instance initiated!" , this.infuraProvider);
    } catch (error) {
      // console.log(error);
      this.ResponseService.buildValidationMessage(error);

      return this.ResponseService.buildFailure(
        "Provider Initialization failed: " + error.message,
        error.stack
      );
    }
  }
  

  async getSupplyChainJsonRpcContractInstance() {
    try {
      let _tokenContractInstance = new this.ethers.Contract(
        this.Config.get("app.supplyChainContractAddress"),
        supplyChainAbi,
        this.jsonRpcProvider,
      );
      return this.ResponseService.buildSuccess(
        "Contract Instance",
        _tokenContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }
  async getSupplyChainWebSocketContractInstance() {
    try {
      let _tokenContractInstance = new this.ethers.Contract(
        this.Config.get("app.supplyChainContractAddress"),
        supplyChainAbi,
        this.webSocketProvider,
      );
      return this.ResponseService.buildSuccess(
        "Contract Instance",
        _tokenContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }

  async getBridgeBaseJsonRpcContractInstance() {
    try {
      const adminPrivKey =  this.Config.get("app.adminPrivKey");

      const adminWalletBSC =  new this.ethers.Wallet(adminPrivKey,this.jsonRpcProvider);
      // let _tokenContractInstance = new this.ethers.Contract(
      //   this.Config.get("app.bscContractAddress"),
      //   bridgeBase,
      //   adminWalletETH,
      // );

      let _tokenContractInstance = new this.ethers.Contract(
        this.Config.get("app.bscContractAddress"),
        bridgeBase,
        adminWalletBSC,
      );
      return this.ResponseService.buildSuccess(
        "Bridge Contract Instance",
        _tokenContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }

  async getBridgeBaseWebSocketContractInstance() {
    try {
      const adminPrivKey =  this.Config.get("app.adminPrivKey");

      const adminWalletBSC =  new this.ethers.Wallet(adminPrivKey,this.webSocketProvider);
      // let _tokenContractInstance = new this.ethers.Contract(
      //   this.Config.get("app.bscContractAddress"),
      //   bridgeBase,
      //   adminWalletETH,
      // );

      let _tokenContractInstance = new this.ethers.Contract(
        this.Config.get("app.bscContractAddress"),
        bridgeBase,
        adminWalletBSC,
      );
      return this.ResponseService.buildSuccess(
        "Bridge Contract Instance",
        _tokenContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }

  async getElxBscContractAddress() {
    try {

      let supplyChainContractAddress = await this.getSupplyChainJsonRpcContractInstance();

      let _elxContractInstance = new this.ethers.Contract(
        await supplyChainContractAddress.data.getTokenAddress(),
        ElxAbi,
        this.webSocketProvider
      );
      return this.ResponseService.buildSuccess(
        "Elx Contract Instance",
        _elxContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }
  async getElxEthContractAddress() {
    try {


      let _elxContractInstance = new this.ethers.Contract(
        this.Config.get("app.ethElxContractAddress"),
        ElxAbi,
        this.infuraProvider
      );
      return this.ResponseService.buildSuccess(
        "Eth Elx Contract Instance",
        _elxContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }

  async getBridgeBaseETHContractInstance() {
    try {
      // const adminPrivKey = 'fb3dc25f1d41dcdf0187b0777bc093f8862c158cb14dae46095a90ac66ac6ada';
      const adminPrivKey =  this.Config.get("app.adminPrivKey");
      
      const adminWalletETH =  new this.ethers.Wallet(adminPrivKey,this.infuraProvider);
      let _tokenContractInstance = new this.ethers.Contract(
        this.Config.get("app.ethContractAddress"),
        bridgeBase,
        adminWalletETH,
      );

      return this.ResponseService.buildSuccess(
        "Bridge Contract Instance",
        _tokenContractInstance
      );
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get contract instance: " + error.message,
        error.stack
      );
    }
  }

  async getLatestBlock() {
    try {
      return this.webSocketProvider.getBlockNumber();
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get provider: " + error.message,
        error.stack
      );
    }
  }
  async getETHLatestBlock() {
    try {
      return this.infuraProvider.getBlockNumber();
    } catch (error) {
      this.ResponseService.buildValidationMessage(error);
      return this.ResponseService.buildFailure(
        "Unable to get provider: " + error.message,
        error.stack
      );
    }
  }

   async formatUnits(_amount) {
      return   this.ethers.utils.formatEther(_amount);
    };
    async parseUnits(_amount)  {
    return   this.ethers.utils.parseUnits(_amount.toString());
  }
  
}

module.exports = BlockchainService;
