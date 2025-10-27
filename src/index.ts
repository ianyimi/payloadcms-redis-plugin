import type { Redis } from 'ioredis'
import type { Config } from 'payload'

import type { RedisPluginConfig } from './types.js'

import { dbAdapterWithCache } from './adapter.js'

export const myPlugin =
	(pluginConfig: RedisPluginConfig) =>
		(config: Config): Config => {
			const incomingOnInit = config.onInit

			config.onInit = async (payload) => {
				// Ensure we are executing any existing onInit functions before running our own.
				if (incomingOnInit) {
					await incomingOnInit(payload)
				}

				let redis: Redis

				if (pluginConfig.redis.client) {
					redis = pluginConfig.redis.client
				} else if (pluginConfig.redis.url) {
					try {
						const { Redis } = await import('ioredis')
						redis = new Redis(pluginConfig.redis.url)
					} catch (err) {
						console.error(
							'[RedisPlugin] Failed to import ioredis. Please install it: npm install ioredis',
						)
						throw err
					}
				} else {
					throw new Error('[RedisPlugin] Either redis.url or redis.client must be provided')
				}

				try {
					await redis.ping()
				} catch (err) {
					console.error('[RedisPlugin] Failed to connect to Redis')
					throw err
				}

				const baseAdapter = payload.db

				if (!baseAdapter) {
					throw new Error('[RedisPlugin] No database adapter found')
				}

				payload.db = dbAdapterWithCache({ baseAdapter, config: pluginConfig, redis })
			}

			return config
		}
