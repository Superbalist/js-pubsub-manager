"use strict";

class PubSubManager {
  constructor(factory, config) {
    this.factory = factory;
    this.config = config;
    this.connections = {};
    this.extensions = {};
  }

  connection(name = null) {
    if (name === null) {
      name = this.getDefaultConnection();
    }

    if (!this.connections.hasOwnProperty(name)) {
      this.connections[name] = this._makeConnection(name);
    }

    return this.connections[name];
  }

  _makeConnection(name) {
    let config = this._getConnectionConfig(name);

    if (this.extensions.hasOwnProperty(name)) {
      return this.extensions[name](config)
    }

    if (!config.hasOwnProperty('driver')) {
      throw new Error(`The pub-sub connection [${name}] is missing a "driver" config var.`);
    }

    return this.factory.make(config.driver, config);
  }

  _getConnectionConfig(name) {
    let connections = this.config.connections;
    if (!connections.hasOwnProperty(name)) {
      throw new Error(`The pub-sub connection [${name}] is not configured.`);
    }

    return connections[name];
  }

  getDefaultConnection() {
    return this.config.default
  }

  setDefaultConnection(name) {
    this.config.default = name;
  }

  extend(name, resolver) {
    this.extensions[name] = resolver;
  }
}

module.exports = PubSubManager;
