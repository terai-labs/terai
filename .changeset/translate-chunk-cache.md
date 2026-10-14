---
'@terai/dev': patch
---

`translate`: parse each chunk file once per locale and dedupe `chunksIds`. The cache lookup re-read and re-parsed the whole chunk file for every message, which made `translate` spend minutes at 100% CPU on large projects before translating anything.
