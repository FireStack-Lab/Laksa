import { RPCMethod } from './rpc'

export default [
  /**
   * isConnected
   * @params {}
   */
  {
    name: 'isConnected',
    call: RPCMethod.GetNetworkId,
    params: {},
    isSendJson: false
  },

  /**
   * getTransaction
   * @params {txHash:Hash}
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
   * createTransaction
   * @params {txHash:Hash}
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
      signature: ['isString', 'required']
    },
    transformer: {
      amount: 'toString',
      gasPrice: 'toString',
      gasLimit: 'toString'
    },
    isSendJson: true
  },
  /**
   * getDsBlock
   * @params {blockNumber:Number}
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
   * getTxBlock
   * @params {blockNumber:Number}
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
   * getLatestDsBlock
   * @params {}
   */
  {
    name: 'getLatestDsBlock',
    call: RPCMethod.GetLatestDsBlock,
    params: {},
    isSendJson: false
  },
  /**
   * getLatestTxBlock
   * @params {}
   */
  {
    name: 'getLatestTxBlock',
    call: RPCMethod.GetLatestTxBlock,
    params: {},
    isSendJson: false
  },
  /**
   * getBalance
   * @params {address:Address}
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
   * getGasPrice
   * @params {}
   */
  {
    name: 'getGasPrice',
    call: RPCMethod.GetGasPrice,
    params: {},
    isSendJson: false
  },
  /**
   * getSmartContractState
   * @params {address:Address}
   */
  {
    name: 'getSmartContractState',
    call: RPCMethod.GetSmartContractState,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * getSmartContractCode
   * @params {address:Address}
   */
  {
    name: 'getSmartContractCode',
    call: RPCMethod.GetSmartContractCode,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * getSmartContractInit
   * @params:{address:Address}
   */
  {
    name: 'getSmartContractInit',
    call: RPCMethod.GetSmartContractInit,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * getSmartContracts
   * @params {address:Address}
   */
  {
    name: 'getSmartContracts',
    call: RPCMethod.GetSmartContracts,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * getTransactionHistory
   * @params {address:Address}
   */
  {
    name: 'getTransactionHistory',
    call: RPCMethod.GetTransactionHistory,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },

  /**
   * getRecentTransactions
   * @params {}
   */
  {
    name: 'getRecentTransactions',
    call: RPCMethod.GetRecentTransactions,
    params: {},
    isSendJson: false
  },
  /**
   * getBlockTransactionCount
   * @params {blockNumber:Number}
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
   * getCode
   * @params {address:Address}
   */
  {
    name: 'getCode',
    call: RPCMethod.GetCode,
    params: { address: ['isAddress', 'required'] },
    isSendJson: false
  },
  /**
   * createMessage
   * @params {to:Address,from:Address,gas:Number,gasPrice:Number}
   */
  {
    name: 'createMessage',
    call: RPCMethod.CreateMessage,
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
    call: RPCMethod.GetGasEstimate,
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
    call: RPCMethod.GetTransactionReceipt,
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
    call: RPCMethod.CompileCode,
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
    params: { code: ['isString', 'required'] },
    isSendJson: true,
    endpoint: '/contract/check'
  },
  /**
   * checkCodeTest
   */
  {
    name: 'checkCodeTest',
    call: '',
    params: { code: ['isString', 'required'] },
    isSendJson: true,
    endpoint: '/contract/call'
  },
  /**
   * getBlockchainInfo
   * @params {}
   */
  {
    name: 'getBlockchainInfo',
    call: RPCMethod.GetBlockchainInfo,
    params: {},
    isSendJson: false
  },
  /**
   * getDSBlockListing
   * @params {page:Number}
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
   * getTxBlockListing
   * @params {page:Number}
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
   * getNumTxnsTxEpoch
   * @params {}
   */
  {
    name: 'getNumTxnsTxEpoch',
    call: RPCMethod.GetNumTxnsTxEpoch,
    params: {},
    isSendJson: false
  },
  /**
   * getNumTxnsDSEpoch
   * @params {}
   */
  {
    name: 'getNumTxnsDSEpoch',
    call: RPCMethod.GetNumTxnsDSEpoch,
    params: {},
    isSendJson: false
  },
  /**
   * getTransactionListing
   * @params {}
   */
  {
    name: 'getTransactionListing',
    call: RPCMethod.GetTransactionListing,
    params: {},
    isSendJson: false
  },
  /**
   * getMinimumGasPrice
   * @params {}
   */
  {
    name: 'getMinimumGasPrice',
    call: RPCMethod.GetMinimumGasPrice,
    params: {},
    isSendJson: false
  },
  /**
   * getPrevDifficulty
   * @params {}
   */
  {
    name: 'getPrevDifficulty',
    call: RPCMethod.GetPrevDifficulty,
    params: {},
    isSendJson: false
  },
  /**
   * getPrevDSDifficulty
   * @params {}
   */
  {
    name: 'getPrevDSDifficulty',
    call: RPCMethod.GetPrevDSDifficulty,
    params: {},
    isSendJson: false
  }
]
