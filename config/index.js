/**
 * @author Vladimir Taytor <cetncat@gmail.com>
 */
const debug = require('debug')('app:configuration');

module.exports = (function () {
  const config = require('./config.json');
  if(config) {
    debug('Custom configuration found.');
    return config;
  } else {
    debug('Custom configuration not found! Running with default setup.');
    return require('./default.json');
  }
})();