---
title: contract
---

# contract

<a name="Contract"></a>

## Contract
**Kind**: global class  

* [Contract](#Contract)
    * [new Contract(params, factory, status)](#new_Contract_new)
    * [.code](#Contract.code) : <code>String</code>
    * [.init](#Contract.init) : <code>Array.&lt;Object&gt;</code>
    * [.version](#Contract.version) : <code>Number</code>
    * [.ContractAddress](#Contract.ContractAddress) : <code>String</code>
    * [.messenger](#Contract.messenger) : <code>Messenger</code>
    * [.signer](#Contract.signer) : <code>Wallet</code>
    * [.status](#Contract.status) : <code>String</code>
    * [.transaction](#Contract.transaction) : <code>Transaction</code> \| <code>Object</code>
    * [.isInitialised()](#Contract.isInitialised) ⇒ <code>Boolean</code>
    * [.isSigned()](#Contract.isSigned) ⇒ <code>Boolean</code>
    * [.isSent()](#Contract.isSent) ⇒ <code>Boolean</code>
    * [.isDeployed()](#Contract.isDeployed) ⇒ <code>Boolean</code>
    * [.isRejected()](#Contract.isRejected) ⇒ <code>Boolean</code>
    * [.deployPayload()](#Contract.deployPayload) ⇒ <code>Object</code>
    * [.callPayload()](#Contract.callPayload) ⇒ <code>Object</code>
    * [.setStatus(status)](#Contract.setStatus)
    * [.setInitParamsValues(initParams, arrayOfValues)](#Contract.setInitParamsValues) ⇒ [<code>Contract</code>](#Contract)
    * [.deploy(deployObject)](#Contract.deploy) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
    * [.call(callObject)](#Contract.call) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
    * [.sendContract(paramObject)](#Contract.sendContract) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
    * [.signTxn(paramObject)](#Contract.signTxn) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
    * [.confirmTx(maxAttempts, interval)](#Contract.confirmTx) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
    * [.getState()](#Contract.getState) ⇒ <code>Object</code>
    * [.setDeployPayload(deployObject)](#Contract.setDeployPayload) ⇒ [<code>Contract</code>](#Contract)
    * [.setCallPayload(callObject)](#Contract.setCallPayload) ⇒ [<code>Contract</code>](#Contract)

<a name="new_Contract_new"></a>

### new Contract(params, factory, status)
**Returns**: [<code>Contract</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | contract params |
| factory | <code>Contracts</code> | contract factory |
| status | <code>String</code> | Contract status |

<a name="Contract.code"></a>

### Contract.code : <code>String</code>
code

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.init"></a>

### Contract.init : <code>Array.&lt;Object&gt;</code>
init

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.version"></a>

### Contract.version : <code>Number</code>
version

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.ContractAddress"></a>

### Contract.ContractAddress : <code>String</code>
ContractAddress

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.messenger"></a>

### Contract.messenger : <code>Messenger</code>
messenger

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.signer"></a>

### Contract.signer : <code>Wallet</code>
signer

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.status"></a>

### Contract.status : <code>String</code>
status

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.transaction"></a>

### Contract.transaction : <code>Transaction</code> \| <code>Object</code>
transaction

**Kind**: static property of [<code>Contract</code>](#Contract)  
<a name="Contract.isInitialised"></a>

### Contract.isInitialised() ⇒ <code>Boolean</code>
return true if the contract has been initialised

**Kind**: static method of [<code>Contract</code>](#Contract)  
<a name="Contract.isSigned"></a>

### Contract.isSigned() ⇒ <code>Boolean</code>
return true if the contract has been signed

**Kind**: static method of [<code>Contract</code>](#Contract)  
<a name="Contract.isSent"></a>

### Contract.isSent() ⇒ <code>Boolean</code>
return true if the contract has been sent

**Kind**: static method of [<code>Contract</code>](#Contract)  
<a name="Contract.isDeployed"></a>

### Contract.isDeployed() ⇒ <code>Boolean</code>
return true if the contract has been deployed

**Kind**: static method of [<code>Contract</code>](#Contract)  
<a name="Contract.isRejected"></a>

### Contract.isRejected() ⇒ <code>Boolean</code>
return true if the contract has been rejected

**Kind**: static method of [<code>Contract</code>](#Contract)  
<a name="Contract.deployPayload"></a>

### Contract.deployPayload() ⇒ <code>Object</code>
return deploy payload

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: <code>Object</code> - - Deploy payload  
<a name="Contract.callPayload"></a>

### Contract.callPayload() ⇒ <code>Object</code>
return deploy payload

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: <code>Object</code> - - call payload  
<a name="Contract.setStatus"></a>

### Contract.setStatus(status)
set Contract status

**Kind**: static method of [<code>Contract</code>](#Contract)  

| Param | Type | Description |
| --- | --- | --- |
| status | <code>String</code> | contract status during all life-time |

<a name="Contract.setInitParamsValues"></a>

### Contract.setInitParamsValues(initParams, arrayOfValues) ⇒ [<code>Contract</code>](#Contract)
set init params value and return Contract

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Contract</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| initParams | <code>Array.&lt;Object&gt;</code> | init params get from ABI |
| arrayOfValues | <code>Array.&lt;Object&gt;</code> | init params set for ABI |

<a name="Contract.deploy"></a>

### Contract.deploy(deployObject) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
deploy Contract with a few parameters

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Promise.&lt;Contract&gt;</code>](#Contract) - Contract with Contract Status  

| Param | Type | Description |
| --- | --- | --- |
| deployObject | <code>Object</code> |  |
| deployObject.gasLimit | <code>Long</code> | gasLimit |
| deployObject.gasPrice | <code>BN</code> | gasPrice |
| deployObject.toDS | <code>Boolean</code> | toDS |
| deployObject.account | <code>Account</code> | account to sign |
| deployObject.password | <code>String</code> | account's password if it's encrypted |
| deployObject.maxAttempts | <code>Number</code> | max try when confirming transaction |
| deployObject.interval | <code>Number</code> | retry interval |

<a name="Contract.call"></a>

### Contract.call(callObject) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
call a deployed contract with a set of parameters

**Kind**: static method of [<code>Contract</code>](#Contract)  

| Param | Type | Description |
| --- | --- | --- |
| callObject | <code>Object</code> |  |
| callObject.transition | <code>String</code> | transition name defined by smart contract |
| callObject.params | <code>Array.&lt;Object&gt;</code> | array of params send to transition |
| callObject.amount | <code>BN</code> | call amount |
| callObject.toDS | <code>Boolean</code> | toDS |
| callObject.account | <code>Account</code> | account to sign |
| callObject.password | <code>String</code> | account's password if it's encrypted |
| callObject.maxAttempts | <code>Number</code> | max try when confirming transaction |
| callObject.interval | <code>Number</code> | retry interval |

<a name="Contract.sendContract"></a>

### Contract.sendContract(paramObject) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
send contract with account and password

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Promise.&lt;Contract&gt;</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.account | <code>Account</code> | Account to sign |
| paramObject.password | <code>String</code> | Account's password if it is encrypted |

<a name="Contract.signTxn"></a>

### Contract.signTxn(paramObject) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
sign contract with account and password

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Promise.&lt;Contract&gt;</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| paramObject | <code>Object</code> |  |
| paramObject.account | <code>Account</code> | Account to sign |
| paramObject.password | <code>String</code> | Account's password if it is encrypted |

<a name="Contract.confirmTx"></a>

### Contract.confirmTx(maxAttempts, interval) ⇒ [<code>Promise.&lt;Contract&gt;</code>](#Contract)
confirm transaction with maxAttempts and intervel

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Promise.&lt;Contract&gt;</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| maxAttempts | <code>Number</code> | max tries |
| interval | <code>Number</code> | try confirm intervally |

<a name="Contract.getState"></a>

### Contract.getState() ⇒ <code>Object</code>
get smart contract state

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: <code>Object</code> - RPC response  
<a name="Contract.setDeployPayload"></a>

### Contract.setDeployPayload(deployObject) ⇒ [<code>Contract</code>](#Contract)
set deploy payload

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Contract</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| deployObject | <code>Object</code> |  |
| deployObject.gasLimit | <code>Long</code> | gas limit |
| deployObject.gasPrice | <code>BN</code> | gas price |
| deployObject.toDS | <code>Boolean</code> | if send to shard |

<a name="Contract.setCallPayload"></a>

### Contract.setCallPayload(callObject) ⇒ [<code>Contract</code>](#Contract)
set call contract payload

**Kind**: static method of [<code>Contract</code>](#Contract)  
**Returns**: [<code>Contract</code>](#Contract) - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| callObject | <code>Object</code> |  |
| callObject.transition | <code>String</code> | transition name defined by smart contract |
| callObject.params | <code>Array.&lt;Object&gt;</code> | array of params send to transition |
| callObject.amount | <code>BN</code> | call amount |
| callObject.gasLimit | <code>Long</code> | gas limit |
| callObject.gasPrice | <code>BN</code> | gas price |
| callObject.toDS | <code>Boolean</code> | if send to shard |

