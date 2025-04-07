# Better URL

Lightweight TypeScript library for parsing, building, and merging URL query strings.

## Features
- Type-safe query parameter handling
- Array support with deduplication
- Browser and Node.js compatible

## Installation
```bash
npm install better-url
```

## Usage
```typescript
import { parseQuery, buildQuery } from 'better-url'

const params = parseQuery('?page=1')
const query = buildQuery({ page: 2 })
```