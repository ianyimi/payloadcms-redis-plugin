import type { CacheOptions } from './types.ts'

module 'payload' {
	export interface RequestContext {
		cache?: CacheOptions
	}
}
