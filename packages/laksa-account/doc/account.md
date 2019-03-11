---
title: account
---

# account

## Functions

<dl>
<dt><a href="#{createAccount}">{createAccount}()</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{importAccount}">{importAccount}(privateKey)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{encrypt}">{encrypt}(password, options)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{decrypt}">{decrypt}(password)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#{toFile}">{toFile}(password, options)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#{fromFile}">{fromFile}(keyStore, password)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{signTransactionWithPassword} {sign plain object with password}">{signTransactionWithPassword} {sign plain object with password}(txnObj, password)</a> ⇒ <code>object</code></dt>
<dd></dd>
</dl>

<a name="{createAccount}"></a>

## {createAccount}() ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  
<a name="{importAccount}"></a>

## {importAccount}(privateKey) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>PrivateKey</code> | {privatekey string} |

<a name="{encrypt}"></a>

## {encrypt}(password, options) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | {password string} |
| options | <code>object</code> | {options object for encryption} |

<a name="{decrypt}"></a>

## {decrypt}(password) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | {password string} |

<a name="{toFile}"></a>

## {toFile}(password, options) ⇒ <code>string</code>
**Kind**: global function  
**Returns**: <code>string</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | {description} |
| options | <code>object</code> | {description} |

<a name="{fromFile}"></a>

## {fromFile}(keyStore, password) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| keyStore | <code>object</code> | {description} |
| password | <code>string</code> | {description} |

<a name="{signTransactionWithPassword} {sign plain object with password}"></a>

## {signTransactionWithPassword} {sign plain object with password}(txnObj, password) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {signed transaction object}  

| Param | Type | Description |
| --- | --- | --- |
| txnObj | <code>Transaction</code> | {transaction object} |
| password | <code>string</code> | {password string} |

