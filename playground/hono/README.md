# Terai + Hono API Playground

This playground demonstrates how to use `@terai/node` with Hono, a fast web framework for Node.js.

## Features Demonstrated

- **Setup & Initialization**: Configure Terai with a custom loader
- **Translation Function (`getTs`)**: Translate messages with variable interpolation
- **Formatting (`getFormat`)**: Format numbers, dates, currencies
- **Locale Management**: Switch locales dynamically per request
- **Multiple Endpoints**: Real-world API examples

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Extract and Translate Messages (Optional)

To enable actual translations, extract messages from source code:

```bash
pnpm terai extract
```

This generates correct message IDs that match the template literals in the code. The placeholder translations in the `locale/` folder won't work until this step is done, as Terai auto-generates message IDs from content hashes.

### 3. Start the Development Server

```bash
pnpm dev
```

The API will start on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
curl http://localhost:3000/
```

Response:
```json
{
  "message": "Terai + Hono API Playground",
  "status": "healthy",
  "currentLocale": "en"
}
```

### Greeting with Translation

```bash
# English (default)
curl http://localhost:3000/greet/World

# Spanish
curl "http://localhost:3000/greet/Mundo?locale=es"
```

Response (English):
```json
{
  "message": "Hello, World!",
  "locale": "en"
}
```

Response (Spanish):
```json
{
  "message": "¡Hola, Mundo!",
  "locale": "es"
}
```

### Welcome Message

```bash
curl http://localhost:3000/welcome
curl "http://localhost:3000/welcome?locale=es"
```

### Current Time with Formatting

```bash
curl http://localhost:3000/time
curl "http://localhost:3000/time?locale=es"
```

### Number Formatting Statistics

```bash
curl http://localhost:3000/stats
curl "http://localhost:3000/stats?locale=es"
```

Response:
```json
{
  "stats": {
    "users": "12,345",
    "revenue": "$99,999.99",
    "percentage": "85.6%"
  },
  "locale": "en"
}
```

### Process Items (POST)

```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"items": [1, 2, 3, 4, 5]}'
```

Response:
```json
{
  "message": "Successfully processed 5 items",
  "count": 5,
  "locale": "en"
}
```

### User Lookup

```bash
# Success
curl http://localhost:3000/user/123

# Not found error (translated)
curl http://localhost:3000/user/404
curl "http://localhost:3000/user/404?locale=es"
```

### Locale Information

```bash
curl http://localhost:3000/locale
```

## Locale Switching

You can switch locales in two ways:

1. **Query Parameter**: Add `?locale=es` to any endpoint
2. **Accept-Language Header**: Set the `Accept-Language` header

Example with header:
```bash
curl -H "Accept-Language: es" http://localhost:3000/greet/World
```

## Supported Locales

- `en` - English (default)
- `es` - Spanish

## Adding New Translations

1. Extract messages from source code:
   ```bash
   pnpm terai extract
   ```

2. Translate messages:
   ```bash
   pnpm terai translate
   ```

3. Or manually edit locale files in `locale/en/en.json` and `locale/es/es.json`

## Project Structure

```
playground/hono/
├── src/
│   └── index.ts          # Main API implementation
├── locale/
│   ├── en/
│   │   └── en.json       # English translations
│   └── es/
│       └── es.json       # Spanish translations
├── package.json
├── tsconfig.json
├── terai.config.ts       # Terai CLI configuration
└── README.md
```

## How It Works

### 1. Setup

```typescript
import { setup } from '@terai/node'

setup({
  defaultLocale: 'en',
  loader: async (locale: string) => {
    const dictionary = await import(`../locale/${locale}/${locale}.json`)
    return dictionary.default
  }
})
```

### 2. Using Translations

```typescript
import { getTs } from '@terai/node'

const ts = await getTs()
const message = ts`Hello, ${name}!`
```

### 3. Formatting

```typescript
import { getFormat } from '@terai/node'

const format = getFormat()
const price = format.number(99.99, {
  style: 'currency',
  currency: 'USD'
})
```

### 4. Switching Locales

```typescript
import { setLocale } from '@terai/node'

setLocale('es')
```

## Learn More

- [Terai Documentation](https://terai-labs.github.io/terai)
- [Hono Documentation](https://hono.dev)
