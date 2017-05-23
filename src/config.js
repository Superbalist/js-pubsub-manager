'use strict';

/**
 * @typedef {Object} ManagerConfig
 * @property {string} [default=process.env.PUBSUB_CONNECTION || 'REDIS']
 * @property {Object} [connections]
 * @property {DevNullAdapterConfig} connections./dev/null
 * @property {LocalAdapterConfig} connections.local
 * @property {RedisAdapterConfig} connections.redis
 * @property {GoogleCloudAdapterConfig} connections.gcloud
 * @property {HTTPAdapterConfig} connections.http
 */

/**
 * @typedef {Object} DevNullAdapterConfig
 * @property {string} [driver=/dev/null]
 */

/**
 * @typedef {Object} LocalAdapterConfig
 * @property {string} [driver=local]
 */

/**
 * @typedef {Object} RedisAdapterConfig
 * @property {string} [driver=redis]
 * @property {string} [host=process.env.REDIS_HOST || 'localhost']
 * @property {number} [port=process.env.REDIS_PORT || 6379]
 * @property {number} [db=0]
 */

/**
 * @typedef {Object} GoogleCloudAdapterConfig
 * @property {string} [driver=gcloud]
 * @property {string} [project_id=process.env.GOOGLE_CLOUD_PROJECT_ID]
 * @property {string} [key_file=process.env.GOOGLE_APPLICATION_CREDENTIALS]
 * @property {?string} [client_identifier]
 * @property {boolean} [auto_create_topics=true]
 * @property {boolean} [auto_create_subscriptions=true]
 */

/**
 * @typedef {Object} HTTPAdapterConfig
 * @property {string} [driver=http]
 * @property {string} [uri=process.env.HTTP_PUBSUB_URI]
 * @property {Object} [subscribe_connection=process.env.HTTP_PUBSUB_SUBSCRIBE_CONNECTION || 'redis']
 */

/**
 *
 * @type {ManagerConfig}
 */
let config = {
  /*
  |--------------------------------------------------------------------------
  | Default
  |--------------------------------------------------------------------------
  |
  | The default pub-sub connection to use.
  |
  | Supported: "/dev/null", "local", "redis", "gcloud", "http"
  |
  */
  'default': process.env.PUBSUB_CONNECTION || 'redis',

  /*
  |--------------------------------------------------------------------------
  | Pub-Sub Connections
  |--------------------------------------------------------------------------
  |
  | The available pub-sub connections to use.
  |
  | A default configuration has been provided for all adapters shipped with
  | the package.
  |
  */
  'connections': {

    '/dev/null': {
      'driver': '/dev/null',
    },

    'local': {
      'driver': 'local',
    },

    'redis': {
      'driver': 'redis',
      'host': process.env.REDIS_HOST || 'localhost',
      'port': process.env.REDIS_PORT || 6379,
      'db': 0,
    },

    'gcloud': {
      'driver': 'gcloud',
      'project_id': process.env.GOOGLE_CLOUD_PROJECT_ID,
      'key_file': process.env.GOOGLE_APPLICATION_CREDENTIALS,
      'client_identifier': null,
      'auto_create_topics': true,
      'auto_create_subscriptions': true,
    },

    'http': {
      'driver': 'http',
      'uri': process.env.HTTP_PUBSUB_URI,
      'subscribe_connection': process.env.HTTP_PUBSUB_SUBSCRIBE_CONNECTION || 'redis',
    },
  },
};

module.exports = config;
