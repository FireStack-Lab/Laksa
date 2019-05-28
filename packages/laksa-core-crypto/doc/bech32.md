---
title: bech32
---

# bech32

## Constants

<dl>
<dt><a href="#convertBits">convertBits</a> ⇒ <code>Buffer</code> | <code>null</code></dt>
<dd><p>convertBits</p>
<p>groups buffers of a certain width to buffers of the desired width.</p>
<p>For example, converts byte buffers to buffers of maximum 5 bit numbers,
padding those numbers as necessary. Necessary for encoding Ethereum-style
addresses as bech32 ones.</p>
</dd>
<dt><a href="#toBech32Address">toBech32Address</a> ⇒ <code>string</code></dt>
<dd><p>toBech32Address</p>
<p>Encodes a canonical 20-byte Ethereum-style address as a bech32 zilliqa
address.</p>
<p>The expected format is zil1<address><checksum> where address and checksum
are the result of bech32 encoding a Buffer containing the address bytes.</p>
</dd>
<dt><a href="#fromBech32Address">fromBech32Address</a> ⇒ <code>string</code></dt>
<dd><p>fromBech32Address</p>
</dd>
</dl>

<a name="convertBits"></a>

## convertBits ⇒ <code>Buffer</code> \| <code>null</code>
convertBits

groups buffers of a certain width to buffers of the desired width.

For example, converts byte buffers to buffers of maximum 5 bit numbers,
padding those numbers as necessary. Necessary for encoding Ethereum-style
addresses as bech32 ones.

**Kind**: global constant  

| Param | Type |
| --- | --- |
| data | <code>Buffer</code> | 
| fromWidth | <code>number</code> | 
| toWidth | <code>number</code> | 
| pad | <code>boolean</code> | 

<a name="toBech32Address"></a>

## toBech32Address ⇒ <code>string</code>
toBech32Address

Encodes a canonical 20-byte Ethereum-style address as a bech32 zilliqa
address.

The expected format is zil1<address><checksum> where address and checksum
are the result of bech32 encoding a Buffer containing the address bytes.

**Kind**: global constant  
**Returns**: <code>string</code> - 38 char bech32 encoded zilliqa address  

| Param | Type | Description |
| --- | --- | --- |
| 20 | <code>string</code> | byte canonical address |

<a name="fromBech32Address"></a>

## fromBech32Address ⇒ <code>string</code>
fromBech32Address

**Kind**: global constant  
**Returns**: <code>string</code> - a canonical 20-byte Ethereum-style address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | a valid Zilliqa bech32 address |

