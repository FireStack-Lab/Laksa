---
title: blockchain
---

# blockchain

## Classes

<dl>
<dt><a href="#BlockChain">BlockChain</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#mapObjectToMethods">mapObjectToMethods(main)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Map Method objects to Method instance</p>
</dd>
<dt><a href="#mapPropertyToObjects">mapPropertyToObjects(main)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Map Property objects to Property instance</p>
</dd>
</dl>

<a name="BlockChain"></a>

## BlockChain
**Kind**: global class  

* [BlockChain](#BlockChain)
    * [new BlockChain(messsenger, signer)](#new_BlockChain_new)
    * _instance_
        * [.extendMethod(object)](#BlockChain+extendMethod) ⇒ <code>Boolean</code>
        * [.extendProperty(object)](#BlockChain+extendProperty) ⇒ <code>Boolean</code>
        * [.completeTransaction(tx, account, password)](#BlockChain+completeTransaction) ⇒ <code>any</code>
        * [.confirmTransaction(txHash)](#BlockChain+confirmTransaction) ⇒ <code>Transaction</code>
    * _static_
        * [.messseger](#BlockChain.messseger) : <code>Messenger</code>
        * [.signer](#BlockChain.signer) : <code>Wallet</code>

<a name="new_BlockChain_new"></a>

### new BlockChain(messsenger, signer)
Blockchain instance

**Returns**: [<code>BlockChain</code>](#BlockChain) - - Blockchain instance  

| Param | Type | Description |
| --- | --- | --- |
| messsenger | <code>Messenger</code> | Messenger instance |
| signer | <code>Wallet</code> | Wallet instance as signer |

<a name="BlockChain+extendMethod"></a>

### blockChain.extendMethod(object) ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>BlockChain</code>](#BlockChain)  
**Returns**: <code>Boolean</code> - - status  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | method object |

<a name="BlockChain+extendProperty"></a>

### blockChain.extendProperty(object) ⇒ <code>Boolean</code>
**Kind**: instance method of [<code>BlockChain</code>](#BlockChain)  
**Returns**: <code>Boolean</code> - - status  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | method object |

<a name="BlockChain+completeTransaction"></a>

### blockChain.completeTransaction(tx, account, password) ⇒ <code>any</code>
**Kind**: instance method of [<code>BlockChain</code>](#BlockChain)  
**Returns**: <code>any</code> - - confirmation process  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>Transaction</code> | Transaction to send |
| account | <code>Account</code> | Account for signing if not use Wallet's signer |
| password | <code>String</code> | Password of Account if it is encrypted |

<a name="BlockChain+confirmTransaction"></a>

### blockChain.confirmTransaction(txHash) ⇒ <code>Transaction</code>
**Kind**: instance method of [<code>BlockChain</code>](#BlockChain)  
**Returns**: <code>Transaction</code> - - Transaction instance with confirm/reject state  

| Param | Type | Description |
| --- | --- | --- |
| txHash | <code>String</code> | Transaction ID |

<a name="BlockChain.messseger"></a>

### BlockChain.messseger : <code>Messenger</code>
Messenger instance from parent

**Kind**: static property of [<code>BlockChain</code>](#BlockChain)  
<a name="BlockChain.signer"></a>

### BlockChain.signer : <code>Wallet</code>
Wallet instance from parent

**Kind**: static property of [<code>BlockChain</code>](#BlockChain)  
<a name="mapObjectToMethods"></a>

## mapObjectToMethods(main) ⇒ <code>Boolean</code>
Map Method objects to Method instance

**Kind**: global function  
**Returns**: <code>Boolean</code> - - status  

| Param | Type | Description |
| --- | --- | --- |
| main | [<code>BlockChain</code>](#BlockChain) | assign to Zil class |

<a name="mapPropertyToObjects"></a>

## mapPropertyToObjects(main) ⇒ <code>Boolean</code>
Map Property objects to Property instance

**Kind**: global function  
**Returns**: <code>Boolean</code> - - status  

| Param | Type | Description |
| --- | --- | --- |
| main | [<code>BlockChain</code>](#BlockChain) | assign to Zil class |

