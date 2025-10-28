import type { CollectionSlug, GlobalSlug } from 'payload'

import { createHash } from 'crypto'

import type { DBOperationArgs, RedisPluginConfig } from './types.js'

export const DEFAULT_TTL = 300

export function shouldCacheCollection({
	slug,
	config,
}: {
	config: RedisPluginConfig
	slug: string
}) {
	if (config.collections && Object.entries(config.collections).length > 0) {
		return Object.keys(config.collections).includes(slug)
	}
	if (config.globals && Object.entries(config.globals).length > 0) {
		return Object.keys(config.globals).includes(slug)
	}
	return false
}

export function generateCacheKey({
	slug,
	args,
	config,
	operation,
}: {
	args: DBOperationArgs
	config: RedisPluginConfig
	operation: string
	slug: string
}) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	const generateKey = config.defaultCacheOptions?.generateKey
	const key = args.req?.context?.cache?.key

	if (key) {
		if (prefix) {
			return `${prefix}:${key}`
		}
		return key
	}
	if (generateKey) {
		if (prefix) {
			return `${prefix}:${generateKey(operation, args)}`
		}
		return generateKey(operation, args)
	}

	const dataToHash = {
		slug,
		locale: args.locale,
		operation,
		where: args.where,
	}
	const hash = createHash('md5').update(JSON.stringify(dataToHash)).digest('hex')

	if (prefix) {
		return `${prefix}:${operation}:${hash}`
	}

	return `${operation}:${hash}`
}

export function getCollectionPattern({
	collection,
	config,
}: {
	collection: CollectionSlug
	config: RedisPluginConfig
}) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	if (prefix) {
		return `${prefix}:*:${collection}:*`
	}
	return `${collection}:*`
}

export function getGlobalPattern({
	config,
	global,
}: {
	config: RedisPluginConfig
	global: GlobalSlug
}) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	if (prefix) {
		return `${prefix}:*:${global}:*`
	}
	return `${global}:*`
}

export function getTagPatterns({ config, tags }: { config: RedisPluginConfig; tags: string[] }) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	if (prefix) {
		return tags.map((tag) => `${prefix}:*:*:*${tag}*`)
	}
	return tags.map((tag) => `${tag}*`)
}

export function debugLog({
	config,
	data,
	error = false,
	message,
}: {
	config: RedisPluginConfig
	data?: unknown
	error?: boolean
	message: string
}) {
	if (config.debug) {
		if (error) {
			return console.error(`[RedisPlugin] ${message} `, data ?? '')
		}
		console.log(`[RedisPlugin] ${message} `, data ?? '')
	}
}
