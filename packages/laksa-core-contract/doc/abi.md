---
title: abi
---

# abi

## Classes

<dl>
<dt><a href="#ABI">ABI</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#getParamTypes">getParamTypes(list)</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>extract param types for abi object</p>
</dd>
</dl>

<a name="ABI"></a>

## ABI
**Kind**: global class  

* [ABI](#ABI)
    * [new ABI(abi)](#new_ABI_new)
    * [.events](#ABI.events) : <code>Array</code>
    * [.fields](#ABI.fields) : <code>Array</code>
    * [.name](#ABI.name) : <code>String</code>
    * [.params](#ABI.params) : <code>Array</code>
    * [.transitions](#ABI.transitions) : <code>Array</code>
    * [.getName()](#ABI.getName) ⇒ <code>String</code>
    * [.getInitParams()](#ABI.getInitParams) ⇒ <code>String</code>
    * [.getInitParamTypes()](#ABI.getInitParamTypes) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getFields()](#ABI.getFields) ⇒ <code>Array</code>
    * [.getFieldsTypes()](#ABI.getFieldsTypes) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getTransitions()](#ABI.getTransitions) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getTransitionsParamTypes()](#ABI.getTransitionsParamTypes) ⇒ <code>Array.&lt;Object&gt;</code>
    * [.getEvents()](#ABI.getEvents) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="new_ABI_new"></a>

### new ABI(abi)
ABI instance

**Returns**: [<code>ABI</code>](#ABI) - ABI instance  

| Param | Type | Description |
| --- | --- | --- |
| abi | <code>Object</code> | abi object |

<a name="ABI.events"></a>

### ABI.events : <code>Array</code>
events

**Kind**: static property of [<code>ABI</code>](#ABI)  
<a name="ABI.fields"></a>

### ABI.fields : <code>Array</code>
fields

**Kind**: static property of [<code>ABI</code>](#ABI)  
<a name="ABI.name"></a>

### ABI.name : <code>String</code>
name

**Kind**: static property of [<code>ABI</code>](#ABI)  
<a name="ABI.params"></a>

### ABI.params : <code>Array</code>
params

**Kind**: static property of [<code>ABI</code>](#ABI)  
<a name="ABI.transitions"></a>

### ABI.transitions : <code>Array</code>
transitions

**Kind**: static property of [<code>ABI</code>](#ABI)  
<a name="ABI.getName"></a>

### ABI.getName() ⇒ <code>String</code>
name getter

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>String</code> - ABI.name  
<a name="ABI.getInitParams"></a>

### ABI.getInitParams() ⇒ <code>String</code>
params getter

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>String</code> - ABI.params  
<a name="ABI.getInitParamTypes"></a>

### ABI.getInitParamTypes() ⇒ <code>Array.&lt;Object&gt;</code>
get param types array

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array.&lt;Object&gt;</code> - param types  
<a name="ABI.getFields"></a>

### ABI.getFields() ⇒ <code>Array</code>
fields getter

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array</code> - ABI.fields  
<a name="ABI.getFieldsTypes"></a>

### ABI.getFieldsTypes() ⇒ <code>Array.&lt;Object&gt;</code>
get fields types array

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array.&lt;Object&gt;</code> - fields types  
<a name="ABI.getTransitions"></a>

### ABI.getTransitions() ⇒ <code>Array.&lt;Object&gt;</code>
transitions getter

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array.&lt;Object&gt;</code> - ABI.transitions  
<a name="ABI.getTransitionsParamTypes"></a>

### ABI.getTransitionsParamTypes() ⇒ <code>Array.&lt;Object&gt;</code>
get transitions types array

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array.&lt;Object&gt;</code> - transitions types  
<a name="ABI.getEvents"></a>

### ABI.getEvents() ⇒ <code>Array.&lt;Object&gt;</code>
events getter

**Kind**: static method of [<code>ABI</code>](#ABI)  
**Returns**: <code>Array.&lt;Object&gt;</code> - ABI.events  
<a name="getParamTypes"></a>

## getParamTypes(list) ⇒ <code>Array.&lt;Object&gt;</code>
extract param types for abi object

**Kind**: global function  
**Returns**: <code>Array.&lt;Object&gt;</code> - {description}  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>Array.&lt;Object&gt;</code> | {description} |

