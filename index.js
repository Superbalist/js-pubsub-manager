'use strict';

/** @module @superbalist/js-pubsub-manager */

let PubSubManager = require('./src/PubSubManager');
let PubSubConnectionFactory = require('./src/PubSubConnectionFactory');
let config = require('./src/config');

module.exports.PubSubManager = PubSubManager;
module.exports.PubSubConnectionFactory = PubSubConnectionFactory;
module.exports.config = config;
