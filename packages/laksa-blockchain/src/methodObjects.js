import { RPCMethod } from './rpc'

const methodArray = [
  /**
   * @function isConnected
   * @description connection status from RPC
   * @extends BlockChain.prototype
   * @return {Boolean} - connection status
   */
  {
    name: 'isConnected',
    call: RPCMethod.GetNetworkId,
    params: {},
    isSendJson: false
  },

  /**
   * @function getTransaction
   * @description getTransaction from RPC
   * @param {Object} paramObject
   * @param {String} paramObject.txHash - Transaction ID
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTransaction',
    call: RPCMethod.GetTransaction,
    params: {
      txHash: ['isHash', 'required']
    },
    isSendJson: false
  },

  /**
   * @function createTransaction
   * @description getTransaction from RPC
   * @param {Object} txn - Transaction object
   * @param {String} txn.toAddr - Address
   * @param {String} txn.pubKey - Public key
   * @param {BN} txn.amount - Amount to send
   * @param {BN} txn.gasPrice - GasPrice to send
   * @param {Long} txn.gasLimit - GasLimit to send
   * @param {String} txn.signature - Signature string to send
   * @param {Boolean} txn.priority - Set priority to send to shards
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'createTransaction',
    call: RPCMethod.CreateTransaction,
    params: {
      toAddr: ['isAddress', 'required'],
      pubKey: ['isPubkey', 'required'],
      amount: ['isBN', 'required'],
      gasPrice: ['isBN', 'required'],
      gasLimit: ['isLong', 'required'],
      signature: ['isString', 'required'],
      priority: ['isBoolean', 'optional']
    },
    transformer: {
      amount: 'toString',
      gasPrice: 'toString',
      gasLimit: 'toString'
    },
    isSendJson: true
  },
  /**
   * @function getDsBlock
   * @description getDsBlock info from RPC
   * @param {Object} paramObject
   * @param {String} paramObject.blockNumber - blockNumber string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getDsBlock',
    call: RPCMethod.GetDSBlock,
    params: {
      blockNumber: ['isString', 'required']
    },
    transformer: {
      blockNumber: 'toString'
    },
    isSendJson: false
  },
  /**
   * @function getTxBlock
   * @description getTxBlock info from RPC
   * @param {Object} paramObject
   * @param {String} paramObject.blockNumber - blockNumber string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTxBlock',
    call: RPCMethod.GetTxBlock,
    params: {
      blockNumber: ['isString', 'required']
    },
    transformer: {
      blockNumber: 'toString'
    },
    isSendJson: false
  },
  /**
   * @function getLatestDsBlock
   * @description get latest DsBlock from RPC
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getLatestDsBlock',
    call: RPCMethod.GetLatestDsBlock,
    params: {},
    isSendJson: false
  },
  /**
   * @function getLatestTxBlock
   * @description get latest TxBlock from RPC
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getLatestTxBlock',
    call: RPCMethod.GetLatestTxBlock,
    params: {},
    isSendJson: false
  },
  /**
   * @function getBalance
   * @description get balance of dedicated address
   * @param {Object} paramObject
   * @param {String} paramObject.address - address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getBalance',
    call: RPCMethod.GetBalance,
    params: {
      address: ['isAddress', 'required']
    },
    isSendJson: false
  },
  /**
   * @function getGasPrice
   * @description get gasprice
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getGasPrice',
    call: RPCMethod.GetGasPrice,
    params: {},
    isSendJson: false
  },
  /**
   * @function getSmartContractState
   * @description get smart contract state of dedicated contract address
   * @param {Object} paramObject
   * @param {String} paramObject.address - smart contract address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getSmartContractState',
    call: RPCMethod.GetSmartContractState,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * @function getSmartContractCode
   * @description get smart contract code of dedicated contract address
   * @param {Object} paramObject
   * @param {String} paramObject.address - smart contract address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getSmartContractCode',
    call: RPCMethod.GetSmartContractCode,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * @function getSmartContractInit
   * @description get smart contract init params of dedicated contract address
   * @param {Object} paramObject
   * @param {String} paramObject.address - smart contract address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getSmartContractInit',
    call: RPCMethod.GetSmartContractInit,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * @function getSmartContracts
   * @description get smart contracts deployed by account address
   * @param {Object} paramObject
   * @param {String} paramObject.address - smart contract address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getSmartContracts',
    call: RPCMethod.GetSmartContracts,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * @function getTransactionHistory
   * @description get transaction history of dedicated account address
   * @param {Object} paramObject
   * @param {String} paramObject.address - smart contract address string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTransactionHistory',
    call: RPCMethod.GetTransactionHistory,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },

  /**
   * @function getTransactionHistory
   * @description get recent transactions from RPC Method
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getRecentTransactions',
    call: RPCMethod.GetRecentTransactions,
    params: {},
    isSendJson: false
  },
  /**
   * @function getBlockTransactionCount
   * @description get transaction count of dedicated blockNumber
   * @param {Object} paramObject
   * @param {String} paramObject.blockNumber - blockNumber string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getBlockTransactionCount',
    call: RPCMethod.GetBlockTransactionCount,
    params: { blockNumber: ['isNumber', 'required'] },
    transformer: {
      blockNumber: 'toString'
    },
    isSendJson: false
  },
  /**
   * @function getTransactionReceipt
   * @description get transaction receipt of dedicated transaction
   * @param {Object} paramObject
   * @param {String} paramObject.txHash - transaction ID string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTransactionReceipt',
    call: RPCMethod.GetTransactionReceipt,
    params: {
      txHash: ['isHash', 'optional']
    },
    isSendJson: false
  },

  /**
   * @function checkCode
   * @description check code from scilla runner endpoint
   * @param {Object} paramObject
   * @param {String} paramObject.code - code string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'checkCode',
    call: '',
    params: { code: ['isString', 'required'] },
    isSendJson: true,
    endpoint: '/contract/check'
  },
  /**
   * @function checkCodeTest
   * @description call code from scilla runner endpoint
   * @param {Object} paramObject
   * @param {String} paramObject.code - code string
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'checkCodeTest',
    call: '',
    params: { code: ['isString', 'required'] },
    isSendJson: true,
    endpoint: '/contract/call'
  },
  /**
   * @function getBlockchainInfo
   * @description get blockchain info from RPC Methods
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getBlockchainInfo',
    call: RPCMethod.GetBlockchainInfo,
    params: {},
    isSendJson: false
  },
  /**
   * @function getDSBlockListing
   * @description get Ds Block list
   * @param {Object} paramObject
   * @param {Number} paramObject.page - page number
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getDSBlockListing',
    call: RPCMethod.DSBlockListing,
    params: {
      page: ['isNumber', 'required']
    },
    isSendJson: false
  },
  /**
   * @function getTxBlockListing
   * @description get Tx Block list
   * @param {Object} paramObject
   * @param {Number} paramObject.page - page number
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTxBlockListing',
    call: RPCMethod.TxBlockListing,
    params: {
      page: ['isNumber', 'required']
    },
    isSendJson: false
  },
  /**
   * @function getNumTxnsTxEpoch
   * @description get transaction epoch transaction numbers
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getNumTxnsTxEpoch',
    call: RPCMethod.GetNumTxnsTxEpoch,
    params: {},
    isSendJson: false
  },
  /**
   * @function getNumTxnsTxEpoch
   * @description get DS epoch transaction numbers
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getNumTxnsDSEpoch',
    call: RPCMethod.GetNumTxnsDSEpoch,
    params: {},
    isSendJson: false
  },
  /**
   * @function getTransactionListing
   * @description get transaction list
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTransactionListing',
    call: RPCMethod.GetTransactionListing,
    params: {},
    isSendJson: false
  },
  /**
   * @function getMinimumGasPrice
   * @description get minimum gas price
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getMinimumGasPrice',
    call: RPCMethod.GetMinimumGasPrice,
    params: {},
    isSendJson: false
  },
  /**
   * @function getPrevDifficulty
   * @description get previous difficuty
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getPrevDifficulty',
    call: RPCMethod.GetPrevDifficulty,
    params: {},
    isSendJson: false
  },
  /**
   * @function getPrevDSDifficulty
   * @description get previous Ds difficulty
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getPrevDSDifficulty',
    call: RPCMethod.GetPrevDSDifficulty,
    params: {},
    isSendJson: false
  },
  /**
   * @function getTransactionsForTxBlock
   * @description get transactions for dedicated TxBlock
   * @param {Object} paramObject
   * @param {Number} paramObject.txBlock - block number
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getTransactionsForTxBlock',
    call: RPCMethod.GetTransactionsForTxBlock,
    params: {
      txBlock: ['isNumber', 'required']
    },
    isSendJson: false
  },
  /**
   * @function getShardingStructure
   * @description get sharding structure from RPC method
   * @extends BlockChain.prototype
   * @return {Object} - RPC Response Object
   */
  {
    name: 'getShardingStructure',
    call: RPCMethod.GetShardingStructure,
    params: {},
    isSendJson: false
  }
]

export default methodArray
