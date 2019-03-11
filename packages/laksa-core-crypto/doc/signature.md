---
title: signature
---

# signature

<a name="Signature"></a>

## Signature
Signature

This replaces `elliptic/lib/elliptic/ec/signature`. This is to avoid
duplicate code in the final bundle, caused by having to bundle elliptic
twice due to its circular dependencies. This can be removed once
https://github.com/indutny/elliptic/pull/157 is resolved, or we find the
time to fork an optimised version of the library.

**Kind**: global class  
