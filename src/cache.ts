import type { Redis } from 'ioredis'

import type { CacheOptions, DBOperationArgs, RedisPluginConfig } from './types.js'

export function getCacheOptions({
	slug,
	args,
	config,
}: {
	args: DBOperationArgs
	config: RedisPluginConfig
	slug: string
}): CacheOptions | undefined {
	if (args.req?.context?.cache) {
		return args.req.context.cache
	}
	for (const [key, value] of Object.entries(config.collections ?? {})) {
		if (key === slug) {
			if (typeof value === 'boolean') {
				return config.defaultCacheOptions
			}
			return value
		}
	}
	for (const [key, value] of Object.entries(config.globals ?? {})) {
		if (key === slug) {
			if (typeof value === 'boolean') {
				return config.defaultCacheOptions
			}
			return value
		}
	}

	return undefined
	// return getCacheContext();
}

export async function getFromCache<T>({
	key,
	redis,
}: {
	key: string
	redis: Redis
}): Promise<null | T> {
	try {
		const cached = await redis.get(key)
		if (cached) {
			return JSON.parse(cached) as T
		}
		return null
	} catch (err) {
		console.error('[RedisPlugin] Error reading from cache', err)
		return null
	}
}

export async function setInCache<T>({
	data,
	key,
	redis,
	ttl,
}: {
	data: T
	key: string
	redis: Redis
	ttl: number
}): Promise<void> {
	try {
		await redis.setex(key, ttl, JSON.stringify(data))
	} catch (err) {
		console.error('[RedisPlugin] Error writing to cache: ', err)
	}
}

export async function invalidateByPattern({
	pattern,
	redis,
}: {
	pattern: string
	redis: Redis
}): Promise<void> {
	try {
		const keys = await redis.keys(pattern)
		if (keys.length > 0) {
			await redis.del(...keys)
		}
	} catch (err) {
		console.error('[RedisPlugin] Error invalidating cache: ', err)
	}
}
