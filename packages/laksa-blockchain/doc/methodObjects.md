---
title: methodObjects
---

# methodObjects

## Functions

<dl>
<dt><a href="#isConnected">isConnected()</a> ⇒ <code>Boolean</code></dt>
<dd><p>connection status from RPC</p>
</dd>
<dt><a href="#getTransaction">getTransaction(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>getTransaction from RPC</p>
</dd>
<dt><a href="#createTransaction">createTransaction(txn)</a> ⇒ <code>Object</code></dt>
<dd><p>getTransaction from RPC</p>
</dd>
<dt><a href="#getDsBlock">getDsBlock(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>getDsBlock info from RPC</p>
</dd>
<dt><a href="#getTxBlock">getTxBlock(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>getTxBlock info from RPC</p>
</dd>
<dt><a href="#getLatestDsBlock">getLatestDsBlock()</a> ⇒ <code>Object</code></dt>
<dd><p>get latest DsBlock from RPC</p>
</dd>
<dt><a href="#getLatestTxBlock">getLatestTxBlock()</a> ⇒ <code>Object</code></dt>
<dd><p>get latest TxBlock from RPC</p>
</dd>
<dt><a href="#getBalance">getBalance(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get balance of dedicated address</p>
</dd>
<dt><a href="#getGasPrice">getGasPrice()</a> ⇒ <code>Object</code></dt>
<dd><p>get gasprice</p>
</dd>
<dt><a href="#getSmartContractState">getSmartContractState(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get smart contract state of dedicated contract address</p>
</dd>
<dt><a href="#getSmartContractCode">getSmartContractCode(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get smart contract code of dedicated contract address</p>
</dd>
<dt><a href="#getSmartContractInit">getSmartContractInit(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get smart contract init params of dedicated contract address</p>
</dd>
<dt><a href="#getSmartContracts">getSmartContracts(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get smart contracts deployed by account address</p>
</dd>
<dt><a href="#getTransactionHistory">getTransactionHistory(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get transaction history of dedicated account address</p>
</dd>
<dt><a href="#getTransactionHistory">getTransactionHistory()</a> ⇒ <code>Object</code></dt>
<dd><p>get recent transactions from RPC Method</p>
</dd>
<dt><a href="#getBlockTransactionCount">getBlockTransactionCount(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get transaction count of dedicated blockNumber</p>
</dd>
<dt><a href="#getTransactionReceipt">getTransactionReceipt(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get transaction receipt of dedicated transaction</p>
</dd>
<dt><a href="#checkCode">checkCode(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>check code from scilla runner endpoint</p>
</dd>
<dt><a href="#checkCodeTest">checkCodeTest(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>call code from scilla runner endpoint</p>
</dd>
<dt><a href="#getBlockchainInfo">getBlockchainInfo()</a> ⇒ <code>Object</code></dt>
<dd><p>get blockchain info from RPC Methods</p>
</dd>
<dt><a href="#getDSBlockListing">getDSBlockListing(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get Ds Block list</p>
</dd>
<dt><a href="#getTxBlockListing">getTxBlockListing(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get Tx Block list</p>
</dd>
<dt><a href="#getNumTxnsTxEpoch">getNumTxnsTxEpoch()</a> ⇒ <code>Object</code></dt>
<dd><p>get transaction epoch transaction numbers</p>
</dd>
<dt><a href="#getNumTxnsTxEpoch">getNumTxnsTxEpoch()</a> ⇒ <code>Object</code></dt>
<dd><p>get DS epoch transaction numbers</p>
</dd>
<dt><a href="#getTransactionListing">getTransactionListing()</a> ⇒ <code>Object</code></dt>
<dd><p>get transaction list</p>
</dd>
<dt><a href="#getMinimumGasPrice">getMinimumGasPrice()</a> ⇒ <code>Object</code></dt>
<dd><p>get minimum gas price</p>
</dd>
<dt><a href="#getPrevDifficulty">getPrevDifficulty()</a> ⇒ <code>Object</code></dt>
<dd><p>get previous difficuty</p>
</dd>
<dt><a href="#getPrevDSDifficulty">getPrevDSDifficulty()</a> ⇒ <code>Object</code></dt>
<dd><p>get previous Ds difficulty</p>
</dd>
<dt><a href="#getTransactionsForTxBlock">getTransactionsForTxBlock(paramObject)</a> ⇒ <code>Object</code></dt>
<dd><p>get transactions for dedicated TxBlock</p>
</dd>
<dt><a href="#getShardingStructure">getShardingStructure()</a> ⇒ <code>Object</code></dt>
<dd><p>get sharding structure from RPC method</p>
</dd>
</dl>

<a name="isConnected"></a>

## isConnected() ⇒ <code>Boolean</code>
connection status from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Boolean</code> - - connection status  
<a name="getTransaction"></a>

## getTransaction(paramObject) ⇒ <code>Object</code>
getTransaction from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.txHash | <code>String</code> | Transaction ID |

<a name="createTransaction"></a>

## createTransaction(txn) ⇒ <code>Object</code>
getTransaction from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| txn | <code>Object</code> | Transaction object |
| txn.toAddr | <code>String</code> | Address |
| txn.pubKey | <code>String</code> | Public key |
| txn.amount | <code>BN</code> | Amount to send |
| txn.gasPrice | <code>BN</code> | GasPrice to send |
| txn.gasLimit | <code>Long</code> | GasLimit to send |
| txn.signature | <code>String</code> | Signature string to send |
| txn.priority | <code>Boolean</code> | Set priority to send to shards |

<a name="getDsBlock"></a>

## getDsBlock(paramObject) ⇒ <code>Object</code>
getDsBlock info from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.blockNumber | <code>String</code> | blockNumber string |

<a name="getTxBlock"></a>

## getTxBlock(paramObject) ⇒ <code>Object</code>
getTxBlock info from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.blockNumber | <code>String</code> | blockNumber string |

<a name="getLatestDsBlock"></a>

## getLatestDsBlock() ⇒ <code>Object</code>
get latest DsBlock from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getLatestTxBlock"></a>

## getLatestTxBlock() ⇒ <code>Object</code>
get latest TxBlock from RPC

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getBalance"></a>

## getBalance(paramObject) ⇒ <code>Object</code>
get balance of dedicated address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | address string |

<a name="getGasPrice"></a>

## getGasPrice() ⇒ <code>Object</code>
get gasprice

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getSmartContractState"></a>

## getSmartContractState(paramObject) ⇒ <code>Object</code>
get smart contract state of dedicated contract address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | smart contract address string |

<a name="getSmartContractCode"></a>

## getSmartContractCode(paramObject) ⇒ <code>Object</code>
get smart contract code of dedicated contract address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | smart contract address string |

<a name="getSmartContractInit"></a>

## getSmartContractInit(paramObject) ⇒ <code>Object</code>
get smart contract init params of dedicated contract address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | smart contract address string |

<a name="getSmartContracts"></a>

## getSmartContracts(paramObject) ⇒ <code>Object</code>
get smart contracts deployed by account address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | smart contract address string |

<a name="getTransactionHistory"></a>

## getTransactionHistory(paramObject) ⇒ <code>Object</code>
get transaction history of dedicated account address

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.address | <code>String</code> | smart contract address string |

<a name="getTransactionHistory"></a>

## getTransactionHistory() ⇒ <code>Object</code>
get recent transactions from RPC Method

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getBlockTransactionCount"></a>

## getBlockTransactionCount(paramObject) ⇒ <code>Object</code>
get transaction count of dedicated blockNumber

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.blockNumber | <code>String</code> | blockNumber string |

<a name="getTransactionReceipt"></a>

## getTransactionReceipt(paramObject) ⇒ <code>Object</code>
get transaction receipt of dedicated transaction

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.txHash | <code>String</code> | transaction ID string |

<a name="checkCode"></a>

## checkCode(paramObject) ⇒ <code>Object</code>
check code from scilla runner endpoint

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.code | <code>String</code> | code string |

<a name="checkCodeTest"></a>

## checkCodeTest(paramObject) ⇒ <code>Object</code>
call code from scilla runner endpoint

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.code | <code>String</code> | code string |

<a name="getBlockchainInfo"></a>

## getBlockchainInfo() ⇒ <code>Object</code>
get blockchain info from RPC Methods

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getDSBlockListing"></a>

## getDSBlockListing(paramObject) ⇒ <code>Object</code>
get Ds Block list

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.page | <code>Number</code> | page number |

<a name="getTxBlockListing"></a>

## getTxBlockListing(paramObject) ⇒ <code>Object</code>
get Tx Block list

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.page | <code>Number</code> | page number |

<a name="getNumTxnsTxEpoch"></a>

## getNumTxnsTxEpoch() ⇒ <code>Object</code>
get transaction epoch transaction numbers

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getNumTxnsTxEpoch"></a>

## getNumTxnsTxEpoch() ⇒ <code>Object</code>
get DS epoch transaction numbers

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getTransactionListing"></a>

## getTransactionListing() ⇒ <code>Object</code>
get transaction list

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getMinimumGasPrice"></a>

## getMinimumGasPrice() ⇒ <code>Object</code>
get minimum gas price

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getPrevDifficulty"></a>

## getPrevDifficulty() ⇒ <code>Object</code>
get previous difficuty

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getPrevDSDifficulty"></a>

## getPrevDSDifficulty() ⇒ <code>Object</code>
get previous Ds difficulty

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
<a name="getTransactionsForTxBlock"></a>

## getTransactionsForTxBlock(paramObject) ⇒ <code>Object</code>
get transactions for dedicated TxBlock

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.txBlock | <code>Number</code> | block number |

<a name="getShardingStructure"></a>

## getShardingStructure() ⇒ <code>Object</code>
get sharding structure from RPC method

**Kind**: global function  
**Extends**: <code>BlockChain.prototype</code>  
**Returns**: <code>Object</code> - - RPC Response Object  
