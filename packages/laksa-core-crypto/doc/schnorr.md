---
title: schnorr
---

# schnorr

## Functions

<dl>
<dt><a href="#generatePrivateKey">generatePrivateKey()</a> ⇒ <code>String</code></dt>
<dd><p>generate a private key</p>
</dd>
<dt><a href="#hash">hash(q, msg, r)</a> ⇒ <code>Buffer</code></dt>
<dd><p>hash message Hash (r | M).</p>
</dd>
<dt><a href="#sign">sign(msg, key, pubkey)</a> ⇒ <code>Signature</code></dt>
<dd><p>sign method</p>
</dd>
<dt><a href="#trySign">trySign(msg, k, privateKey, pubKey)</a> ⇒ <code>Signature</code> | <code>null</code></dt>
<dd><p>try sign message with random k</p>
</dd>
<dt><a href="#verify">verify(msg, signature, key)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify signature.</p>
<ol>
<li>Check if r,s is in [1, ..., order-1]</li>
<li>Compute Q = sG + r*kpub</li>
<li>If Q = O (the neutral point), return 0;</li>
<li>r&#39; = H(Q, kpub, m)</li>
<li>return r&#39; == r</li>
</ol>
</dd>
<dt><a href="#toSignature">toSignature(serialised)</a> ⇒ <code>Signature</code></dt>
<dd></dd>
<dt><a href="#getDRBG">getDRBG(entropy)</a> ⇒ <code>DRBG</code></dt>
<dd><p>generate an HMAC-DRBG.</p>
</dd>
<dt><a href="#signTest">signTest(msg, k, prv, pub)</a> ⇒ <code>Signature</code> | <code>null</code></dt>
<dd><p>a test sign method using string for browser</p>
</dd>
</dl>

<a name="generatePrivateKey"></a>

## generatePrivateKey() ⇒ <code>String</code>
generate a private key

**Kind**: global function  
**Returns**: <code>String</code> - the hex-encoded private key  
<a name="hash"></a>

## hash(q, msg, r) ⇒ <code>Buffer</code>
hash message Hash (r | M).

**Kind**: global function  

| Param | Type |
| --- | --- |
| q | <code>Buffer</code> | 
| msg | <code>Buffer</code> | 
| r | <code>BN</code> | 

<a name="sign"></a>

## sign(msg, key, pubkey) ⇒ <code>Signature</code>
sign method

**Kind**: global function  

| Param | Type |
| --- | --- |
| msg | <code>Buffer</code> | 
| key | <code>Buffer</code> | 
| pubkey | <code>Buffer</code> | 

<a name="trySign"></a>

## trySign(msg, k, privateKey, pubKey) ⇒ <code>Signature</code> \| <code>null</code>
try sign message with random k

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Buffer</code> | the message to sign over |
| k | <code>BN</code> | output of the HMAC-DRBG |
| privateKey | <code>BN</code> | the private key |
| pubKey | <code>Buffer</code> | the public key |

<a name="verify"></a>

## verify(msg, signature, key) ⇒ <code>Boolean</code>
Verify signature.
1. Check if r,s is in [1, ..., order-1]
2. Compute Q = sG + r*kpub
3. If Q = O (the neutral point), return 0;
4. r' = H(Q, kpub, m)
5. return r' == r

**Kind**: global function  

| Param | Type |
| --- | --- |
| msg | <code>Buffer</code> | 
| signature | <code>Buffer</code> | 
| key | <code>Buffer</code> | 

<a name="toSignature"></a>

## toSignature(serialised) ⇒ <code>Signature</code>
**Kind**: global function  
**Returns**: <code>Signature</code> - Signature instance  

| Param | Type | Description |
| --- | --- | --- |
| serialised | <code>String</code> | serialised Signature string, length == 128 |

<a name="getDRBG"></a>

## getDRBG(entropy) ⇒ <code>DRBG</code>
generate an HMAC-DRBG.

**Kind**: global function  

| Param | Type |
| --- | --- |
| entropy | <code>Buffer</code> | 

<a name="signTest"></a>

## signTest(msg, k, prv, pub) ⇒ <code>Signature</code> \| <code>null</code>
a test sign method using string for browser

**Kind**: global function  
**Returns**: <code>Signature</code> \| <code>null</code> - Signature result  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | message string |
| k | <code>String</code> | random k string |
| prv | <code>String</code> | private key string |
| pub | <code>String</code> | public key string |

