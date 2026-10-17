# @terai/types

## 0.0.19

No changes in this release.

## 0.0.18

### Patch Changes

- 69a9c27: Fix `terai translate` with chunked projects and translator failures:
  
  - Report translator failures instead of `Everything up-to-date`: list the failed locales with their root cause and exit with code `1`.
  - Add the `batchSize` option: batches are saved independently, so one failing batch no longer discards the whole locale.
  - Keep only the requested ids from the translator response; report and retry missing or empty values.
  - Read the `default` chunk from `<locale>.json`, so hand edits there are no longer reverted to the cached value.
  - Count each message once, even when it belongs to several chunks.
  - Save the cache before rewriting the locale files.
  - Make chunk grouping linear (translate on a 6k-message project: ~24s → <1s).
  - Deduplicate `chunksIds` and `files` in the manifest, stop chunk ids leaking between files and watch runs, and read `chunkId`/`context` from string literals instead of `eval`.
  - Fail `terai extract` instead of writing a partial manifest when a file can't be processed.
  - `Locale`: regenerate from Unicode CLDR 48.2 with a checked-in script (`pnpm --filter @terai/types generate:locales`). Adds the language-region tags devices and browsers send for locales CLDR spells with a script (`zh-CN`, `zh-TW`, `zh-HK`, `sr-RS`, `pa-IN`, `uz-UZ`, … 61 in total). Removes `root` and `en-US-POSIX`, which are not BCP 47 tags, and `pi-Latn-TH`, `prg-001` and `yi-001`, which CLDR no longer ships.

## 0.0.17

No changes in this release.

## 0.0.16

### Patch Changes

- 74683cc: v0.0.16

## 0.0.15

### Patch Changes

- dcd5184: v0.0.15

## 0.0.14

### Patch Changes

- a119986: v0.0.14

## 0.0.13

### Patch Changes

- 19d285e: v0.0.13

## 0.0.12

### Patch Changes

- 77b5152: v0.0.11

## 0.0.11

### Patch Changes

- bab0188: v0.0.11

## 0.0.10

### Patch Changes

- 90a0986: v10.0.0

## 0.0.9

### Patch Changes

- 1588d39: v0.0.9

## 0.0.8

### Patch Changes

- 5a77788: Update build configurations to enable code splitting, treeshaking and sourcemaps

## 0.0.7

### Patch Changes

- 2704bac: Update to React 19

## 0.0.6

### Patch Changes

- 0365a00: Update React config

## 0.0.5

### Patch Changes

- cf235da: Update React definitions and setup arguments

## 0.0.4

### Patch Changes

- 3129d09: v0.0.4

## 0.0.3

### Patch Changes

- 532543c: v0.0.3
- 2f411c1: v0.0.3

## 0.0.2

### Patch Changes

- 129680c: v0.0.2

## 0.0.1

### Patch Changes

- f1a20dd: First release
