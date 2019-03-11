---
title: property
---

# property

<a name="Property"></a>

## Property
**Kind**: global class  

* [Property](#Property)
    * [new Property(options, messenger)](#new_Property_new)
    * _instance_
        * [.setMessenger(msg)](#Property+setMessenger)
        * [.assignToObject(object)](#Property+assignToObject)
        * [.propertyBuilder()](#Property+propertyBuilder) ⇒ <code>any</code>
    * _static_
        * [.name](#Property.name) : <code>String</code>
        * [.getter](#Property.getter) : <code>function</code>
        * [.setter](#Property.setter) : <code>function</code>
        * [.messenger](#Property.messenger) : <code>Messenger</code>

<a name="new_Property_new"></a>

### new Property(options, messenger)
generate a property for class


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | property options |
| messenger | <code>Messenger</code> | Messsenger instance |

<a name="Property+setMessenger"></a>

### property.setMessenger(msg)
messenger setter

**Kind**: instance method of [<code>Property</code>](#Property)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Messenger</code> | messenger instance |

<a name="Property+assignToObject"></a>

### property.assignToObject(object)
assign property to class

**Kind**: instance method of [<code>Property</code>](#Property)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | method object |

<a name="Property+propertyBuilder"></a>

### property.propertyBuilder() ⇒ <code>any</code>
**Kind**: instance method of [<code>Property</code>](#Property)  
**Returns**: <code>any</code> - - property call  
<a name="Property.name"></a>

### Property.name : <code>String</code>
property name

**Kind**: static property of [<code>Property</code>](#Property)  
<a name="Property.getter"></a>

### Property.getter : <code>function</code>
property getter

**Kind**: static property of [<code>Property</code>](#Property)  
<a name="Property.setter"></a>

### Property.setter : <code>function</code>
property setter

**Kind**: static property of [<code>Property</code>](#Property)  
<a name="Property.messenger"></a>

### Property.messenger : <code>Messenger</code>
Messenger instance

**Kind**: static property of [<code>Property</code>](#Property)  
