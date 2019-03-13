---
title: factory
---

# factory

<a name="Contracts"></a>

## Contracts
**Kind**: global class  

* [Contracts](#Contracts)
    * [new Contracts(messenger, signer)](#new_Contracts_new)
    * _instance_
        * [.messenger](#Contracts+messenger) : <code>Messeger</code>
        * [.signer](#Contracts+signer) : <code>Wallet</code>
    * _static_
        * [.getAddressForContract(tx)](#Contracts.getAddressForContract) ⇒ <code>String</code>
        * [.new(code, init)](#Contracts.new) ⇒ <code>Contract</code>
        * [.at(contract)](#Contracts.at) ⇒ <code>Contract</code>
        * [.testContract(code, init)](#Contracts.testContract) ⇒ <code>Boolean</code>

<a name="new_Contracts_new"></a>

### new Contracts(messenger, signer)
**Returns**: [<code>Contracts</code>](#Contracts) - Contract factory  

| Param | Type | Description |
| --- | --- | --- |
| messenger | <code>Messenger</code> | Messenger instance |
| signer | <code>Wallet</code> | Wallet instance |

<a name="Contracts+messenger"></a>

### contracts.messenger : <code>Messeger</code>
Messenger instance

**Kind**: instance property of [<code>Contracts</code>](#Contracts)  
<a name="Contracts+signer"></a>

### contracts.signer : <code>Wallet</code>
Wallet instance

**Kind**: instance property of [<code>Contracts</code>](#Contracts)  
<a name="Contracts.getAddressForContract"></a>

### Contracts.getAddressForContract(tx) ⇒ <code>String</code>
get Contract address from Transaction

**Kind**: static method of [<code>Contracts</code>](#Contracts)  
**Returns**: <code>String</code> - Contract address  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>Transaction</code> | Transaction instance |

<a name="Contracts.new"></a>

### Contracts.new(code, init) ⇒ <code>Contract</code>
Create a Contract

**Kind**: static method of [<code>Contracts</code>](#Contracts)  
**Returns**: <code>Contract</code> - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Code string |
| init | <code>Array.&lt;Object&gt;</code> | init params |

<a name="Contracts.at"></a>

### Contracts.at(contract) ⇒ <code>Contract</code>
get a Contract from factory and give it Messenger and Wallet as members

**Kind**: static method of [<code>Contracts</code>](#Contracts)  
**Returns**: <code>Contract</code> - Contract instance  

| Param | Type | Description |
| --- | --- | --- |
| contract | <code>Contract</code> | Contract instance |

<a name="Contracts.testContract"></a>

### Contracts.testContract(code, init) ⇒ <code>Boolean</code>
test Contract code and init params, usable before deploying

**Kind**: static method of [<code>Contracts</code>](#Contracts)  
**Returns**: <code>Boolean</code> - test result boolean  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Code string |
| init | <code>Array.&lt;Object&gt;</code> | init params |

