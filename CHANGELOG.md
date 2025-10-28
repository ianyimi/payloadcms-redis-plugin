## [0.2.10](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.9...v0.2.10) (2025-10-28)


### Bug Fixes

* new readme, remove testing section for now ([309671b](https://github.com/ianyimi/payloadcms-redis-plugin/commit/309671bf9e2c03bec8ad780939fab688593d224a))

## [0.2.9](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.8...v0.2.9) (2025-10-28)


### Bug Fixes

* reverse order of default cache key generation so the db table slug comes before the operation ([af3875c](https://github.com/ianyimi/payloadcms-redis-plugin/commit/af3875c9d6112bde6cf99aebdc4dc7bbfc7de6a2))

## [0.2.8](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.7...v0.2.8) (2025-10-28)


### Bug Fixes

* add slug to default generateKeyPath for redis cache config ([de273da](https://github.com/ianyimi/payloadcms-redis-plugin/commit/de273daff2bab548ad5c251db061085d3f0a597d))

## [0.2.7](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.6...v0.2.7) (2025-10-28)


### Bug Fixes

* small refactors for DEFAULT_TTL const. fix generateCacheKey function so it doesnt use the circular request object in JSON.stringify to generate hashes for new keys for the cache ([3e7663f](https://github.com/ianyimi/payloadcms-redis-plugin/commit/3e7663f3347c9557d472193564f977864adee168))

## [0.2.6](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.5...v0.2.6) (2025-10-28)


### Bug Fixes

* combine shouldCacheGlobal into shouldCacheCollection, then fix this function to explicitly return false ([bcb08a3](https://github.com/ianyimi/payloadcms-redis-plugin/commit/bcb08a3f2b6c5cca1c78b2a65036c5f86aebf17a))

## [0.2.5](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.4...v0.2.5) (2025-10-28)


### Bug Fixes

* refactor logic to allow caching to work based on the default config if nothing is set per request. it will also allow you to specify default cacheoptions for each collection, though versions are not fully supported yet ([064e2e3](https://github.com/ianyimi/payloadcms-redis-plugin/commit/064e2e300d56350c4884ca6065e1a547e4127fab))

## [0.2.4](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.3...v0.2.4) (2025-10-28)


### Bug Fixes

* add debug logs at all cache operations for better visibility. some slight refactors to make logic more consistent across functions ([dd82182](https://github.com/ianyimi/payloadcms-redis-plugin/commit/dd82182347c91da3235d1ddb0d412779eca23a7e))

## [0.2.3](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.2...v0.2.3) (2025-10-28)


### Bug Fixes

* remove invalid import from index.ts file that is breaking projects ([be9ac63](https://github.com/ianyimi/payloadcms-redis-plugin/commit/be9ac63b15b4aa4f92eac590b380c6fa31358b36))

## [0.2.2](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.1...v0.2.2) (2025-10-28)


### Bug Fixes

* move extendedTypes declaration into regular types.ts file, remove custom handling for .d.ts files ([91c6e7e](https://github.com/ianyimi/payloadcms-redis-plugin/commit/91c6e7e99d8383ee3b9751f26d9cbb3bd03484e7))

## [0.2.1](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.2.0...v0.2.1) (2025-10-28)


### Bug Fixes

* try using TS module augmentation to update payload RequestContext type with cache options ([a75b130](https://github.com/ianyimi/payloadcms-redis-plugin/commit/a75b13081e3eed060fdcbc74d826857aba58154f))

# [0.2.0](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.1.2...v0.2.0) (2025-10-28)


### Features

* remove main from releaserc.json and workflow release.yml ([9dd3033](https://github.com/ianyimi/payloadcms-redis-plugin/commit/9dd30330b3ea6d3299d6faba274a8be90ac9dcd5))

## [0.1.2](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.1.1...v0.1.2) (2025-10-28)


### Bug Fixes

* update build outputs for plugin publishing to npm. rename exported plugin config to 'redis' from 'myPlugin' ([9a74f48](https://github.com/ianyimi/payloadcms-redis-plugin/commit/9a74f4885804000e8ec200b8071cf66508126fdc))

## [0.1.1](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.1.0...v0.1.1) (2025-10-28)


### Bug Fixes

* set package publishConfig to access: public so it goes on the npm registry ([2a13d88](https://github.com/ianyimi/payloadcms-redis-plugin/commit/2a13d88bf83f8bea3d8dca0e1084f5160f933f7b))

# [0.1.0](https://github.com/ianyimi/payloadcms-redis-plugin/compare/v0.0.0...v0.1.0) (2025-10-27)


### Bug Fixes

* call getGlobalPattern instead of getCollectionPattern in updateGlobal function ([fd6f512](https://github.com/ianyimi/payloadcms-redis-plugin/commit/fd6f5122b26a85f8d08e86e53217837619939374))
* update node version for compatibility in semver release gh action yml ([10c6b3e](https://github.com/ianyimi/payloadcms-redis-plugin/commit/10c6b3e43d381f8b9a8713d1efd0098246e19413))
* update pnpm version in semver release gh action yml ([d696f09](https://github.com/ianyimi/payloadcms-redis-plugin/commit/d696f0917ef8b2d43c7cd9429e5b344d5228b38e))


### Features

* add remaining dbAdapter operation function wrappers. refactor some types to remove some type redundancies ([b6a5ba7](https://github.com/ianyimi/payloadcms-redis-plugin/commit/b6a5ba754ba5d6c239a3d065434c75d65a819d85))
* initial version of redis cache plugin wrapping payloadcms database adapter. handles most basic operations, atm a few are still absent ([8ae4e53](https://github.com/ianyimi/payloadcms-redis-plugin/commit/8ae4e53fe424349d51a6a2f358e791196c3cb26d))
* project init from payload cms plugin template. agent-os project install and plan project step completed. ([30cdde3](https://github.com/ianyimi/payloadcms-redis-plugin/commit/30cdde3dc2bc267ed84f6c61f4e130ae39257fb1))
* update dbAdapter functions so they dont run if there is no cache config set ([0f71b35](https://github.com/ianyimi/payloadcms-redis-plugin/commit/0f71b35f8f3759ebad9c64e216104d2655ddd739))
