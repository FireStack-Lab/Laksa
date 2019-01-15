import { ABI } from '../src'
import { abi } from './fixtures/abi'

describe('Test ABI', () => {
  it('should test ABI instantce', () => {
    const newAbi = new ABI(abi)
    expect(newAbi.events).toEqual([])
    expect(newAbi.fields).toEqual([
      {
        name: 'tokenOwnerMap',
        type: 'Map (Uint256) (ByStr20)'
      },
      {
        name: 'ownedTokenCount',
        type: 'Map (ByStr20) (Uint256)'
      },
      {
        name: 'tokenApprovals',
        type: 'Map (Uint256) (ByStr20)'
      },
      {
        name: 'operatorApprovals',
        type: 'Map (ByStr20) (Map (ByStr20) (Bool))'
      }
    ])
    expect(newAbi.params).toEqual([
      {
        name: 'contractOwner',
        type: 'ByStr20'
      },
      {
        name: 'name',
        type: 'String'
      },
      {
        name: 'symbol',
        type: 'String'
      }
    ])
    expect(newAbi.name).toEqual('NonfungibleToken')
    expect(newAbi.transitions).toEqual([
      {
        name: 'balanceOf',
        params: [
          {
            name: 'address',
            type: 'ByStr20'
          }
        ]
      },
      {
        name: 'ownerOf',
        params: [
          {
            name: 'tokenId',
            type: 'Uint256'
          }
        ]
      },
      {
        name: 'mint',
        params: [
          {
            name: 'to',
            type: 'ByStr20'
          },
          {
            name: 'tokenId',
            type: 'Uint256'
          }
        ]
      },
      {
        name: 'transferFrom',
        params: [
          {
            name: 'from',
            type: 'ByStr20'
          },
          {
            name: 'to',
            type: 'ByStr20'
          },
          {
            name: 'tokenId',
            type: 'Uint256'
          }
        ]
      },
      {
        name: 'approve',
        params: [
          {
            name: 'to',
            type: 'ByStr20'
          },
          {
            name: 'tokenId',
            type: 'Uint256'
          }
        ]
      },
      {
        name: 'setApprovalForAll',
        params: [
          {
            name: 'to',
            type: 'ByStr20'
          },
          {
            name: 'approved',
            type: 'Bool'
          }
        ]
      }
    ])
    expect(newAbi.getInitParams()).toEqual(newAbi.params)
    expect(newAbi.getEvents()).toEqual(newAbi.events)
    expect(newAbi.getFields()).toEqual(newAbi.fields)
    expect(newAbi.getTransitions()).toEqual(newAbi.transitions)
    expect(newAbi.getName()).toEqual(newAbi.name)

    expect(newAbi.getFieldsTypes()).toEqual([
      'Map (Uint256) (ByStr20)',
      'Map (ByStr20) (Uint256)',
      'Map (Uint256) (ByStr20)',
      'Map (ByStr20) (Map (ByStr20) (Bool))'
    ])
    expect(newAbi.getInitParamTypes()).toEqual(['ByStr20', 'String', 'String'])
    expect(newAbi.getTransitionsParamTypes()).toEqual([
      ['ByStr20'],
      ['Uint256'],
      ['ByStr20', 'Uint256'],
      ['ByStr20', 'ByStr20', 'Uint256'],
      ['ByStr20', 'Uint256'],
      ['ByStr20', 'Bool']
    ])
  })
  it('should test ABI empty instantce', () => {
    const newAbi = new ABI()
    expect(newAbi.events).toEqual([])
    expect(newAbi.fields).toEqual([])
    expect(newAbi.params).toEqual([])
    expect(newAbi.name).toEqual('')
    expect(newAbi.transitions).toEqual([])
    expect(newAbi.getInitParams()).toEqual(newAbi.params)
    expect(newAbi.getEvents()).toEqual(newAbi.events)
    expect(newAbi.getFields()).toEqual(newAbi.fields)
    expect(newAbi.getTransitions()).toEqual(newAbi.transitions)
    expect(newAbi.getName()).toEqual(newAbi.name)

    expect(newAbi.getFieldsTypes()).toEqual([])
    expect(newAbi.getInitParamTypes()).toEqual([])
    expect(newAbi.getTransitionsParamTypes()).toEqual([])
  })
})
