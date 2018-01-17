const jestConfig = require('kcd-scripts/jest');

jestConfig.snapshotSerializers = jestConfig.snapshotSerializers || [];
jestConfig.setupFiles = jestConfig.setupFiles || [];
jestConfig.setupFiles.push('<rootDir>/other/setup-tests.js');

module.exports = jestConfig;
