'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var Method = _interopDefault(require('laksa-core-methods'));
var Property = _interopDefault(require('laksa-core-properties'));

var methodObjects = [
/**
 * isConnected
 * @params {}
 */
{
  name: 'isConnected',
  call: 'GetNetworkId',
  params: {},
  isSendJson: false
},
/**
 * getTransaction
 * @params {txHash:Hash}
 */
{
  name: 'getTransaction',
  call: 'GetTransaction',
  params: {
    txHash: ['isHash', 'required']
  },
  isSendJson: false
},
/**
 * createTransaction
 * @params {txHash:Hash}
 */
{
  name: 'createTransaction',
  call: 'CreateTransaction',
  params: {
    to: ['isAddress', 'required'],
    pubKey: ['isPubkey', 'required'],
    // FIXME: core must be able to parse amount as string; it currently does
    // not. the issue is being tracked here: https://github.com/Zilliqa/Zilliqa/issues/524
    amount: ['isBN', 'required'],
    gasPrice: ['isNumber', 'required'],
    gasLimit: ['isNumber', 'required']
  },
  transformer: {
    amount: 'toNumber'
  },
  isSendJson: true
},
/**
 * getDsBlock
 * @params {blockNumber:Number}
 */
{
  name: 'getDsBlock',
  call: 'GetDsBlock',
  params: {
    blockNumber: ['isString', 'required']
  },
  isSendJson: false
},
/**
 * getTxBlock
 * @params {blockNumber:Number}
 */
{
  name: 'getTxBlock',
  call: 'GetTxBlock',
  params: {
    blockNumber: ['isString', 'required']
  },
  isSendJson: false
},
/**
 * getLatestDsBlock
 * @params {}
 */
{
  name: 'getLatestDsBlock',
  call: 'GetLatestDsBlock',
  params: {},
  isSendJson: false
},
/**
 * getLatestTxBlock
 * @params {}
 */
{
  name: 'getLatestTxBlock',
  call: 'GetLatestTxBlock',
  params: {},
  isSendJson: false
},
/**
 * getBalance
 * @params {address:Address}
 */
{
  name: 'getBalance',
  call: 'GetBalance',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getGasPrice
 * @params {}
 */
{
  name: 'getGasPrice',
  call: 'GetGasPrice',
  params: {},
  isSendJson: false
},
/**
 * getSmartContractState
 * @params {address:Address}
 */
{
  name: 'getSmartContractState',
  call: 'GetSmartContractState',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getSmartContractCode
 * @params {address:Address}
 */
{
  name: 'getSmartContractCode',
  call: 'GetSmartContractCode',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getSmartContractInit
 * @params:{address:Address}
 */
{
  name: 'getSmartContractInit',
  call: 'GetSmartContractInit',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getSmartContracts
 * @params {address:Address}
 */
{
  name: 'getSmartContracts',
  call: 'GetSmartContracts',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getTransactionHistory
 * @params {address:Address}
 */
{
  name: 'getTransactionHistory',
  call: 'GetTransactionHistory',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * getBlockTransactionCount
 * @params {blockNumber:Number}
 */
{
  name: 'getBlockTransactionCount',
  call: 'GetBlockTransactionCount',
  params: {
    blockNumber: ['isNumber', 'required']
  },
  isSendJson: false
},
/**
 * getCode
 * @params {address:Address}
 */
{
  name: 'getCode',
  call: 'GetCode',
  params: {
    address: ['isAddress', 'required']
  },
  isSendJson: false
},
/**
 * createMessage
 * @params {to:Address,from:Address,gas:Number,gasPrice:Number}
 */
{
  name: 'createMessage',
  call: 'CreateMessage',
  params: {
    to: ['isAddress', 'required'],
    from: ['isAddress', 'optional'],
    gas: ['isNumber', 'optional'],
    gasPrice: ['isNumber', 'optional']
  },
  isSendJson: true
},
/**
 * getGasEstimate
 * @params {
   to: Address,
   from: Address,
   gas: Number,
   gasPrice: Number,
   gasLimit: Number
 }
 */
{
  name: 'getGasEstimate',
  call: 'GetGasEstimate',
  params: {
    to: ['isAddress', 'optional'],
    from: ['isAddress', 'optional'],
    gas: ['isNumber', 'optional'],
    gasPrice: ['isNumber', 'optional'],
    gasLimit: ['isNumber', 'optional']
  },
  isSendJson: true
},
/**
 * getTransactionReceipt
 * @params {txHash:Hash}
 */
{
  name: 'getTransactionReceipt',
  call: 'GetTransactionReceipt',
  params: {
    txHash: ['isHash', 'optional']
  },
  isSendJson: false
},
/**
 * compileCode
 * @params {code:String}
 */
{
  name: 'compileCode',
  call: 'CompileCode',
  params: {
    code: ['isString', 'required']
  },
  isSendJson: true
},
/**
 * checkCode
 */
{
  name: 'checkCode',
  call: '',
  params: {
    code: ['isString', 'required']
  },
  isSendJson: true,
  endpoint: '/v1/checker'
},
/**
 * checkCodeTest
 */
{
  name: 'checkCodeTest',
  call: '',
  params: {
    code: ['isString', 'required']
  },
  isSendJson: true,
  endpoint: '/v1/runner'
},
/**
 * getBlockchainInfo
 * @params {}
 */
{
  name: 'getBlockchainInfo',
  call: 'GetBlockchainInfo',
  params: {},
  isSendJson: false
},
/**
 * getDSBlockListing
 * @params {page:Number}
 */
{
  name: 'getDSBlockListing',
  call: 'DSBlockListing',
  params: {
    page: ['isNumber', 'required']
  },
  isSendJson: false
},
/**
 * getTxBlockListing
 * @params {page:Number}
 */
{
  name: 'getTxBlockListing',
  call: 'TxBlockListing',
  params: {
    page: ['isNumber', 'required']
  },
  isSendJson: false
},
/**
 * getNumTxnsTxEpoch
 * @params {}
 */
{
  name: 'getNumTxnsTxEpoch',
  call: 'GetNumTxnsTxEpoch',
  params: {},
  isSendJson: false
},
/**
 * getNumTxnsDSEpoch
 * @params {}
 */
{
  name: 'getNumTxnsDSEpoch',
  call: 'GetNumTxnsDSEpoch',
  params: {},
  isSendJson: false
},
/**
 * getTransactionListing
 * @params {}
 */
{
  name: 'getTransactionListing',
  call: 'GetTransactionListing',
  params: {},
  isSendJson: false
}];

var propertyObjects = [
/**
 * getHashrate
 * @params {}
 */
{
  name: 'hashrate',
  getter: 'GetHashrate'
},
/**
 * networkId
 * @params {}
 */
{
  name: 'networkId',
  getter: 'GetNetworkId'
},
/**
 * getClientVersion
 * @params {}
 */
{
  name: 'clientVersion',
  getter: 'GetClientVersion'
},
/**
 * getProtocolVersion
 * @params {}
 */
{
  name: 'protocolVersion',
  getter: 'GetProtocolVersion'
},
/**
 * getNodeMining
 * @params {}
 */
{
  name: 'nodeMining',
  getter: 'isNodeMining'
}];

var mapObjectToMethods = function mapObjectToMethods(main) {
  methodObjects.map(function (data) {
    var zilMethod = new Method(data);
    zilMethod.setMessanger(main.messenger);
    zilMethod.assignToObject(main);
    return false;
  });
};

var mapPropertyToObjects = function mapPropertyToObjects(main) {
  propertyObjects.map(function (data) {
    var zilProperty = new Property(data);
    zilProperty.setMessanger(main.messenger);
    zilProperty.assignToObject(main);
    return false;
  });
};

var Zil =
/*#__PURE__*/
function () {
  function Zil(messenger, config) {
    var _this = this;

    _classCallCheck(this, Zil);

    _defineProperty(this, "extendMethod", function (object) {
      if (_typeof(object) !== 'object') {
        throw new Error('Method has to be an object');
      }

      var zilMethod = new Method(object);
      zilMethod.setMessanger(_this.messenger);
      zilMethod.assignToObject(_this);
      return true;
    });

    this.messenger = messenger;
    this.config = config;
    mapObjectToMethods(this);
    mapPropertyToObjects(this);
  }

  _createClass(Zil, [{
    key: "defaultBlock",
    get: function get() {
      return this.config.defaultBlock;
    },
    set: function set(block) {
      this.config.defaultBlock = block;
      return block;
    }
  }, {
    key: "defaultAccount",
    get: function get() {
      return this.config.defaultAccount;
    },
    set: function set(account) {
      this.config.defaultAccount = account;
      return account;
    }
  }]);

  return Zil;
}();

module.exports = Zil;
