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
	DEFAULT_TTL,
	generateCacheKey,
	getCollectionPattern,
	getGlobalPattern,
	shouldCacheCollection,
} from './utils.js'

export function dbAdapterWithCache({
	baseAdapter,
	redis,
	config = { defaultCacheOptions: { ttl: DEFAULT_TTL }, redis: { url: '' } },
}: {
	baseAdapter: DatabaseAdapter
	config: RedisPluginConfig
	redis: Redis
}): DatabaseAdapter {
	return {
		...baseAdapter,
		count: async (args) => {
			const { collection } = args
			const cache = getCacheOptions({ slug: collection, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: count ${collection}` })
				return baseAdapter.count(args)
			}

			const cacheKey = generateCacheKey({ slug: collection, args, config, operation: 'count' })
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: count ${collection}` })
				return cached
			}

			const result = await baseAdapter.count(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: count ${collection}` })

			return result
		},
		countGlobalVersions: async (args) => {
			const { global } = args
			const cache = getCacheOptions({ slug: global, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: global, config })) {
				debugLog({ config, message: `Cache SKIP: countGlobalVersions ${global}` })
				return baseAdapter.countGlobalVersions(args)
			}

			const cacheKey = generateCacheKey({
				slug: global,
				args,
				config,
				operation: 'countGlobalVersions',
			})
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: countGlobalVersions ${global}` })
				return cached
			}

			const result = await baseAdapter.countGlobalVersions(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: countGlobalVersions ${global}` })
			return result
		},
		countVersions: async (args) => {
			const { collection } = args
			const cache = getCacheOptions({ slug: collection, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: countVersions ${collection}` })
				return baseAdapter.countVersions(args)
			}

			const cacheKey = generateCacheKey({
				slug: collection,
				args,
				config,
				operation: 'countVersions',
			})
			const cached = await getFromCache<{ totalDocs: number }>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: countVersions ${collection}` })
				return cached
			}

			const result = await baseAdapter.countVersions(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: countVersions ${collection}` })
			return result
		},
		create: async (args) => {
			const { collection } = args
			const result = await baseAdapter.create(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: create ${collection}` })
				return
			}
			const pattern = getCollectionPattern({ collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: create ${collection}` })
			return result
		},
		deleteMany: async (args) => {
			const { collection } = args
			const result = await baseAdapter.deleteMany(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: deleteMany ${collection}` })
				return
			}
			const pattern = getCollectionPattern({ collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: deleteMany ${collection}` })
			return result
		},
		deleteOne: async (args) => {
			const { collection } = args
			const result = await baseAdapter.deleteOne(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: deleteOne ${collection}` })
				return
			}
			const pattern = getCollectionPattern({ collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: deleteOne ${collection}` })
			return result
		},
		deleteVersions: async (args) => {
			const { collection } = args
			const result = await baseAdapter.deleteVersions(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: deleteVersions ${collection}` })
				return
			}
			const pattern = getCollectionPattern({ collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: deleteVersions ${collection}` })
			return result
		},
		find: async <T = TypeWithID>(args: FindArgs) => {
			const { collection } = args
			const cache = getCacheOptions({ slug: collection, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: find ${collection}` })
				return baseAdapter.find<T>(args)
			}

			const cacheKey = generateCacheKey({ slug: collection, args, config, operation: 'find' })
			const cached = await getFromCache<PaginatedDocs<T>>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: find ${collection}` })
				return cached
			}

			const result = await baseAdapter.find<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: find ${collection}` })

			return result
		},
		findGlobal: async <T extends Record<string, unknown>>(args: FindGlobalArgs) => {
			const { slug } = args
			const cache = getCacheOptions({ slug, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug, config })) {
				debugLog({ config, message: `Cache SKIP: findGlobal ${slug}` })
				return baseAdapter.findGlobal<T>(args)
			}

			const cacheKey = generateCacheKey({ slug, args, config, operation: 'findGlobal' })
			const cached = await getFromCache<T>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: findGlobal ${slug}` })
				return cached
			}

			const result = await baseAdapter.findGlobal<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: findGlobal ${slug}` })

			return result
		},
		findGlobalVersions: async <T>(args: FindGlobalVersionsArgs) => {
			const { global } = args
			const cache = getCacheOptions({ slug: global, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: global, config })) {
				debugLog({ config, message: `Cache SKIP: findGlobalVersions ${global}` })
				return baseAdapter.findGlobalVersions<T>(args)
			}

			const cacheKey = generateCacheKey({
				slug: global,
				args,
				config,
				operation: 'findGlobalVersions',
			})
			const cached = await getFromCache<PaginatedDocs<TypeWithVersion<T>>>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: findGlobalVersions ${global}` })
				return cached
			}

			const result = await baseAdapter.findGlobalVersions<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: findGlobalVersions ${global}` })

			return result
		},
		findOne: async <T extends TypeWithID>(args: FindOneArgs) => {
			const { collection } = args
			const cache = getCacheOptions({ slug: collection, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: findOne ${collection}` })
				return baseAdapter.findOne<T>(args)
			}

			const cacheKey = generateCacheKey({ slug: collection, args, config, operation: 'findOne' })
			const cached = await getFromCache<T>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: findOne ${collection}` })
				return cached
			}

			const result = await baseAdapter.findOne<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: findOne ${collection}` })

			return result
		},
		queryDrafts: async <T>(args: QueryDraftsArgs) => {
			const { collection } = args
			const cache = getCacheOptions({ slug: collection, args, config })

			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: queryDrafts ${collection}` })
				return baseAdapter.queryDrafts<T>(args)
			}

			const cacheKey = generateCacheKey({
				slug: collection,
				args,
				config,
				operation: 'queryDrafts',
			})
			const cached = await getFromCache<PaginatedDocs<T>>({ key: cacheKey, redis })
			if (cached) {
				debugLog({ config, message: `Cache HIT: queryDrafts ${collection}` })
				return cached
			}

			const result = await baseAdapter.queryDrafts<T>(args)
			await setInCache({ data: result, key: cacheKey, redis, ttl: cache?.ttl ?? DEFAULT_TTL })
			debugLog({ config, message: `Cache MISS: queryDrafts ${collection}` })

			return result
		},
		updateGlobal: async (args) => {
			const { slug } = args
			const result = await baseAdapter.updateGlobal(args)
			const cache = getCacheOptions({ slug, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug, config })) {
				debugLog({ config, message: `Cache SKIP: updateGlobal ${slug}` })
				return result
			}
			const pattern = getGlobalPattern({ config, global: slug })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: updateGlobal ${slug}` })
			return result
		},
		updateGlobalVersion: async (args) => {
			const { global } = args
			const result = await baseAdapter.updateGlobalVersion(args)
			const cache = getCacheOptions({ slug: global, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: global, config })) {
				debugLog({ config, message: `Cache SKIP: updateGlobalVersion ${global}` })
				return result
			}
			const pattern = getGlobalPattern({ config, global: args.global })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: updateGlobalVersion ${global}` })
			return result
		},
		updateMany: async (args) => {
			const { collection } = args
			const result = await baseAdapter.updateMany(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: updateMany ${collection}` })
				return result
			}
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: updateMany ${collection}` })
			return result
		},
		updateOne: async (args) => {
			const { collection } = args
			const result = await baseAdapter.updateOne(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: updateOne ${collection}` })
				return result
			}
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: updateOne ${collection}` })
			return result
		},
		upsert: async (args) => {
			const { collection } = args
			const result = await baseAdapter.upsert(args)
			const cache = getCacheOptions({ slug: collection, args, config })
			if (cache?.skip || !shouldCacheCollection({ slug: collection, config })) {
				debugLog({ config, message: `Cache SKIP: upsert ${collection}` })
				return result
			}
			const pattern = getCollectionPattern({ collection: args.collection, config })
			await invalidateByPattern({ pattern, redis })
			debugLog({ config, message: `Cache INVALIDATE: upsert ${collection}` })
			return result
		},
	}
}
