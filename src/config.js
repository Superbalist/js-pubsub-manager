"use strict";

let config = {
  /*
  |--------------------------------------------------------------------------
  | Default
  |--------------------------------------------------------------------------
  |
  | The default pub-sub connection to use.
  |
  | Supported: "/dev/null", "local", "redis", "gcloud"
  |
  */
  'default': process.env.PUBSUB_CONNECTION || 'REDIS',

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
      'driver': '/dev/null'
    },

    'local': {
      'driver': 'local'
    },

    'redis': {
      'driver': 'redis',
      'host': process.env.REDIS_HOST || 'localhost',
      'port': process.env.REDIS_PORT || 6379,
      'db': 0
    },

    'gcloud': {
      'driver': 'gcloud',
      'project_id': process.env.GOOGLE_CLOUD_PROJECT_ID,
      'key_file': process.env.GOOGLE_APPLICATION_CREDENTIALS,
      'client_identifier': null,
      'auto_create_topics': true,
      'auto_create_subscriptions': true
    }
  },
};

module.exports = config;
