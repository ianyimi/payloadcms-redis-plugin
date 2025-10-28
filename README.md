# PayloadCMS Redis Plugin

[![npm version](https://img.shields.io/npm/v/payloadcms-redis-plugin.svg)](https://www.npmjs.com/package/payloadcms-redis-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A transparent Redis caching layer plugin for Payload CMS v3 that automatically caches database queries to improve performance.

## Features

- **Automatic Query Caching** - Transparently caches all read operations (find, findOne, count, etc.)
- **Smart Invalidation** - Automatically invalidates cache on write operations (create, update, delete)
- **Flexible Configuration** - Enable caching per collection or globally with custom TTL
- **Per-Request Override** - Control cache behavior on individual requests
- **Custom Cache Keys** - Generate custom cache keys based on your needs
- **Pattern-Based Invalidation** - Invalidate related cache entries using Redis patterns
- **Debug Mode** - Optional logging for cache hits, misses, and invalidations
- **Zero Breaking Changes** - Works seamlessly with existing Payload applications

## Installation

```bash
npm install payloadcms-redis-plugin ioredis
# or
yarn add payloadcms-redis-plugin ioredis
# or
pnpm add payloadcms-redis-plugin ioredis
```

## Requirements

- Payload CMS v3.37.0 or higher
- Node.js 18.20.2+ or 20.9.0+
- Redis server

## Quick Start

### Basic Setup

```typescript
import { buildConfig } from 'payload'
import { redisCache } from 'payloadcms-redis-plugin'

export default buildConfig({
  plugins: [
    redisCache({
      // Connect via URL
      redis: {
        url: 'redis://localhost:6379',
      },
      // Enable caching for specific collections
      collections: {
        posts: true,
        articles: true,
      },
    }),
  ],
  // ... rest of your config
})
```

### Using Existing Redis Client

```typescript
import { Redis } from 'ioredis'
import { redisCache } from 'payloadcms-redis-plugin'

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'your-password',
  db: 0,
})

export default buildConfig({
  plugins: [
    redisCache({
      // Use existing client
      redis: {
        client: redisClient,
      },
      collections: {
        posts: true,
      },
    }),
  ],
})
```

## Configuration

### Plugin Options

```typescript
type RedisPluginConfig = {
  // Redis connection (provide either client or url)
  redis: { client: Redis; url?: never } | { client?: never; url: string }

  // Collections to cache
  collections?: Partial<Record<CollectionSlug, CacheOptions | true>>

  // Globals to cache
  globals?: Partial<Record<GlobalSlug, CacheOptions | true>>

  // Enable debug logging
  debug?: boolean

  // Default cache behavior
  defaultCacheOptions?: {
    generateKey?: (operation: string, args: DBOperationArgs) => string
    keyPrefix?: string
    ttl?: number // in seconds, default: 300 (5 minutes)
  }
}
```

### Cache Options

```typescript
type CacheOptions = {
  key?: string // Custom cache key override
  skip?: boolean // Skip cache for this collection/query
  tags?: string[] // Tags for grouped invalidation (future feature)
  ttl?: number // Time-to-live in seconds
}
```

### Advanced Configuration

```typescript
redisCache({
  redis: {
    url: process.env.REDIS_URL,
  },

  // Configure collections with custom TTL
  collections: {
    posts: {
      ttl: 600, // Cache posts for 10 minutes
      skip: false,
    },
    articles: {
      ttl: 1800, // Cache articles for 30 minutes
    },
    users: true, // Use default TTL (5 minutes)
  },

  // Cache global configurations
  globals: {
    settings: true,
  },

  // Custom default options
  defaultCacheOptions: {
    keyPrefix: 'myapp',
    ttl: 300,
    generateKey: (operation, args) => {
      // Custom key generation logic
      const { slug, where, locale } = args
      return `${slug}:${operation}:${locale || 'default'}:${JSON.stringify(where)}`
    },
  },

  // Enable debug logging
  debug: true,
})
```

## Usage

### Per-Request Cache Control

Override cache behavior for individual requests:

```typescript
// Skip cache for a specific query
const freshPosts = await payload.find({
  collection: 'posts',
  req: {
    context: {
      cache: {
        skip: true, // Bypass cache, always hit database
      },
    },
  },
})

// Custom TTL for a specific query
const shortLivedPosts = await payload.find({
  collection: 'posts',
  req: {
    context: {
      cache: {
        ttl: 60, // Cache for 1 minute only
      },
    },
  },
})

// Custom cache key
const customCachedPosts = await payload.find({
  collection: 'posts',
  req: {
    context: {
      cache: {
        key: 'posts:featured',
      },
    },
  },
})
```

### Cached Operations

The following database operations are automatically cached:

**Read Operations** (cached before hitting database):

- `find` - Query collections with pagination
- `findOne` - Query single document by ID
- `findGlobal` - Query global configurations
- `findGlobalVersions` - Query global version history
- `count` - Count documents
- `countVersions` - Count document versions
- `countGlobalVersions` - Count global versions
- `queryDrafts` - Query draft documents

**Write Operations** (invalidate cache after database update):

- `create` - Create new document
- `createMany` - Batch create
- `updateOne` - Update single document
- `updateMany` - Batch update
- `deleteOne` - Delete single document
- `deleteMany` - Batch delete
- `upsert` - Create or update
- `updateGlobal` - Update global config
- `updateGlobalVersion` - Update global version
- `deleteVersions` - Delete document versions

## How It Works

### Cache Key Generation

By default, cache keys are generated using MD5 hashing:

```
[prefix]:[slug]:[operation]:[md5-hash]
```

The hash includes: `{ slug, locale, operation, where }`

Example keys:

```
posts:find:a1b2c3d4e5f6g7h8
myapp:articles:count:x9y8z7w6v5u4t3s2
```

### Cache Flow

**Read Operations:**

```
Request → Check cache config → Check skip flag
  ↓ (cache enabled)
  Check Redis → HIT: Return cached → MISS: Hit DB → Store in Redis → Return
  ↓ (cache disabled/skipped)
  Hit DB directly
```

**Write Operations:**

```
Request → Execute on DB → Get cache config → Check skip flag
  ↓ (cache enabled)
  Invalidate pattern → Return result
  ↓ (cache disabled/skipped)
  Return result directly
```

### Automatic Invalidation

When data changes, the plugin automatically invalidates related cache entries using pattern matching:

```typescript
// Creating a post invalidates all post queries
await payload.create({
  collection: 'posts',
  data: { title: 'New Post' },
})
// Invalidates: posts:*, myapp:*:posts:*, etc.

// Updating an article invalidates all article queries
await payload.update({
  collection: 'articles',
  id: '123',
  data: { title: 'Updated' },
})
// Invalidates: articles:*, myapp:*:articles:*, etc.
```

## Debug Mode

Enable debug logging to monitor cache behavior:

```typescript
redisCache({
  redis: { url: 'redis://localhost:6379' },
  collections: { posts: true },
  debug: true,
})
```

Console output:

```
[RedisPlugin] [find] [posts] Cache HIT
[RedisPlugin] [find] [articles] Cache MISS
[RedisPlugin] [create] [posts] Invalidating pattern: posts:*
[RedisPlugin] [update] [posts] Cache SKIP (per-request)
```

## TypeScript Support

The plugin includes full TypeScript definitions and extends Payload's `RequestContext` type:

```typescript
declare module 'payload' {
  export interface RequestContext {
    cache?: {
      key?: string
      skip?: boolean
      tags?: string[]
      ttl?: number
    }
  }
}
```

## Performance Considerations

- **Default TTL**: 5 minutes (300 seconds)
- **Pattern Matching**: Uses `redis.keys()` for invalidation (consider SCAN in production with large keyspaces)
- **Silent Failures**: Cache errors don't break database queries
- **Memory**: Monitor Redis memory usage based on your cache strategy
- **Expiration**: Redis automatically removes expired keys

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build plugin
pnpm build

# Lint code
pnpm lint
```

## Examples

### E-commerce Site

```typescript
redisCache({
  redis: { url: process.env.REDIS_URL },
  collections: {
    products: { ttl: 3600 }, // Cache products for 1 hour
    categories: { ttl: 7200 }, // Cache categories for 2 hours
    orders: { skip: true }, // Never cache orders
    customers: { ttl: 600 }, // Cache customers for 10 minutes
  },
  globals: {
    siteSettings: { ttl: 86400 }, // Cache site settings for 24 hours
  },
})
```

### Blog Platform

```typescript
redisCache({
  redis: { url: process.env.REDIS_URL },
  collections: {
    posts: { ttl: 1800 }, // Cache posts for 30 minutes
    authors: { ttl: 3600 }, // Cache authors for 1 hour
    comments: { ttl: 300 }, // Cache comments for 5 minutes
  },
  defaultCacheOptions: {
    keyPrefix: 'blog',
    ttl: 600,
  },
  debug: process.env.NODE_ENV === 'development',
})
```

## Troubleshooting

### Redis Connection Issues

```typescript
// Test Redis connection
const redis = new Redis('redis://localhost:6379')
await redis.ping() // Should return 'PONG'
```

### Cache Not Working

1. Enable debug mode to see cache behavior
2. Verify collection/global is configured for caching
3. Check if `skip: true` is set
4. Ensure Redis server is running and accessible

### High Memory Usage

1. Reduce TTL values
2. Be selective about which collections to cache
3. Monitor Redis memory with `redis-cli info memory`
4. Consider using Redis maxmemory policies

## Contributing

Contributions are welcome! Please see the [GitHub repository](https://github.com/ianyimi/payloadcms-redis-plugin) for issues and pull requests.

## License

MIT

## Author

Isaiah Anyimi [pls hire me](https://zaye.dev)

## Links

- [GitHub Repository](https://github.com/ianyimi/payloadcms-redis-plugin)
- [NPM Package](https://www.npmjs.com/package/payloadcms-redis-plugin)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Redis Documentation](https://redis.io/docs)
- [ioredis Documentation](https://github.com/redis/ioredis)
