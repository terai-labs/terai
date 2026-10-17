---
'@terai/dev': patch
'@terai/extractor': patch
'@terai/runtime': patch
'@terai/transformer': patch
'@terai/translator': patch
'@terai/next': patch
'@terai/formatter': patch
'@terai/react-native': patch
---

Update dependencies and build tooling, support current translation providers and Next.js 16, preserve glob-based watching with Chokidar 5, and fix CommonJS CLI loading. Declare TypeScript 6 compiler API dependencies explicitly for extraction and transformation. Preserve empty strings, zero, and false during interpolation. CLI/runtime tooling now requires Node.js 22.13 or newer.

Correct package entry points and TypeScript declaration paths. Skip browser-only storage during React Native web static rendering.
