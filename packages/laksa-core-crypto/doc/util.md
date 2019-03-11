---
title: util
---

# util

## Constants

<dl>
<dt><a href="#getAddressFromPrivateKey">getAddressFromPrivateKey</a> ⇒ <code>string</code></dt>
<dd><p>getAddressFromPrivateKey</p>
<p>takes a hex-encoded string (private key) and returns its corresponding
20-byte hex-encoded address.</p>
</dd>
<dt><a href="#getPubKeyFromPrivateKey">getPubKeyFromPrivateKey</a> ⇒ <code>string</code></dt>
<dd><p>getPubKeyFromPrivateKey</p>
<p>takes a hex-encoded string (private key) and returns its corresponding
hex-encoded 33-byte public key.</p>
</dd>
<dt><a href="#compressPublicKey">compressPublicKey</a> ⇒ <code>string</code></dt>
<dd><p>compressPublicKey</p>
</dd>
<dt><a href="#getAddressFromPublicKey">getAddressFromPublicKey</a> ⇒ <code>string</code></dt>
<dd><p>getAddressFromPublicKey</p>
<p>takes hex-encoded string and returns the corresponding address</p>
</dd>
<dt><a href="#verifyPrivateKey">verifyPrivateKey</a> ⇒ <code>boolean</code></dt>
<dd><p>verifyPrivateKey</p>
</dd>
<dt><a href="#isValidChecksumAddress">isValidChecksumAddress</a> ⇒ <code>boolean</code></dt>
<dd><p>isValidChecksumAddress</p>
<p>takes hex-encoded string and returns boolean if address is checksumed</p>
</dd>
<dt><a href="#encodeTransactionProto">encodeTransactionProto</a> ⇒ <code>Buffer</code></dt>
<dd><p>encodeTransaction</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#checkValidSignature">checkValidSignature(sig)</a> ⇒ <code>boolean</code></dt>
<dd><p>verify if signature is length===128</p>
</dd>
</dl>

<a name="getAddressFromPrivateKey"></a>

## getAddressFromPrivateKey ⇒ <code>string</code>
getAddressFromPrivateKey

takes a hex-encoded string (private key) and returns its corresponding
20-byte hex-encoded address.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| Key | <code>string</code> | 

<a name="getPubKeyFromPrivateKey"></a>

## getPubKeyFromPrivateKey ⇒ <code>string</code>
getPubKeyFromPrivateKey

takes a hex-encoded string (private key) and returns its corresponding
hex-encoded 33-byte public key.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| privateKey | <code>string</code> | 

<a name="compressPublicKey"></a>

## compressPublicKey ⇒ <code>string</code>
compressPublicKey

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| publicKey | <code>string</code> | 65-byte public key, a point (x, y) |

<a name="getAddressFromPublicKey"></a>

## getAddressFromPublicKey ⇒ <code>string</code>
getAddressFromPublicKey

takes hex-encoded string and returns the corresponding address

**Kind**: global constant  

| Param | Type |
| --- | --- |
| pubKey | <code>string</code> | 

<a name="verifyPrivateKey"></a>

## verifyPrivateKey ⇒ <code>boolean</code>
verifyPrivateKey

**Kind**: global constant  

| Param | Type |
| --- | --- |
| privateKey | <code>string</code> \| <code>Buffer</code> | 

<a name="isValidChecksumAddress"></a>

## isValidChecksumAddress ⇒ <code>boolean</code>
isValidChecksumAddress

takes hex-encoded string and returns boolean if address is checksumed

**Kind**: global constant  

| Param | Type |
| --- | --- |
| address | <code>string</code> | 

<a name="encodeTransactionProto"></a>

## encodeTransactionProto ⇒ <code>Buffer</code>
encodeTransaction

**Kind**: global constant  

| Param | Type |
| --- | --- |
| tx | <code>any</code> | 

<a name="checkValidSignature"></a>

## checkValidSignature(sig) ⇒ <code>boolean</code>
verify if signature is length===128

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| sig | <code>Signature</code> | Signature |

