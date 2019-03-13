---
title: bytes
---

# bytes

## Functions

<dl>
<dt><a href="#intToHexArray">intToHexArray(int, size)</a> ⇒ <code>Array.&lt;String&gt;</code></dt>
<dd><p>transform a int to hex array</p>
</dd>
<dt><a href="#intToByteArray">intToByteArray(num, size)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>Converts a number to Uint8Array</p>
</dd>
<dt><a href="#hexToByteArray">hexToByteArray(hex)</a> ⇒ <code>Uint8Array</code></dt>
<dd><p>Convers a hex string to a Uint8Array</p>
</dd>
<dt><a href="#hexToIntArray">hexToIntArray(hex)</a> ⇒ <code>Array.&lt;Number&gt;</code></dt>
<dd><p>convert a hex string to int array</p>
</dd>
<dt><a href="#compareBytes">compareBytes(a, b)</a> ⇒ <code>Boolean</code></dt>
<dd><p>A constant time HMAC comparison function.</p>
</dd>
<dt><a href="#isHex">isHex(str)</a> ⇒ <code>Boolean</code></dt>
<dd><p>test string if it is hex string</p>
</dd>
</dl>

<a name="intToHexArray"></a>

## intToHexArray(int, size) ⇒ <code>Array.&lt;String&gt;</code>
transform a int to hex array

**Kind**: global function  
**Returns**: <code>Array.&lt;String&gt;</code> - the hex array result  

| Param | Type | Description |
| --- | --- | --- |
| int | <code>Number</code> | the number to be converted to hex |
| size | <code>Number</code> | the desired width of the hex value. will pad. |

<a name="intToByteArray"></a>

## intToByteArray(num, size) ⇒ <code>Uint8Array</code>
Converts a number to Uint8Array

**Kind**: global function  
**Returns**: <code>Uint8Array</code> - Byte Array result  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | input number |
| size | <code>Number</code> | size of bytes array |

<a name="hexToByteArray"></a>

## hexToByteArray(hex) ⇒ <code>Uint8Array</code>
Convers a hex string to a Uint8Array

**Kind**: global function  
**Returns**: <code>Uint8Array</code> - the ByteArray result  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | hex string to convert |

<a name="hexToIntArray"></a>

## hexToIntArray(hex) ⇒ <code>Array.&lt;Number&gt;</code>
convert a hex string to int array

**Kind**: global function  
**Returns**: <code>Array.&lt;Number&gt;</code> - the int array  

| Param | Type | Description |
| --- | --- | --- |
| hex | <code>string</code> | hex string to convert |

<a name="compareBytes"></a>

## compareBytes(a, b) ⇒ <code>Boolean</code>
A constant time HMAC comparison function.

**Kind**: global function  
**Returns**: <code>Boolean</code> - test result  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>String</code> | hex string |
| b | <code>String</code> | hex string |

<a name="isHex"></a>

## isHex(str) ⇒ <code>Boolean</code>
test string if it is hex string

**Kind**: global function  
**Returns**: <code>Boolean</code> - test result  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | string to be tested |

