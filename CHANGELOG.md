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
