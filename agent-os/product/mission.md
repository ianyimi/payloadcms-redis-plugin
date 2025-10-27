# Product Mission

## Pitch
Payload CMS Redis Plugin is a lightweight caching layer that helps developers running high-traffic Payload CMS sites reduce database load by providing transparent Redis caching for all database operations, regardless of the underlying database provider.

## Users

### Primary Customers
- **High-Traffic Payload CMS Developers**: Teams managing Payload CMS sites experiencing database performance bottlenecks from heavy traffic across admin panel, REST API, and Local API
- **Performance-Conscious Developers**: Any Payload CMS user seeking to optimize database query performance through intelligent caching

### User Personas
**Full-Stack Developer** (25-45)
- **Role:** Lead Developer / Technical Architect
- **Context:** Managing production Payload CMS sites with high concurrent user loads
- **Pain Points:** Database servers becoming overwhelmed by repetitive queries from admin panel, API endpoints, and local API calls; difficulty scaling database infrastructure cost-effectively
- **Goals:** Reduce database load without rewriting application code; implement caching transparently without changing existing Payload queries

## The Problem

### Database Overload in High-Traffic Payload CMS Sites
High-traffic Payload CMS installations generate excessive database queries from multiple sources: admin panel operations, REST API requests, and Local API calls. This creates database performance bottlenecks, increased infrastructure costs, and potential downtime.

**Our Solution:** A transparent database adapter wrapper that intercepts all database calls and checks Redis cache first, dramatically reducing actual database hits without requiring any changes to existing application code.

## Differentiators

### Universal Database Provider Compatibility
Unlike database-specific caching solutions, our plugin works at the Payload adapter level, meaning it functions identically whether you're using PostgreSQL, MongoDB, or any other supported database provider. This architectural approach makes it universally applicable across any Payload CMS deployment.

### Zero-Code Integration
While other caching solutions require manual cache key management and explicit cache calls throughout your codebase, our plugin provides automatic caching for all database operations by wrapping the database adapter. This results in faster implementation and no risk of missing cache opportunities.

### Intelligent Cache Invalidation
Rather than requiring manual cache clearing or relying on TTL expiration alone, the plugin integrates with Payload's hook system to automatically invalidate cached entries when database records are modified. This ensures cache consistency without developer intervention.

## Key Features

### Core Features
- **Database Adapter Wrapper:** Transparently wraps any Payload database adapter to add Redis caching to all database operations without code changes
- **Redis Connection Management:** Simple configuration via REDIS_URL environment variable using the battle-tested ioredis client
- **Universal Provider Support:** Works seamlessly with PostgreSQL, MongoDB, and any other Payload-supported database provider

### Configuration Features
- **Customizable Cache Keys:** Provide your own key generation function to control cache key structure and naming conventions
- **Flexible TTL Configuration:** Set default cache time-to-live values globally with the ability to override per collection or operation
- **Per-Request Cache Control:** Specify cache behavior on individual requests through context, enabling fine-grained control when needed

### Advanced Features
- **Smart Cache Invalidation:** Automatic cache clearing via Payload hooks when database records are created, updated, or deleted
- **Hook-Based Invalidation Strategy:** Configurable invalidation rules that leverage Payload's lifecycle hooks for precise cache management
