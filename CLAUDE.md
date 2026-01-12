# Terai

Modern localization (i18n) framework for JavaScript/TypeScript.
Workflow: **Develop → Extract → Translate**

## Table of Contents

- [Commands](#commands)
- [Code Style](#code-style)
- [Project Structure](#project-structure)
- [Core Patterns](#core-patterns)
- [Package Reference](#package-reference)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Commands

```bash
# Development
pnpm install                    # Install dependencies
pnpm dev                        # Watch mode (all packages)
pnpm build                      # Build all packages

# Testing
pnpm test                       # Run tests
pnpm test:dev                   # Watch mode
pnpm test:coverage              # With coverage

# Code Quality
pnpm biome check --write .      # Lint + format
npx tsc --noEmit                # Type check

# Release
pnpm changeset                  # Create changeset
pnpm release                    # Publish packages
```

---

## Code Style

**Biome Configuration:**

| Rule | Value |
|------|-------|
| Quotes | Single (`'`) |
| Semicolons | As needed |
| Indentation | Tabs |
| Trailing commas | None |
| JSX quotes | Single |

**File Naming:**

- Source: `kebab-case.ts` (`use-locale.ts`, `to-hash.ts`)
- Tests: `*.test.ts` in `__tests__/` or `__test__/`
- Components: `kebab-case.tsx`

**Disabled Linter Rules:**

- `useExhaustiveDependencies` - Manual dependency management
- `noArrayIndexKey` - Allows index keys
- `noExplicitAny` - Allows `any` when needed
- `noForEach` - Allows `forEach`

---

## Project Structure

```
terai/
├── packages/
│   ├── react/          # React 19 integration (PRIMARY)
│   ├── react-native/   # React Native + Expo
│   ├── next/           # Next.js 16 integration
│   ├── node/           # Node.js integration
│   ├── dev/            # CLI tool (@terai/dev)
│   ├── types/          # Shared TypeScript types
│   ├── ts/             # Translation function factory
│   ├── formatter/      # Intl API formatting
│   ├── extractor/      # Message extraction (AST)
│   ├── translator/     # Translation providers
│   ├── transformer/    # TypeScript AST transformer
│   ├── runtime/        # Node.js runtime utilities
│   ├── generator/      # Dictionary file generation
│   ├── logger/         # CLI logging
│   └── utils/          # Shared utilities
├── playground/
│   ├── vite/           # Vite + React demo
│   ├── hono/           # Hono server demo
│   └── rn-expo/        # React Native Expo demo
└── website/            # Documentation (Next.js)
```

**Dependency Graph:**

```
@terai/types (base)
    ↓
@terai/utils, @terai/logger, @terai/formatter, @terai/ts
    ↓
@terai/transformer → @terai/extractor → @terai/dev (CLI)

@terai/react → @terai/next
@terai/react-native
@terai/node
```

---

## Core Patterns

### Tagged Template Translation

```typescript
const message = ts`Hello ${name}`
const formal = ts({ context: 'formal' })`Hello ${name}`
```

### Hash-Based Message IDs

Location: `packages/utils/src/to-hash.ts`

```
"Hello world" → normalize → DJB2 hash → base-52 → "dQxGBP"
```

### Store Pattern (React)

Location: `packages/react/src/store.ts`

```typescript
class Store {
  getSnapshot(): State
  subscribe(listener): void
  setState(updater): void
}
```

Uses `useSyncExternalStore` for React integration.

### Smart Suspense (React 19)

Location: `packages/react/src/use-ts.ts`

Only suspends when dictionary is not cached:

```typescript
const loadedDictionary = useMemo(() => {
  if (dictionary) return dictionary        // No suspension
  return use(getDictionaryPromise(...))    // Suspends
}, [locale, dictionary])
```

### Persistence

Location: `packages/react/src/persistence.ts`

Versioned localStorage keys prevent stale data:

```typescript
localStorage.setItem('terai-locale-0.0.16', locale)
localStorage.setItem('terai-dictionaries-0.0.16', JSON.stringify(dictionaries))
```

### Code Splitting

```typescript
const { ts } = useTs({ chunkId: 'dashboard' })

// Loader receives chunkId
loader: (locale, chunkId) => import(`./locales/${locale}/${chunkId}.json`)
```

---

## Package Reference

### @terai/react

| File | Purpose |
|------|---------|
| `setup.tsx` | Configuration initialization |
| `store.ts` | State management |
| `use-ts.ts` | Translation hook with Suspense |
| `use-locale.ts` | Locale access |
| `use-format.ts` | Formatting hook |
| `set-locale.ts` | Imperative locale setter |
| `persistence.ts` | localStorage integration |

### @terai/dev

| File | Purpose |
|------|---------|
| `cli.ts` | CLI entry (cac framework) |
| `commands/init.ts` | Project initialization |
| `commands/extract.ts` | Message extraction |
| `commands/translate.ts` | Translation workflow |

### @terai/types

| File | Purpose |
|------|---------|
| `locale.ts` | BCP 47 locale union (1000+) |
| `config.ts` | Configuration type |
| `dictionary.ts` | Dictionary structure |
| `loader.ts` | Loader function type |

### @terai/utils

| File | Purpose |
|------|---------|
| `to-hash.ts` | DJB2 hash + base-52 |
| `prepare-message.ts` | Message normalization |
| `join-template-strings.ts` | Template joining |

---

## Development

### Adding a Hook to @terai/react

1. Create `packages/react/src/use-{name}.ts`
2. Use `useSyncExternalStore`:

```typescript
import { useSyncExternalStore } from 'react'
import { store, selectLocale } from './store'

export function useLocale() {
  return useSyncExternalStore(
    store.subscribe,
    () => selectLocale(store.getSnapshot()),
    () => selectLocale(store.getSnapshot())
  )
}
```

3. Export from `index.ts`
4. Test: `cd playground/vite && pnpm dev`

### Testing CLI Commands

```bash
cd playground/vite
pnpm terai extract
pnpm terai translate
```

### Build Configuration

Standard `tsdown.config.ts`:

```typescript
export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: true,
  sourcemap: true
})
```

### Test Pattern

```typescript
import { describe, expect, test } from 'vitest'
import { toHash } from '../src'

describe('toHash', () => {
  test('generates hash from string', () => {
    expect(toHash('Hello world!')).toMatchInlineSnapshot('"dQxGBP"')
  })
})
```

---

## Translation Providers

Location: `packages/translator/src/translators/`

| Provider | Package |
|----------|---------|
| Vercel AI SDK | `ai` |
| Google Cloud | `@google-cloud/translate` |
| AWS Translate | `@aws-sdk/client-translate` |
| Azure | Azure API |
| DeepL | `deepl-node` |

Custom translator example:

```typescript
// terai.config.ts
import { defineConfig } from '@terai/dev'

export default defineConfig({
  include: ['./src/**/*.{ts,tsx}'],
  projectLocale: 'en-GB',
  outDir: './locale',
  outLocales: ['es-ES', 'fr-FR'],
  translator: async ({ dictionary, locale, projectLocale }) => {
    // Your translation logic
    return translatedDictionary
  }
})
```

---

## Troubleshooting

**"use" hook not working:**
- Ensure React 19 installed
- Wrap in `<Suspense>` boundary

**Locale not persisting:**
- Check localStorage keys match version
- Keys: `terai-locale-{version}`, `terai-dictionaries-{version}`

**Build failing:**
```bash
pnpm clean && pnpm install && pnpm build
```

**Store not updating:**
- Use `setState()`, not direct mutation
- Verify listeners subscribed via `store.subscribe`

---

## API Quick Reference

```typescript
import { setupTerai, useTs, useLocale, useFormat, setLocale } from '@terai/react'

// Setup (before React renders)
setupTerai({
  defaultLocale: 'en',
  suspense: true,
  loader: (locale, chunkId) => import(`./locales/${locale}/${chunkId}.json`)
})

// In components
function App() {
  const { ts } = useTs({ chunkId: 'common' })
  const locale = useLocale()
  const format = useFormat()

  return (
    <div>
      <p>{ts`Hello ${name}`}</p>
      <p>{format.date(new Date(), { dateStyle: 'long' })}</p>
      <button onClick={() => setLocale('es')}>Spanish</button>
    </div>
  )
}
```

---

## Links

- Website: https://terai-labs.github.io/terai
- GitHub: https://github.com/terai-labs/terai
- npm: https://www.npmjs.com/org/terai
