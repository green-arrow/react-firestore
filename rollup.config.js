const rollupConfig = require('kcd-scripts/dist/config/rollup.config');

rollupConfig.output[0].exports = 'named';
rollupConfig.output[0].globals['prop-types'] = 'PropTypes';

module.exports = rollupConfig;
