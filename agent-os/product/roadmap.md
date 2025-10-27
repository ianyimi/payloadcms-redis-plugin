# Product Roadmap

1. [ ] Core Redis Connection Setup — Create ioredis client initialization, connection management, and error handling for Redis connections using REDIS_URL environment variable. Include connection health checks and graceful degradation if Redis is unavailable. `S`

2. [ ] Database Adapter Wrapper Foundation — Build the core adapter wrapper that intercepts all database adapter method calls (find, findOne, create, update, delete, etc.) and implements pass-through functionality to the underlying adapter. Establish the architectural pattern for wrapping any Payload database adapter. `M`

3. [ ] Basic Cache Read Operations — Implement cache-checking logic for read operations (find, findOne, count) that generates cache keys from query parameters, checks Redis before hitting the database, and stores successful query results in cache with default TTL. `M`

4. [ ] Configurable Cache Key Generation — Add plugin configuration option for custom cache key generation functions, allowing developers to control how cache keys are structured based on collection names, query parameters, and request context. Include sensible default key generation strategy. `S`

5. [ ] Cache TTL Configuration — Implement global default TTL configuration at plugin level, with support for per-collection TTL overrides. Allow TTL values to be specified in seconds with validation and sensible defaults (e.g., 5 minutes). `S`

6. [ ] Per-Request Cache Control — Add context-based cache configuration that allows individual requests to specify cache behavior (bypass cache, custom TTL, cache-only reads) through Payload's request context system. `M`

7. [ ] Automatic Cache Invalidation via Hooks — Implement Payload lifecycle hooks (afterChange, afterDelete) to automatically invalidate cached entries when database records are modified. Support configurable invalidation strategies (invalidate single item, invalidate collection, custom invalidation functions). `L`

8. [ ] Cache Statistics and Debugging — Add optional cache hit/miss tracking, debug logging for cache operations, and configuration option to expose cache statistics for monitoring cache effectiveness and troubleshooting. `S`

> Notes
> - Items are ordered to build incrementally from foundation to full functionality
> - Items 1-3 establish MVP caching capability
> - Items 4-6 add essential configuration flexibility
> - Item 7 solves cache consistency (most complex feature)
> - Item 8 provides operational visibility
> - Each item delivers end-to-end testable functionality
