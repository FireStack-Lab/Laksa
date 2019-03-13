---
title: util
---

# util

## Functions

<dl>
<dt><a href="#getAddressFromPrivateKey">getAddressFromPrivateKey(Key)</a> ⇒ <code>String</code></dt>
<dd><p>takes a hex-encoded string (private key) and return its corresponding
20-byte hex-encoded address.</p>
</dd>
<dt><a href="#getPubKeyFromPrivateKey">getPubKeyFromPrivateKey(privateKey)</a> ⇒ <code>String</code></dt>
<dd><p>takes a hex-encoded string (private key) and return its corresponding
hex-encoded 33-byte public key.</p>
</dd>
<dt><a href="#compressPublicKey">compressPublicKey(publicKey)</a> ⇒ <code>String</code></dt>
<dd><p>comporess public key</p>
</dd>
<dt><a href="#getAddressFromPublicKey">getAddressFromPublicKey(pubKey)</a> ⇒ <code>String</code></dt>
<dd><p>takes hex-encoded string and return the corresponding address</p>
</dd>
<dt><a href="#verifyPrivateKey">verifyPrivateKey(privateKey)</a> ⇒ <code>Boolean</code></dt>
<dd><p>verify private key</p>
</dd>
<dt><a href="#toChecksumAddress">toChecksumAddress(address)</a> ⇒ <code>String</code></dt>
<dd><p>convert address to checksum</p>
</dd>
<dt><a href="#isValidChecksumAddress">isValidChecksumAddress(address)</a> ⇒ <code>Boolean</code></dt>
<dd><p>takes hex-encoded string and return boolean if address is checksumed</p>
</dd>
<dt><a href="#encodeTransaction">encodeTransaction(tx)</a> ⇒ <code>Buffer</code></dt>
<dd><p>encode transaction to protobuff standard</p>
</dd>
<dt><a href="#getAddressForContract">getAddressForContract(param)</a> ⇒ <code>String</code></dt>
<dd></dd>
<dt><a href="#checkValidSignature">checkValidSignature(sig)</a> ⇒ <code>Boolean</code></dt>
<dd><p>verify if signature is length===128</p>
</dd>
</dl>

<a name="getAddressFromPrivateKey"></a>

## getAddressFromPrivateKey(Key) ⇒ <code>String</code>
takes a hex-encoded string (private key) and return its corresponding
20-byte hex-encoded address.

**Kind**: global function  

| Param | Type |
| --- | --- |
| Key | <code>String</code> | 

<a name="getPubKeyFromPrivateKey"></a>

## getPubKeyFromPrivateKey(privateKey) ⇒ <code>String</code>
takes a hex-encoded string (private key) and return its corresponding
hex-encoded 33-byte public key.

**Kind**: global function  

| Param | Type |
| --- | --- |
| privateKey | <code>String</code> | 

<a name="compressPublicKey"></a>

## compressPublicKey(publicKey) ⇒ <code>String</code>
comporess public key

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>String</code> | 65-byte public key, a point (x, y) |

<a name="getAddressFromPublicKey"></a>

## getAddressFromPublicKey(pubKey) ⇒ <code>String</code>
takes hex-encoded string and return the corresponding address

**Kind**: global function  

| Param | Type |
| --- | --- |
| pubKey | <code>String</code> | 

<a name="verifyPrivateKey"></a>

## verifyPrivateKey(privateKey) ⇒ <code>Boolean</code>
verify private key

**Kind**: global function  

| Param | Type |
| --- | --- |
| privateKey | <code>String</code> \| <code>Buffer</code> | 

<a name="toChecksumAddress"></a>

## toChecksumAddress(address) ⇒ <code>String</code>
convert address to checksum

**Kind**: global function  
**Returns**: <code>String</code> - checksumed address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>String</code> | address string |

<a name="isValidChecksumAddress"></a>

## isValidChecksumAddress(address) ⇒ <code>Boolean</code>
takes hex-encoded string and return boolean if address is checksumed

**Kind**: global function  

| Param | Type |
| --- | --- |
| address | <code>String</code> | 

<a name="encodeTransaction"></a>

## encodeTransaction(tx) ⇒ <code>Buffer</code>
encode transaction to protobuff standard

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| tx | <code>Transaction</code> \| <code>any</code> | transaction object or Transaction instance |

<a name="getAddressForContract"></a>

## getAddressForContract(param) ⇒ <code>String</code>
**Kind**: global function  
**Returns**: <code>String</code> - Contract address  

| Param | Type | Description |
| --- | --- | --- |
| param | <code>Object</code> |  |
| param.currentNonce | <code>Number</code> | current nonce number |
| param.address | <code>String</code> | deployer's address |

<a name="checkValidSignature"></a>

## checkValidSignature(sig) ⇒ <code>Boolean</code>
verify if signature is length===128

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sig | <code>Signature</code> | Signature |

