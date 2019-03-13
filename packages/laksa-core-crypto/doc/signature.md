---
title: signature
---

# signature

<a name="Signature"></a>

## Signature
**Kind**: global class  

* [Signature](#Signature)
    * [new Signature()](#new_Signature_new)
    * [.r](#Signature+r) : <code>BN</code>
    * [.s](#Signature+s) : <code>BN</code>

<a name="new_Signature_new"></a>

### new Signature()
This replaces `elliptic/lib/elliptic/ec/signature`. This is to avoid
duplicate code in the final bundle, caused by having to bundle elliptic
twice due to its circular dependencies. This can be removed once
https://github.com/indutny/elliptic/pull/157 is resolved, or we find the
time to fork an optimised version of the library.

<a name="Signature+r"></a>

### signature.r : <code>BN</code>
**Kind**: instance property of [<code>Signature</code>](#Signature)  
<a name="Signature+s"></a>

### signature.s : <code>BN</code>
**Kind**: instance property of [<code>Signature</code>](#Signature)  
