/*
  RPC method from @zilliqa-js/core/net.js
*/

export const RPCMethod = Object.freeze({
  // Network-related methods
  GetNetworkId: 'GetNetworkId',
  GetClientVersion: 'GetClientVersion',
  GetProtocolVersion: 'GetProtocolVersion',

  // Blockchain-related methods
  GetBlockchainInfo: 'GetBlockchainInfo',
  GetShardingStructure: 'GetShardingStructure',
  GetDSBlock: 'GetDSBlock',
  GetLatestDSBlock: 'GetLatestDsBlock',
  GetNumDSBlocks: 'GetNumDSBlocks',
  GetDSBlockRate: 'GetDSBlockRate',
  DSBlockListing: 'DSBlockListing',
  GetTxBlock: 'GetTSBlock',
  GetLatestTxBlock: 'GetLatestTxBlock',
  GetNumTxBlocks: 'GetNumTxBlocks',
  GetTxBlockRate: 'GetTxBlockRate',
  TxBlockListing: 'TxBlockListing',
  GetNumTransactions: 'GetNumTransactions',
  GetTransactionRate: 'GetTransactionRate',
  GetCurrentMiniEpoch: 'GetCurrentMiniEpoch',
  GetCurrentDSEpoch: 'GetCurrentDSEpoch',
  // GetBlockTransactionCount : 'GetBlockTransactionCount',

  // Transaction-related methods
  CreateTransaction: 'CreateTransaction',
  GetTransaction: 'GetTransaction',
  // GetTransactionReceipt : 'GetTransactionReceipt',
  GetRecentTransactions: 'GetRecentTransactions',
  GetNumTxnsTxEpoch: 'GetNumTxnsTxEpoch',
  GetNumTxnsDSEpoch: 'GetNumTxnsDSEpoch',
  // GetGasPrice : 'GetGasPrice',
  // GetGasEstimate : 'GetGasEstimate',

  // Contract-related methods
  GetSmartContractCode: 'GetSmartContractCode',
  GetSmartContractInit: 'GetSmartContractInit',
  GetSmartContractState: 'GetSmartContractState',
  GetContractAddressFromTransactionID: 'GetContractAddressFromTransactionID',
  // GetStorageAt : 'GetStorageAt',

  // Account-related methods
  GetBalance: 'GetBalance'
})
