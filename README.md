# @superbalist/js-pubsub-manager

A manager & factory for the [js-pubsub](https://github.com/Superbalist/js-pubsub) package.

[![Author](http://img.shields.io/badge/author-@superbalist-blue.svg?style=flat-square)](https://twitter.com/superbalist)
[![Build Status](https://img.shields.io/travis/Superbalist/js-pubsub-manager/master.svg?style=flat-square)](https://travis-ci.org/Superbalist/js-pubsub-manager)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@superbalist/js-pubsub-manager.svg)](https://www.npmjs.com/package/@superbalist/js-pubsub-manager)
[![NPM Downloads](https://img.shields.io/npm/dt/@superbalist/js-pubsub-manager.svg)](https://www.npmjs.com/package/@superbalist/js-pubsub-manager)

This package adds a factory and manager on top of the [js-pubsub](https://github.com/Superbalist/js-pubsub) package.

The following adapters are supported:
* Local
* /dev/null
* Redis
* Google Cloud
* HTTP

## Installation

```bash
npm install @superbalist/js-pubsub-manager
```

The package has a default configuration which uses the following environment variables.
```
PUBSUB_CONNECTION=redis

REDIS_HOST=localhost
REDIS_PORT=6379

GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/gcloud-key.json

HTTP_PUBSUB_URI=null
HTTP_PUBSUB_SUBSCRIBE_CONNECTION=redis
```

## Usage
```node
'use strict';

let pubSubManager = require('@superbalist/js-pubsub-manager');
let PubSubManager = pubSubManager.PubSubManager;
let PubSubConnectionFactory = pubSubManager.PubSubConnectionFactory;
let config = pubSubManager.config;

// add a custom connection to the config
config.connections.my_connection = {
  'driver': 'redis',
  'host': '192.168.0.1',
  'port': 6379,
  'db': 0
}

// create the connection manager
let factory = new PubSubConnectionFactory();
let manager = new PubSubManager(factory, config);

// get the default connection
let connection = manager.connection();

// publish a message
connection.publish('my_channel', {"first_name":"Matthew"});

// publish multiple messages to a channel
let messages = [
  'message 1',
  'message 2',
];
connection.publishBatch('my_channel', messages);

// subscribe to a channel
connection.subscribe('my_channel', (message) => {
  console.log(message);
  console.log(typeof message);
});

// publish a message over a custom or named connection
manager.connection('my_connection').publish('Hello World!');
```

## Adding a Custom Driver

Please see the [js-pubsub](https://github.com/Superbalist/js-pubsub) documentation  **Writing an Adapter**.

To include your custom driver, you can call the `extend()` function.

```node
'use strict';

let pubSubManager = require('@superbalist/js-pubsub-manager');
let PubSubManager = pubSubManager.PubSubManager;
let PubSubConnectionFactory = pubSubManager.PubSubConnectionFactory;
let config = pubSubManager.config;

// create the connection manager
config.connections.custom_driver = {
  // add custom config here
};
let factory = new PubSubConnectionFactory();
let manager = new PubSubManager(factory, config);

manager.extend('custom_driver', (config) => {
  // your callable must return an object which implements the https://github.com/Superbalist/js-pubsub/blob/master/src/PubSubAdapterInterface.js interface.
  return new MyCustomPubSubDriver(config);
});

// get an instance of your connection using a custom driver
let connection = manager.connection('custom_driver');
```
