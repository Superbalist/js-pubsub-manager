'use strict';

let pubsub = require('@superbalist/js-pubsub');
let DevNullPubSubAdapter = pubsub.DevNullPubSubAdapter;
let LocalPubSubAdapter = pubsub.LocalPubSubAdapter;
let redis = require('redis');
let RedisPubSubAdapter = require('@superbalist/js-pubsub-redis');
let googleCloudPubSub = require('@google-cloud/pubsub');
let GoogleCloudPubSubAdapter = require('@superbalist/js-pubsub-google-cloud');

/**
 * PubSubConnectionFactory Class
 *
 * @example
 * let pubSubManager = require('@superbalist/js-pubsub-manager');
 * let PubSubConnectionFactory = pubSubManager.PubSubConnectionFactory;
 *
 * let factory = new PubSubConnectionFactory();
 */
class PubSubConnectionFactory {
  /**
   * Factory an adapter with the given config.
   *
   * @param {string} driver
   * @param {Object} [config={}]
   * @return {module:@superbalist/js-pubsub.PubSubAdapterInterface}
   * @throws Error if the driver is not supported
   * @example
   * let config = {
   *   'driver': 'redis',
   *   'host': 'localhost',
   *   'port': '6379',
   *   'db': 0,
   * }
   * let adapter = factory.make('redis', config);
   */
  make(driver, config = {}) {
    switch (driver) {
      case '/dev/null':
        return new DevNullPubSubAdapter();
      case 'local':
        return new LocalPubSubAdapter();
      case 'redis':
        return this._makeRedisAdapter(config);
      case 'gcloud':
        return this._makeGoogleCloudAdapter(config);
    }
    throw new Error(`The driver [${driver}] is not supported.`);
  }

  /**
   * Create a RedisPubSubAdapter with the given config.
   *
   * @param {RedisAdapterConfig} config
   * @return {RedisPubSubAdapter}
   * @private
   */
  _makeRedisAdapter(config) {
    let client = redis.createClient(config);
    return new RedisPubSubAdapter(client);
}

  /**
   * Create a GoogleCloudPubSubAdapter with the given config.
   *
   * @param {GoogleCloudAdapterConfig} config
   * @return {GoogleCloudPubSubAdapter}
   * @private
   */
  _makeGoogleCloudAdapter(config) {
    let clientConfig = {
      'projectId': config.project_id,
      'keyFilename': config.key_file,
    };
    let client = googleCloudPubSub(clientConfig);

    return new GoogleCloudPubSubAdapter(
      client,
      config.client_identifier,
      config.auto_create_topics,
      config.auto_create_subscriptions
    );
  }
}

module.exports = PubSubConnectionFactory;
