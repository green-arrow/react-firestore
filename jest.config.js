const jestConfig = require('kcd-scripts/scripts/jest');

jestConfig.snapshotSerializers = jestConfig.snapshotSerializers || [];
jestConfig.setupFiles = jestConfig.setupFiles || [];
jestConfig.setupFiles.push('<rootDir>/other/setup-tests.js');
jestConfig.testMatch = ['**/*.test.js'];

module.exports = jestConfig;
