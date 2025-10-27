import type { Redis } from 'ioredis'
import type {
	DatabaseAdapter,
	FindArgs,
	FindGlobalArgs,
	FindGlobalVersionsArgs,
	FindOneArgs,
	PaginatedDocs,
	QueryDraftsArgs,
	TypeWithID,
	TypeWithVersion,
} from 'payload'

import type { RedisPluginConfig } from './types.js'

import { getCacheOptions, getFromCache, invalidateByPattern, setInCache } from './cache.js'
import {
	debugLog,
	generateCacheKey,
	getCollectionPattern,
	getGlobalPattern,
	shouldCacheCollection,
} from './utils.js'

export function dbAdapterWithCache({
	baseAdapter,
	config,
	redis,
}: {
	baseAdapter: DatabaseAdapter
	config: RedisPluginConfig
	redis: Redis
}): DatabaseAdapter {
	const defaultTTL = config.defaultCacheOptions?.ttl ?? 300 // 5 minutes (300s)

	return {
		...baseAdapter,
		count: async (args) => {
			const { collection } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: count ${collection}` })
				return baseAdapter.count(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'count' })
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.count(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		countGlobalVersions: async (args) => {
			const { global } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: global, config })) {
				debugLog({ config, message: `Cache SKIP: countGlobalVersions ${global}` })
				return baseAdapter.countGlobalVersions(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'countGlobalVersions' })
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.countGlobalVersions(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })
			return result
		},
		countVersions: async (args) => {
			const { collection } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: countVersions ${collection}` })
				return baseAdapter.countVersions(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'countVersions' })
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.countVersions(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })
			return result
		},
		create: async (args) => {
			const result = await baseAdapter.create(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		deleteMany: async (args) => {
			const result = await baseAdapter.deleteMany(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		deleteOne: async (args) => {
			const result = await baseAdapter.deleteOne(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		deleteVersions: async (args) => {
			const result = await baseAdapter.deleteVersions(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		find: async <T = TypeWithID>(args: FindArgs) => {
			const { collection } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				return baseAdapter.find<T>(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'find' })
			const cached = await getFromCache<PaginatedDocs<T>>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.find<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		findGlobal: async <T extends Record<string, unknown>>(args: FindGlobalArgs) => {
			const { slug } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug, config })) {
				return baseAdapter.findGlobal<T>(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'findGlobal' })
			const cached = await getFromCache<T>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.findGlobal<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		findGlobalVersions: async <T>(args: FindGlobalVersionsArgs) => {
			const { global } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: global, config })) {
				return baseAdapter.findGlobalVersions<T>(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'findGlobalVersions' })
			const cached = await getFromCache<PaginatedDocs<TypeWithVersion<T>>>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.findGlobalVersions<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		findOne: async <T extends TypeWithID>(args: FindOneArgs) => {
			const { collection } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				return baseAdapter.findOne<T>(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'findOne' })
			const cached = await getFromCache<T>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.findOne<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		queryDrafts: async <T>(args: QueryDraftsArgs) => {
			const { collection } = args
			const cache = getCacheOptions(args)

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				return baseAdapter.queryDrafts<T>(args)
			}

			const cacheKey = generateCacheKey({ args, config, operation: 'queryDrafts' })
			const cached = await getFromCache<PaginatedDocs<T>>({ key: cacheKey, redis })
			if (cached) {
				return cached
			}

			const result = await baseAdapter.queryDrafts<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? defaultTTL })

			return result
		},
		updateGlobal: async (args) => {
			const result = await baseAdapter.updateGlobal(args)
			const pattern = getGlobalPattern({ config, global: args.slug })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		updateGlobalVersion: async (args) => {
			const result = await baseAdapter.updateGlobalVersion(args)
			const pattern = getGlobalPattern({ config, global: args.global })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		updateMany: async (args) => {
			const result = await baseAdapter.updateMany(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		updateOne: async (args) => {
			const result = await baseAdapter.updateOne(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
		upsert: async (args) => {
			const result = await baseAdapter.upsert(args)
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			return result
		},
	}
}
