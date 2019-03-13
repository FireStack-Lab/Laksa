import { RPCMethod } from './rpc'

export default [
  /**
   * @function hashrate
   * @description connection status from RPC
   * @extends BlockChain.prototype
   * @return {Object} RPC response Object
   */
  {
    name: 'hashrate',
    getter: RPCMethod.GetHashrate
  },
  /**
   * @function networkId
   * @description network ID for current provider
   * @extends BlockChain.prototype
   * @return {Object} RPC response Object
   */
  {
    name: 'networkId',
    getter: RPCMethod.GetNetworkId
  },
  /**
   * @function clientVersion
   * @description client version for current provider
   * @extends BlockChain.prototype
   * @return {Object} RPC response Object
   */
  {
    name: 'clientVersion',
    getter: RPCMethod.GetClientVersion
  },

  /**
   * @function  protocalVersion
   * @description get protocal version for current provider
   * @extends BlockChain.prototype
   * @return {Object} RPC response Object
   */
  {
    name: 'protocolVersion',
    getter: RPCMethod.GetProtocolVersion
  },
  /**
   * @function nodeMining
   * @description is node mining
   * @extends BlockChain.prototype
   * @return {Object} RPC response Object
   */
  {
    name: 'nodeMining',
    getter: RPCMethod.isNodeMining
  }
]
