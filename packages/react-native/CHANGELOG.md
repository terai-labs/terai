# @terai/react-native

## 0.0.19

### Patch Changes

- bc1a1ba: Keep the user's locale across Terai upgrades. It is now saved under a stable `terai-locale` key instead of `terai-locale-<version>`, so upgrading Terai no longer resets every user to the default locale. On first load, a locale saved by an older version moves to the new key, and the keys older versions left behind (locale and cached dictionaries) are removed. Cached dictionaries stay per version.
- @terai/formatter@0.0.19
  - @terai/ts@0.0.19

## 0.0.18

### Patch Changes

- @terai/formatter@0.0.18
  - @terai/ts@0.0.18

## 0.0.17

### Patch Changes

- 7c404f8: Update dependencies and build tooling, support current translation providers and Next.js 16, preserve glob-based watching with Chokidar 5, and fix CommonJS CLI loading. Declare TypeScript 6 compiler API dependencies explicitly for extraction and transformation. Preserve empty strings, zero, and false during interpolation. CLI/runtime tooling now requires Node.js 22.13 or newer.
  
  Correct package entry points and TypeScript declaration paths. Skip browser-only storage during React Native web static rendering.
- Updated dependencies [7c404f8]
  - @terai/formatter@0.0.17
  - @terai/ts@0.0.17

## 0.0.16

### Patch Changes

- 74683cc: v0.0.16
- Updated dependencies [74683cc]
  - @terai/formatter@0.0.16
  - @terai/ts@0.0.16

## 0.0.15

### Patch Changes

- dcd5184: v0.0.15
- Updated dependencies [dcd5184]
  - @terai/formatter@0.0.15
  - @terai/ts@0.0.15

## 0.0.14

### Patch Changes

- a119986: v0.0.14
- Updated dependencies [a119986]
  - @terai/formatter@0.0.14
  - @terai/ts@0.0.14

## 0.0.13

### Patch Changes

- 19d285e: v0.0.13
- Updated dependencies [19d285e]
  - @terai/formatter@0.0.13
  - @terai/ts@0.0.13

## 0.0.12

### Patch Changes

- 77b5152: v0.0.11
- Updated dependencies [77b5152]
  - @terai/formatter@0.0.12
  - @terai/ts@0.0.12

## 0.0.11

### Patch Changes

- bab0188: v0.0.11
- Updated dependencies [bab0188]
  - @terai/formatter@0.0.11
  - @terai/ts@0.0.11
