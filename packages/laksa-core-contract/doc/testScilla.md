---
title: testScilla
---

# testScilla

## Functions

<dl>
<dt><a href="#{testCall}">{testCall}(gasLimit)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{getABI}">{getABI}({)</a> ⇒ <code>ABI</code></dt>
<dd></dd>
<dt><a href="#{decodeABI}">{decodeABI}({)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setBlockNumber}">{setBlockNumber}(number)</a> ⇒ <code>Contract</code> | <code>false</code></dt>
<dd></dd>
<dt><a href="#{generateNewContractJson}">{generateNewContractJson}()</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setABIe}">{setABIe}(abi)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setCode}">{setCode}(code)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setInitParamsValues}">{setInitParamsValues}(initParams, arrayOfValues)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setCreationBlock}">{setCreationBlock}(blockNumber)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
<dt><a href="#{setBlockchain}">{setBlockchain}(blockNumber)</a> ⇒ <code>Contract</code></dt>
<dd></dd>
</dl>

<a name="{testCall}"></a>

## {testCall}(gasLimit) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw Contract object}  

| Param | Type | Description |
| --- | --- | --- |
| gasLimit | <code>Int</code> | {gasLimit for test call to scilla-runner} |

<a name="{getABI}"></a>

## {getABI}({) ⇒ <code>ABI</code>
**Kind**: global function  
**Returns**: <code>ABI</code> - {ABI object}  

| Param | Type | Description |
| --- | --- | --- |
| { | <code>string</code> | code {scilla code string} |

<a name="{decodeABI}"></a>

## {decodeABI}({) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract}  

| Param | Type | Description |
| --- | --- | --- |
| { | <code>string</code> | code {scilla code string} |

<a name="{setBlockNumber}"></a>

## {setBlockNumber}(number) ⇒ <code>Contract</code> \| <code>false</code>
**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>false</code> - {raw contract}  

| Param | Type | Description |
| --- | --- | --- |
| number | <code>Int</code> | {block number setted to blockchain} |

<a name="{generateNewContractJson}"></a>

## {generateNewContractJson}() ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract with code and init params}  
<a name="{setABIe}"></a>

## {setABIe}(abi) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract}  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>ABI</code> | {ABI object} |

<a name="{setCode}"></a>

## {setCode}(code) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract with code}  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | {scilla code string} |

<a name="{setInitParamsValues}"></a>

## {setInitParamsValues}(initParams, arrayOfValues) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract object}  

| Param | Type | Description |
| --- | --- | --- |
| initParams | <code>Array.&lt;Object&gt;</code> | {init params get from ABI} |
| arrayOfValues | <code>Array.&lt;Object&gt;</code> | {init params set for ABI} |

<a name="{setCreationBlock}"></a>

## {setCreationBlock}(blockNumber) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract object}  

| Param | Type | Description |
| --- | --- | --- |
| blockNumber | <code>Int</code> | {block number for blockchain} |

<a name="{setBlockchain}"></a>

## {setBlockchain}(blockNumber) ⇒ <code>Contract</code>
**Kind**: global function  
**Returns**: <code>Contract</code> - {raw contract object}  

| Param | Type | Description |
| --- | --- | --- |
| blockNumber | <code>Int</code> | {block number for blockchain} |

