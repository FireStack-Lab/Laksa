---
title: wallet
---

# wallet

## Functions

<dl>
<dt><a href="#{updateLength}">{updateLength}()</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#{getIndexKeys}">{getIndexKeys}()</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd></dd>
<dt><a href="#{getCurrentMaxIndex}">{getCurrentMaxIndex}()</a> ⇒ <code>number</code></dt>
<dd></dd>
<dt><a href="#{addAccount}">{addAccount}(accountObject)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{createAccount}">{createAccount}()</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{createBatchAccounts}">{createBatchAccounts}(number)</a> ⇒ <code>Array.&lt;Account&gt;</code></dt>
<dd></dd>
<dt><a href="#{exportAccountByAddress}">{exportAccountByAddress}(address, password, options)</a> ⇒ <code>string</code> | <code>boolean</code></dt>
<dd></dd>
<dt><a href="#{importAccountFromPrivateKey}">{importAccountFromPrivateKey}(privateKey)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{importAccountFromKeyStore}">{importAccountFromKeyStore}(keyStore, password)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{importAccountsFromPrivateKeyList}">{importAccountsFromPrivateKeyList}(privateKeyList)</a> ⇒ <code>Array.&lt;Account&gt;</code></dt>
<dd></dd>
<dt><a href="#{removeOneAccountByAddress}">{removeOneAccountByAddress}(address)</a> ⇒ <code>undefined</code></dt>
<dd></dd>
<dt><a href="#{removeOneAccountByIndex}">{removeOneAccountByIndex}(index)</a> ⇒ <code>undefined</code></dt>
<dd></dd>
<dt><a href="#{getAccountByAddress}">{getAccountByAddress}(address)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{getAccountByIndex}">{getAccountByIndex}(index)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#{getWalletAddresses}">{getWalletAddresses}()</a> ⇒ <code>Array.&lt;Address&gt;</code></dt>
<dd></dd>
<dt><a href="#{getWalletPublicKeys}">{getWalletPublicKeys}()</a> ⇒ <code>Array.&lt;PublicKey&gt;</code></dt>
<dd></dd>
<dt><a href="#{getWalletPrivateKeys}">{getWalletPrivateKeys}()</a> ⇒ <code>Array.&lt;PrivateKey&gt;</code></dt>
<dd></dd>
<dt><a href="#getWalletAccounts">getWalletAccounts()</a> ⇒ <code>Array.&lt;Account&gt;</code></dt>
<dd></dd>
<dt><a href="#{updateAccountByAddress}">{updateAccountByAddress}(address, newObject)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#{cleanAllAccountsw}">{cleanAllAccountsw}()</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#{encryptAllAccounts}">{encryptAllAccounts}(password, options)</a> ⇒ <code>type</code></dt>
<dd></dd>
<dt><a href="#{decryptAllAccounts}">{decryptAllAccounts}(password)</a> ⇒ <code>type</code></dt>
<dd></dd>
<dt><a href="#{encryptAccountByAddress}">{encryptAccountByAddress}(address, password, options, by)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#{decryptAccountByAddress}">{decryptAccountByAddress}(address, password, by)</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#{setSigner}">{setSigner}(obj)</a> ⇒ <code>Wallet</code></dt>
<dd></dd>
<dt><a href="#{sign}">{sign}(tx)</a> ⇒ <code>Transaction</code></dt>
<dd></dd>
</dl>

<a name="{updateLength}"></a>

## {updateLength}() ⇒ <code>number</code>
**Kind**: global function  
**Returns**: <code>number</code> - {wallet account counts}  
<a name="{getIndexKeys}"></a>

## {getIndexKeys}() ⇒ <code>Array.&lt;string&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - {index keys to the wallet}  
<a name="{getCurrentMaxIndex}"></a>

## {getCurrentMaxIndex}() ⇒ <code>number</code>
**Kind**: global function  
**Returns**: <code>number</code> - {max index to the wallet}  
<a name="{addAccount}"></a>

## {addAccount}(accountObject) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| accountObject | <code>Account</code> | {account object} |

<a name="{createAccount}"></a>

## {createAccount}() ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  
<a name="{createBatchAccounts}"></a>

## {createBatchAccounts}(number) ⇒ <code>Array.&lt;Account&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Account&gt;</code> - {created accounts}  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>number</code> | {number of accounts you wanna create} |

<a name="{exportAccountByAddress}"></a>

## {exportAccountByAddress}(address, password, options) ⇒ <code>string</code> \| <code>boolean</code>
**Kind**: global function  
**Returns**: <code>string</code> \| <code>boolean</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {description} |
| password | <code>string</code> | {description} |
| options | <code>object.&lt;T&gt;</code> | {description} |

<a name="{importAccountFromPrivateKey}"></a>

## {importAccountFromPrivateKey}(privateKey) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>PrivateKey</code> | {privatekey string} |

<a name="{importAccountFromKeyStore}"></a>

## {importAccountFromKeyStore}(keyStore, password) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| keyStore | <code>string</code> | {description} |
| password | <code>password</code> | {description} |

<a name="{importAccountsFromPrivateKeyList}"></a>

## {importAccountsFromPrivateKeyList}(privateKeyList) ⇒ <code>Array.&lt;Account&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Account&gt;</code> - {array of accounts}  

| Param | Type | Description |
| --- | --- | --- |
| privateKeyList | <code>Array.&lt;PrivateKey&gt;</code> | {list of private keys} |

<a name="{removeOneAccountByAddress}"></a>

## {removeOneAccountByAddress}(address) ⇒ <code>undefined</code>
**Kind**: global function  
**Returns**: <code>undefined</code> - {}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {account address} |

<a name="{removeOneAccountByIndex}"></a>

## {removeOneAccountByIndex}(index) ⇒ <code>undefined</code>
**Kind**: global function  
**Returns**: <code>undefined</code> - {}  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | {index of account} |

<a name="{getAccountByAddress}"></a>

## {getAccountByAddress}(address) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {account address} |

<a name="{getAccountByIndex}"></a>

## {getAccountByIndex}(index) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | {index of account} |

<a name="{getWalletAddresses}"></a>

## {getWalletAddresses}() ⇒ <code>Array.&lt;Address&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Address&gt;</code> - {array of address}  
<a name="{getWalletPublicKeys}"></a>

## {getWalletPublicKeys}() ⇒ <code>Array.&lt;PublicKey&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;PublicKey&gt;</code> - {array of public Key}  
<a name="{getWalletPrivateKeys}"></a>

## {getWalletPrivateKeys}() ⇒ <code>Array.&lt;PrivateKey&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;PrivateKey&gt;</code> - {array of private key}  
<a name="getWalletAccounts"></a>

## getWalletAccounts() ⇒ <code>Array.&lt;Account&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;Account&gt;</code> - {array of account}  
<a name="{updateAccountByAddress}"></a>

## {updateAccountByAddress}(address, newObject) ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - {is successful}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {account address} |
| newObject | <code>Account</code> | {account object to be updated} |

<a name="{cleanAllAccountsw}"></a>

## {cleanAllAccountsw}() ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - {is successful}  
<a name="{encryptAllAccounts}"></a>

## {encryptAllAccounts}(password, options) ⇒ <code>type</code>
**Kind**: global function  
**Returns**: <code>type</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | {password} |
| options | <code>object</code> | {encryption options} |

<a name="{decryptAllAccounts}"></a>

## {decryptAllAccounts}(password) ⇒ <code>type</code>
**Kind**: global function  
**Returns**: <code>type</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | {decrypt password} |

<a name="{encryptAccountByAddress}"></a>

## {encryptAccountByAddress}(address, password, options, by) ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - {status}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {account address} |
| password | <code>string</code> | {password string for encryption} |
| options | <code>object</code> | {encryption options} |
| by | <code>Symbol</code> | {Symbol that encrypted by} |

<a name="{decryptAccountByAddress}"></a>

## {decryptAccountByAddress}(address, password, by) ⇒ <code>boolean</code>
**Kind**: global function  
**Returns**: <code>boolean</code> - {status}  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>Address</code> | {account address} |
| password | <code>string</code> | {password string to decrypt} |
| by | <code>Symbol</code> | {Symbol that decrypted by} |

<a name="{setSigner}"></a>

## {setSigner}(obj) ⇒ <code>Wallet</code>
**Kind**: global function  
**Returns**: <code>Wallet</code> - {wallet instance}  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Account</code> | {account object} |

<a name="{sign}"></a>

## {sign}(tx) ⇒ <code>Transaction</code>
**Kind**: global function  
**Returns**: <code>Transaction</code> - {signed transaction object}  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>Transaction</code> | {transaction bytes} |

