---
title: _index
---

# _index

## Constants

<dl>
<dt><a href="#encrypt">encrypt</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>encryptPrivateKey</p>
<p>Encodes and encrypts an account in the format specified by
<a href="https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition">https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition</a>.
However, note that, in keeping with the hash function used by Zilliqa&#39;s
core protocol, the MAC is generated using sha256 instead of keccak.</p>
<p>NOTE: only scrypt and pbkdf2 are supported.</p>
</dd>
<dt><a href="#decrypt">decrypt</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>decryptPrivateKey</p>
<p>Recovers the private key from a keystore file using the given passphrase.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getDerivedKey">getDerivedKey(key, kdf, params)</a> ⇒ <code>Promise.&lt;Buffer&gt;</code></dt>
<dd><p>getDerivedKey</p>
<p>NOTE: only scrypt and pbkdf2 are supported.</p>
</dd>
</dl>

<a name="encrypt"></a>

## encrypt ⇒ <code>Promise.&lt;string&gt;</code>
encryptPrivateKey

Encodes and encrypts an account in the format specified by
https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition.
However, note that, in keeping with the hash function used by Zilliqa's
core protocol, the MAC is generated using sha256 instead of keccak.

NOTE: only scrypt and pbkdf2 are supported.

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| kdf | <code>KDF</code> | the key derivation function to be used |
| privateKey | <code>string</code> | hex-encoded private key |
| passphrase | <code>string</code> | a passphrase used for encryption |

<a name="decrypt"></a>

## decrypt ⇒ <code>Promise.&lt;string&gt;</code>
decryptPrivateKey

Recovers the private key from a keystore file using the given passphrase.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| passphrase | <code>string</code> | 
| keystore | <code>KeystoreV3</code> | 

<a name="getDerivedKey"></a>

## getDerivedKey(key, kdf, params) ⇒ <code>Promise.&lt;Buffer&gt;</code>
getDerivedKey

NOTE: only scrypt and pbkdf2 are supported.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Buffer</code> | the passphrase |
| kdf | <code>KDF</code> | the key derivation function to be used |
| params | <code>KDFParams</code> | params for the kdf |

