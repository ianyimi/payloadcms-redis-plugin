import type { CacheOptions } from './types.ts'

module 'payload' {
	interface RequestContext {
		cache?: CacheOptions
	}
}
