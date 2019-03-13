---
title: transaction
---

# transaction

## Classes

<dl>
<dt><a href="#Transaction">Transaction</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#isPending">isPending()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isInitialised">isInitialised()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isRejected">isRejected()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isConfirmed">isConfirmed()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#isRejected">isRejected()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
</dl>

<a name="Transaction"></a>

## Transaction
**Kind**: global class  

* [Transaction](#Transaction)
    * [new Transaction(params, messenger, status, toDs)](#new_Transaction_new)
    * _instance_
        * [.setStatus(status)](#Transaction+setStatus) ⇒ <code>undefined</code>
    * _static_
        * [.confirm(params)](#Transaction.confirm)
        * [.reject(params)](#Transaction.reject)

<a name="new_Transaction_new"></a>

### new Transaction(params, messenger, status, toDs)
Createa a Transaction instance

**Returns**: [<code>Transaction</code>](#Transaction) - = Transaction instance  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params object |
| messenger | <code>Messenger</code> | messenger instance |
| status | <code>String</code> | txstatus |
| toDs | <code>Boolean</code> | send to Shard |

<a name="Transaction+setStatus"></a>

### transaction.setStatus(status) ⇒ <code>undefined</code>
**Kind**: instance method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| status | <code>TxStatus</code> | 

<a name="Transaction.confirm"></a>

### Transaction.confirm(params)
**Kind**: static method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| params | <code>BaseTx</code> | 

<a name="Transaction.reject"></a>

### Transaction.reject(params)
**Kind**: static method of [<code>Transaction</code>](#Transaction)  

| Param | Type |
| --- | --- |
| params | <code>BaseTx</code> | 

<a name="isPending"></a>

## isPending() ⇒ <code>boolean</code>
**Kind**: global function  
<a name="isInitialised"></a>

## isInitialised() ⇒ <code>boolean</code>
**Kind**: global function  
<a name="isRejected"></a>

## isRejected() ⇒ <code>boolean</code>
**Kind**: global function  
<a name="isConfirmed"></a>

## isConfirmed() ⇒ <code>boolean</code>
**Kind**: global function  
<a name="isRejected"></a>

## isRejected() ⇒ <code>boolean</code>
**Kind**: global function  
