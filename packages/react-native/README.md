# @terai/react-native

Terai integration for React Native applications with React 19 support.

## Installation

```bash
npm install @terai/react-native @react-native-async-storage/async-storage
# or
yarn add @terai/react-native @react-native-async-storage/async-storage
# or
pnpm add @terai/react-native @react-native-async-storage/async-storage
```

### iOS Setup

For iOS, you need to install the pods:

```bash
cd ios && pod install
```

## Usage

### Setup

In your app's entry point (usually `App.tsx` or `index.js`), initialize Terai:

```tsx
import { setupTerai } from '@terai/react-native'

// Initialize Terai before rendering your app
setupTerai({
  defaultLocale: 'en',
  loader: (locale, chunkId) =>
    import(`./locales/${locale}/${chunkId}.json`),
  suspense: false, // Optional: enable React Suspense (default: false)
  format: {
    // Optional: global format configuration
    number: { /* Intl.NumberFormatOptions */ },
    date: { /* Intl.DateTimeFormatOptions */ }
  }
})

function App() {
  return (
    // Your app components
  )
}
```

### Using Translations

```tsx
import { useTs, useLocale, setLocale } from '@terai/react-native'
import { View, Text, Button } from 'react-native'

function MyComponent() {
  const { ts } = useTs({ chunkId: 'common' })
  const locale = useLocale()

  const name = 'John'
  const greeting = ts`Hello ${name}!`

  return (
    <View>
      <Text>{greeting}</Text>
      <Text>Current locale: {locale}</Text>
      <Button
        title="Switch to Spanish"
        onPress={() => setLocale('es')}
      />
    </View>
  )
}
```

### Using Format Utilities

```tsx
import { useFormat } from '@terai/react-native'
import { View, Text } from 'react-native'

function PriceComponent() {
  const format = useFormat()

  const price = format.number(1234.56, {
    style: 'currency',
    currency: 'USD'
  })

  const date = format.date(new Date(), {
    dateStyle: 'long'
  })

  return (
    <View>
      <Text>Price: {price}</Text>
      <Text>Date: {date}</Text>
    </View>
  )
}
```

## API

### `setupTerai(config)`

Initialize Terai with your configuration. This should be called before your app renders.

**Config options:**
- `defaultLocale`: The default locale for your app (e.g., 'en')
- `loader`: Async function that loads translation dictionaries
- `suspense` (optional): Enable React Suspense for dictionary loading (default: false)
- `format` (optional): Global format configuration for numbers, dates, etc.

### Hooks

#### `useTs({ chunkId?: string })`

Main hook for translations. Returns a `ts` function for translating messages.

```tsx
const { ts } = useTs({ chunkId: 'common' })
const message = ts`Welcome ${userName}!`
```

#### `useLocale()`

Get the current locale.

```tsx
const locale = useLocale() // 'en'
```

#### `useDictionaries()`

Get all loaded dictionaries.

```tsx
const dictionaries = useDictionaries()
```

#### `useFormat()`

Get format utilities for numbers, dates, lists, etc.

```tsx
const format = useFormat()
const price = format.number(99.99, { style: 'currency', currency: 'USD' })
```

### Functions

#### `setLocale(locale: string)`

Imperatively change the current locale.

```tsx
setLocale('es')
```

## Persistence

Terai automatically persists translations and locale preferences using AsyncStorage. This ensures:

- Instant app startup with cached translations
- Locale preference is remembered across app restarts
- No flash of untranslated content

The data is stored with versioned keys to prevent conflicts when updating Terai versions.

## Differences from @terai/react

The React Native package is nearly identical to the React web package, with the following key differences:

1. **Persistence**: Uses AsyncStorage instead of localStorage
2. **Setup**: `setupTerai()` returns a Promise (though you don't need to await it)
3. **Platform**: Built with `platform: 'neutral'` instead of `platform: 'browser'`

All hooks, APIs, and patterns are identical to maintain consistency across platforms.

## Requirements

- React Native (any recent version)
- React 19+
- @react-native-async-storage/async-storage ^2.0.0

## License

MIT
