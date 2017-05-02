"use strict";

var pubsub = require('@superbalist/js-pubsub');
var DevNullPubSubAdapter = pubsub.DevNullPubSubAdapter;
var LocalPubSubAdapter = pubsub.LocalPubSubAdapter;
var redis = require('redis');
var RedisPubSubAdapter = require('@superbalist/js-pubsub-redis');
var googleCloudPubSub = require('@google-cloud/pubsub');
var GoogleCloudPubSubAdapter = require('@superbalist/js-pubsub-google-cloud');

class PubSubConnectionFactory {
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

  _makeRedisAdapter(config) {
    let client = redis.createClient(config);
    return new RedisPubSubAdapter(client);
}

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
