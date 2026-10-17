---
'@terai/dev': patch
'@terai/extractor': patch
'@terai/transformer': patch
'@terai/translator': patch
'@terai/types': patch
'@terai/utils': patch
---

Fix `terai translate` with chunked projects and translator failures:

- Report translator failures instead of `Everything up-to-date`: list the failed locales with their root cause and exit with code `1`.
- Add the `batchSize` option: batches are saved independently, so one failing batch no longer discards the whole locale.
- Keep only the requested ids from the translator response; report and retry missing or empty values.
- Read the `default` chunk from `<locale>.json`, so hand edits there are no longer reverted to the cached value.
- Count each message once, even when it belongs to several chunks.
- Save the cache before rewriting the locale files.
- Make chunk grouping linear (translate on a 6k-message project: ~24s → <1s).
- Deduplicate `chunksIds` and `files` in the manifest, stop chunk ids leaking between files and watch runs, and read `chunkId`/`context` from string literals instead of `eval`.
- Fail `terai extract` instead of writing a partial manifest when a file can't be processed.
