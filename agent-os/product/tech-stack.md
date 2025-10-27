# Tech Stack

## Core Framework
- **Payload CMS**: 3.37.0 - Core CMS framework that the plugin integrates with

## Language & Compilation
- **TypeScript** - Primary development language for type safety
- **SWC** - Fast TypeScript/JavaScript transpiler for build process

## Redis Integration
- **ioredis** - Production-ready Redis client with robust connection management, TypeScript support, and cluster compatibility

## Testing
- **Vitest** - Unit testing framework for testing cache logic, key generation, and adapter wrapping
- **Playwright** - End-to-end testing for integration testing with actual Payload CMS instances

## Development Environment
- **Next.js**: 15.4.4 - Used for development and testing environment (not required for plugin consumers)

## Code Quality
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting with `.prettierrc.json` configuration

## Build & Distribution
- **npm** - Package distribution platform
- **TypeScript Compiler** - Type definition generation for npm package

## Runtime Requirements (for plugin consumers)
- **Node.js** - Runtime environment
- **Redis Server** - Redis instance accessible via REDIS_URL environment variable
- **Payload CMS 3.x** - Compatible Payload CMS installation
- **Any Payload Database Adapter** - PostgreSQL, MongoDB, or other supported adapters

## Configuration
- **Environment Variables**:
  - `REDIS_URL` - Redis connection string (required)
- **Plugin Configuration**: TypeScript-based configuration passed to Payload plugin system

## Architecture Patterns
- **Adapter Pattern** - Wraps Payload database adapters transparently
- **Decorator Pattern** - Adds caching behavior without modifying underlying adapter
- **Hook System** - Leverages Payload's lifecycle hooks for cache invalidation
