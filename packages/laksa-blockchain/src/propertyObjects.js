import { RPCMethod } from './rpc'

export default [
  /**
   * getHashrate
   * @params {}
   */
  {
    name: 'hashrate',
    getter: RPCMethod.GetHashrate
  },
  /**
   * networkId
   * @params {}
   */
  {
    name: 'networkId',
    getter: RPCMethod.GetNetworkId
  },
  /**
   * getClientVersion
   * @params {}
   */
  {
    name: 'clientVersion',
    getter: RPCMethod.GetClientVersion
  },

  /**
   * getProtocolVersion
   * @params {}
   */
  {
    name: 'protocolVersion',
    getter: RPCMethod.GetProtocolVersion
  },
  /**
   * getNodeMining
   * @params {}
   */
  {
    name: 'nodeMining',
    getter: RPCMethod.isNodeMining
  }
]
