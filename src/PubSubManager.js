'use strict';

/**
 * @callback extensionCallback
 * @param {Object} config
 */

/**
 * PubSubManager Class
 *
 * @example
 * let pubSubManager = require('@superbalist/js-pubsub-manager');
 * let PubSubManager = pubSubManager.PubSubManager;
 * let PubSubConnectionFactory = pubSubManager.PubSubConnectionFactory;
 * let config = pubSubManager.config;
 *
 * let factory = new PubSubConnectionFactory();
 * let manager = new PubSubManager(factory, config);
 */
class PubSubManager {
  /**
   * Construct a PubSubManager
   *
   * @param {PubSubConnectionFactory} factory
   * @param {ManagerConfig} config
   */
  constructor(factory, config) {
    /**
     * @type {PubSubConnectionFactory}
     */
    this.factory = factory;

    /**
     * @type {ManagerConfig}
     */
    this.config = config;

    /**
     * @type {Object.<string, module:pubsub.PubSubAdapterInterface>}
     */
    this.connections = {};

    /**
     * @type {Object.<string, extensionCallback>}
     */
    this.extensions = {};
  }

  /**
   * Return a connection to a PubSub adapter.
   *
   * If the name is null, the default connection is used.
   *
   * When creating the connection, the manager will first check if a connection
   * is already established.
   * If the connection does not exist, it will create a new connection.
   *
   * @param {?string} [name]
   * @return {module:pubsub.PubSubAdapterInterface}
   * @example
   * let adapter = manager.connection();
   * adapter = manager.connection('redis');
   * adapter = manager.connection('gcloud');
   */
  connection(name = null) {
    if (name === null) {
      name = this.getDefaultConnection();
    }

    if (!this.connections.hasOwnProperty(name)) {
      this.connections[name] = this._makeConnection(name);
    }

    return this.connections[name];
  }

  /**
   * Create a connection to a PubSub adapter.
   *
   * @param {string} name
   * @return {module:pubsub.PubSubAdapterInterface}
   * @private
   * @throws Error if the connection config is missing a 'driver' attribute
   */
  _makeConnection(name) {
    let config = this._getConnectionConfig(name);

    if (this.extensions.hasOwnProperty(name)) {
      return this.extensions[name](config);
    }

    if (!config.hasOwnProperty('driver')) {
      throw new Error(
        `The pub-sub connection [${name}] is missing a "driver" config var.`
      );
    }

    return this.factory.make(config.driver, config);
  }

  /**
   * Return the config for the given connection name.
   *
   * @param {string} name
   * @return {Object}
   * @private
   * @throws Error if the connection is not configured
   */
  _getConnectionConfig(name) {
    let connections = this.config.connections;
    if (!connections.hasOwnProperty(name)) {
      throw new Error(`The pub-sub connection [${name}] is not configured.`);
    }

    return connections[name];
  }

  /**
   * Return the default connection name.
   *
   * @return {string}
   * @example
   * console.log(manager.getDefaultConnection());
   */
  getDefaultConnection() {
    return this.config.default;
  }

  /**
   * Set the default connection name.
   *
   * @param {string} name
   * @example
   * manager.setDefaultConnection('gcloud');
   */
  setDefaultConnection(name) {
    this.config.default = name;
  }

  /**
   * Register an extension connection resolver.
   *
   * @param {string} name
   * @param {extensionCallback} resolver
   * @example
   * manager.extend('custom_driver', (config) => {
   *   return new MyCustomPubSubDriver(config);
   * });
   *
   * let connection = manager.connection('custom_driver');
});
   */
  extend(name, resolver) {
    this.extensions[name] = resolver;
  }
}

module.exports = PubSubManager;
