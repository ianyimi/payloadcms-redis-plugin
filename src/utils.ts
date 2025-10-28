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
	versions = false,
}: {
	args: DBOperationArgs
	config: RedisPluginConfig
	operation: string
	slug: string
	versions?: boolean
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
			return `${prefix}:${generateKey({ args, operation, versions })}`
		}
		return generateKey({ args, operation, versions })
	}

	const dataToHash = {
		slug,
		locale: args.locale,
		operation,
		versions,
		where: args.where,
	}
	const hash = createHash('md5').update(JSON.stringify(dataToHash)).digest('hex')

	const slugKey = versions ? `${slug}:versions` : slug
	if (prefix) {
		return `${prefix}:${slugKey}:${operation}:${hash}`
	}

	return `${slugKey}:${operation}:${hash}`
}

export function getCollectionPattern({
	collection,
	config,
	versions = false,
}: {
	collection: CollectionSlug
	config: RedisPluginConfig
	versions?: boolean
}) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	const versionKey = versions ? 'versions:' : ''
	if (prefix) {
		return `${prefix}:*:${collection}:${versionKey}*`
	}
	return `${collection}:${versionKey}*`
}

export function getGlobalPattern({
	config,
	global,
	versions = false,
}: {
	config: RedisPluginConfig
	global: GlobalSlug
	versions?: boolean
}) {
	const prefix = config.defaultCacheOptions?.keyPrefix
	const versionKey = versions ? 'versions:' : ''
	if (prefix) {
		return `${prefix}:*:${global}:${versionKey}*`
	}
	return `${global}:${versionKey}*`
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
	if (!config.debug) {
		return
	}
	if (error) {
		return console.error(`[RedisPlugin] ${message} `, data ?? '')
	}
	console.log(`[RedisPlugin] ${message} `, data ?? '')
}
