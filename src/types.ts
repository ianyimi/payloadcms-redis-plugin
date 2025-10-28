import type { Redis } from 'ioredis'
import type {
	CollectionSlug,
	CountArgs,
	CountGlobalVersionArgs,
	FindArgs,
	FindGlobalArgs,
	FindOneArgs,
	GlobalSlug,
	QueryDraftsArgs,
} from 'payload'

export type DBOperationArgs =
	| CountArgs
	| CountGlobalVersionArgs
	| FindArgs
	| FindGlobalArgs
	| FindOneArgs
	| QueryDraftsArgs

export type RedisPluginConfig = {
	/**
	 * List of collections to add redis caching
	 */
	collections?: Partial<Record<CollectionSlug, true>>
	debug: boolean
	defaultCacheOptions?: {
		generateKey?: (operation: string, args: DBOperationArgs) => string
		keyPrefix: string
		ttl?: number
	}
	globals?: Partial<Record<GlobalSlug, CacheOptions | true>>
	redis:
	| {
		client: Redis
		url?: never
	}
	| {
		client?: never
		url: string
	}
}

export interface CacheOptions {
	/** Custom cache key (overrides auto-generated key) */
	key?: string

	/** Skip cache for this query and always hit the database */
	skip?: boolean

	/** Cache tags for grouped invalidation */
	tags?: string[]

	/** Custom TTL (time to live) in seconds for this query */
	ttl?: number
}

declare module 'payload' {
	export interface RequestContext {
		cache?: CacheOptions
	}
}
